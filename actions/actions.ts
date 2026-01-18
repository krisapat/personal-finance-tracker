"use server"

import { budgetSchema, profileSchema, transactionListSchema, validateWithZod } from "@/utils/schema"
import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cache } from "react"
import db from "@/utils/db"
import { startOfMonth, endOfMonth, getDaysInMonth, subDays } from "date-fns"
import type { TransactionItem, DailyStatus, DailySummaryForCalendar, MonthlySummaryData, CategoryBreakdown } from "@/utils/types"

export const getAuthUser = cache(async () => {
  const user = await currentUser()
  if (!user) throw new Error("User not authenticated")
  if (!user.privateMetadata.hasProfile) redirect("/createProfile")
  return user
})

export type FormState = { message: string; success?: boolean }

const renderError = (error: unknown): FormState => {
  return {
    message: error instanceof Error ? error.message : "An unknown error occurred",
    success: false,
  }
}

// ==================== Profile Actions ====================

export const createProfileAction = async (
  _prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await currentUser()
    if (!user) throw new Error("User not authenticated")
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = validateWithZod(profileSchema, rawData)

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        profileImage: user.imageUrl || "",
        ...validatedData,
      },
    })

    const client = await clerkClient()
    await client.users.updateUserMetadata(user.id, {
      privateMetadata: { hasProfile: true },
    })
  } catch (errors) {
    return renderError(errors)
  }
  redirect("/")
}

// ==================== Budget Actions ====================

export const createBudgetAction = async (
  _prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const user = await currentUser()
    if (!user) throw new Error("คุณยังไม่ได้ลงชื่อเข้าใช้งาน")
    const rawData = Object.fromEntries(formData.entries())
    const validatedData = validateWithZod(budgetSchema, rawData)
    const pathname = formData.get("pathname") as string
    await db.budget.upsert({
      where: { profileId: user.id },
      update: { amount: validatedData.amount },
      create: {
        amount: validatedData.amount,
        profileId: user.id,
      },
    })
    revalidatePath(pathname)
    return { message: "สร้างงบรายวันสำเร็จ!", success: true }
  } catch (errors) {
    return renderError(errors)
  }
}

export const fetchProfile = cache(async () => {
  try {
    const user = await currentUser()
    if (!user) {
      throw new Error("คุณยังไม่ได้ลงชื่อเข้าใช้งาน")
    }
    const profile = await db.profile.findFirst({
      where: { clerkId: user.id },
      select: {
        userName: true,
      },
    })

    return profile
  } catch {
    return null
  }
})

export const fetchBudget = cache(async (userId: string) => {
  try {
    const asset = await db.budget.findFirst({
      where: { profileId: userId },
      select: {
        amount: true,
      },
    })
    return asset ? { amount: Number(asset.amount) } : null
  } catch (error) {
    console.error(error)
    return null
  }
})

// ==================== Transaction Actions ====================

/** Parse date string in format "dd-MM-yyyy" (Buddhist year) to Date object */
function parseBuddhistDate(dateStr: string): Date {
  // Convert Buddhist year to Gregorian year
  const parts = dateStr.split("-")
  if (parts.length !== 3) throw new Error("Invalid date format")

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const buddhistYear = parseInt(parts[2], 10)
  const gregorianYear = buddhistYear - 543

  // สร้างวันที่เป็น UTC 12:00 น. เพื่อหลีกเลี่ยงปัญหา timezone shift
  return new Date(Date.UTC(gregorianYear, month - 1, day, 12, 0, 0))
}

/** Get start of day in UTC */
function startOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
}

/** Get end of day in UTC */
function endOfDayUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))
}

/** Get start and end of day for a given date string (UTC) */
function getDayRange(dateStr: string): { start: Date; end: Date } {
  const parsedDate = parseBuddhistDate(dateStr)
  return {
    start: startOfDayUTC(parsedDate),
    end: endOfDayUTC(parsedDate),
  }
}

export async function saveBulkTransactions(
  rawData: TransactionItem[],
  dailyBudget: number
) {
  try {
    const user = await currentUser()
    if (!user) throw new Error("คุณยังไม่ได้เข้าสู่ระบบ")

    if (rawData.length === 0) {
      return { error: "ไม่มีรายการที่จะบันทึก" }
    }

    // 1. Validate data with Zod
    const validatedData = validateWithZod(transactionListSchema, rawData)
    const dateStr = rawData[0].date

    // 2. Save transactions to database
    await db.transaction.createMany({
      data: validatedData.map((item) => ({
        ...item,
        profileId: user.id,
      })),
    })

    // 3. Recalculate and save daily summary
    await recalculateDailySummary(user.id, dateStr, dailyBudget)

    revalidatePath("/")
    revalidatePath(`/${dateStr}`)
    return { success: true }
  } catch (error: unknown) {
    console.error("Prisma Error:", error)
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึก"
    return { error: message }
  }
}

export async function deleteTransaction(transactionId: string, dateStr: string, dailyBudget: number) {
  try {
    const user = await currentUser()
    if (!user) throw new Error("คุณยังไม่ได้เข้าสู่ระบบ")

    // 1. Verify ownership and delete
    const transaction = await db.transaction.findFirst({
      where: { id: transactionId, profileId: user.id },
    })

    if (!transaction) {
      throw new Error("ไม่พบรายการนี้")
    }

    await db.transaction.delete({
      where: { id: transactionId },
    })

    // 2. Recalculate daily summary
    await recalculateDailySummary(user.id, dateStr, dailyBudget)

    revalidatePath("/")
    revalidatePath(`/${dateStr}`)
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาด"
    return { error: message }
  }
}

export async function fetchDayTransactions(userId: string, dateStr: string) {
  try {
    const { start, end } = getDayRange(dateStr)

    const transactions = await db.transaction.findMany({
      where: {
        profileId: userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }))
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

// ==================== Daily Summary Actions ====================

/** Get running balance from the previous day (or 0 if none) */
export async function fetchPreviousRunningBalance(userId: string, dateStr: string): Promise<number> {
  try {
    const currentDate = parseBuddhistDate(dateStr)
    const previousDate = subDays(currentDate, 1)

    const previousSummary = await db.dailySummary.findUnique({
      where: {
        profileId_date: {
          profileId: userId,
          date: startOfDayUTC(previousDate),
        },
      },
      select: {
        runningBalance: true,
      },
    })

    return previousSummary ? Number(previousSummary.runningBalance) : 0
  } catch (error) {
    console.error("Error fetching previous running balance:", error)
    return 0
  }
}

/** Get daily summary for a specific date */
export async function fetchDailySummary(userId: string, dateStr: string) {
  try {
    const date = startOfDayUTC(parseBuddhistDate(dateStr))

    const summary = await db.dailySummary.findUnique({
      where: {
        profileId_date: {
          profileId: userId,
          date,
        },
      },
    })

    if (!summary) return null

    return {
      budgetAtThatTime: Number(summary.budgetAtThatTime),
      totalIncome: Number(summary.totalIncome),
      totalExpense: Number(summary.totalExpense),
      netAmount: Number(summary.netAmount),
      runningBalance: Number(summary.runningBalance),
      status: summary.status as DailyStatus,
    }
  } catch (error) {
    console.error("Error fetching daily summary:", error)
    return null
  }
}

/** Recalculate and save daily summary after transaction changes */
async function recalculateDailySummary(
  userId: string,
  dateStr: string,
  dailyBudget: number
) {
  const { start, end } = getDayRange(dateStr)
  const date = startOfDayUTC(parseBuddhistDate(dateStr))

  // 1. Get all transactions for this day
  const transactions = await db.transaction.findMany({
    where: {
      profileId: userId,
      date: { gte: start, lte: end },
    },
  })

  // 2. Calculate totals
  let totalIncome = 0
  let totalExpense = 0

  for (const t of transactions) {
    const amount = Number(t.amount)
    if (t.type === "INCOME") {
      totalIncome += amount
    } else {
      totalExpense += amount
    }
  }

  // 3. Get previous day's running balance
  const previousRunningBalance = await fetchPreviousRunningBalance(userId, dateStr)

  // 4. Calculate net amount and running balance
  // netAmount = income - expense (how much saved or overspent)
  // savingsFromBudget = dailyBudget - totalExpense + totalIncome
  const savingsFromBudget = dailyBudget - totalExpense + totalIncome
  const runningBalance = previousRunningBalance + savingsFromBudget

  // 5. Determine status
  const status: DailyStatus = totalExpense <= dailyBudget ? "UNDER_BUDGET" : "OVER_BUDGET"

  // 6. Upsert daily summary
  await db.dailySummary.upsert({
    where: {
      profileId_date: {
        profileId: userId,
        date,
      },
    },
    update: {
      totalIncome,
      totalExpense,
      netAmount: savingsFromBudget,
      runningBalance,
      status,
      budgetAtThatTime: dailyBudget,
    },
    create: {
      profileId: userId,
      date,
      budgetAtThatTime: dailyBudget,
      totalIncome,
      totalExpense,
      netAmount: savingsFromBudget,
      runningBalance,
      status,
    },
  })
}

/** Fetch all daily summaries for calendar display */
export async function fetchDailySummariesForCalendar(
  userId: string,
  year: number,
  month: number
): Promise<DailySummaryForCalendar[]> {
  try {
    // Get first and last day of the month
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0) // Last day of month

    const summaries = await db.dailySummary.findMany({
      where: {
        profileId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        date: true,
        status: true,
      },
    })

    return summaries.map((s) => ({
      date: s.date,
      status: s.status as DailyStatus,
    }))
  } catch (error) {
    console.error("Error fetching daily summaries for calendar:", error)
    return []
  }
}

// ==================== Monthly Summary Actions ====================

export async function fetchMonthlySummary(
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummaryData> {
  try {
    // Create date range for the month
    const startDate = startOfMonth(new Date(year, month - 1))
    const endDate = endOfMonth(new Date(year, month - 1))
    const daysInMonth = getDaysInMonth(new Date(year, month - 1))

    // Fetch all transactions for the month
    const transactions = await db.transaction.findMany({
      where: {
        profileId: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Calculate totals
    let totalIncome = 0
    let totalExpense = 0
    const categoryTotals: Record<string, number> = {}
    const dailyDataMap: Record<number, { income: number; expense: number }> = {}

    // Initialize daily data
    for (let i = 1; i <= daysInMonth; i++) {
      dailyDataMap[i] = { income: 0, expense: 0 }
    }

    // Process transactions
    for (const tx of transactions) {
      const amount = Number(tx.amount)
      const day = new Date(tx.date).getDate()

      if (tx.type === "INCOME") {
        totalIncome += amount
        dailyDataMap[day].income += amount
      } else {
        totalExpense += amount
        dailyDataMap[day].expense += amount

        // Track category breakdown (only for expenses)
        const category = tx.category
        categoryTotals[category] = (categoryTotals[category] || 0) + amount
      }
    }

    // Create category breakdown with percentages
    const categoryBreakdown: CategoryBreakdown[] = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    // Create daily data array
    const dailyData = Object.entries(dailyDataMap).map(([day, data]) => ({
      day: parseInt(day),
      income: data.income,
      expense: data.expense,
    }))

    return {
      year,
      month,
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      categoryBreakdown,
      dailyData,
    }
  } catch (error) {
    console.error("Error fetching monthly summary:", error)
    return {
      year,
      month,
      totalIncome: 0,
      totalExpense: 0,
      netAmount: 0,
      categoryBreakdown: [],
      dailyData: [],
    }
  }
}
