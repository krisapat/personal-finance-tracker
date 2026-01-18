import type { Transaction, DailySummary, Budget, Profile } from "@/lib/generated/prisma"

// ==================== Transaction Types ====================

export type TransactionType = "INCOME" | "EXPENSE"

export type CategoryType =
    | "food"
    | "transport"
    | "shopping"
    | "health"
    | "salary"
    | "other"

export interface TransactionItem {
    id: string
    description: string
    amount: number
    type: TransactionType
    category: CategoryType
    date: string // format: "dd-MM-yyyy"
    note: string | null
}

export interface TransactionFromDB {
    id: string
    profileId: string
    type: string
    category: string
    amount: number
    note: string | null
    date: Date
    createdAt: Date
}

// ==================== Daily Summary Types ====================

export type DailyStatus = "UNDER_BUDGET" | "OVER_BUDGET"

export interface DailySummaryData {
    date: Date
    budgetAtThatTime: number
    totalIncome: number
    totalExpense: number
    netAmount: number
    runningBalance: number
    status: DailyStatus
}

export interface DailySummaryForCalendar {
    date: Date
    status: DailyStatus
}

// ==================== Budget Types ====================

export interface BudgetData {
    amount: number
}

// ==================== Component Props ====================

export interface DailyHeaderProps {
    date: string
    budget: BudgetData | null
    totalExpense: number
    totalIncome: number
    runningBalance: number
}

export interface TransactionManagerProps {
    userId: string
    dateStr: string
    existingTransactions: TransactionFromDB[]
    dailyBudget: number
    previousRunningBalance: number
}

// ==================== Monthly Summary Types ====================

export interface CategoryBreakdown {
    category: string
    amount: number
    percentage: number
}

export interface MonthlySummaryData {
    year: number
    month: number
    totalIncome: number
    totalExpense: number
    netAmount: number
    categoryBreakdown: CategoryBreakdown[]
    dailyData: {
        day: number
        income: number
        expense: number
    }[]
}

// Re-export Prisma types for convenience
export type { Transaction, DailySummary, Budget, Profile }
