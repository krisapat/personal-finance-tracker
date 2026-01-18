import { z } from "zod"

// Define a schema for user profile data

export const validateWithZod = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> => {
  const result = schema.safeParse(data)
  if (!result.success) {
    const errors = result.error.issues.map((err) => err.message).join(", ")
    throw new Error(errors)
  }
  return result.data
}
export const profileSchema = z.object({
  userName: z.string().min(1, { message: "Username น้อยกว่า 1 ตัวอักษร" }).max(20, { message: "Username เกิน 20 ตัวอักษร" }),
})
export const budgetSchema = z.object({
  amount: z.coerce.number().int().min(0, { message: "กรอกเป็นจำนวนเต็ม" }),
})

/** Parse Buddhist date string (dd-MM-yyyy where yyyy is Buddhist year) to Date object */
function parseBuddhistDateString(dateStr: string): Date | undefined {
  const parts = dateStr.split("-")
  if (parts.length !== 3) return undefined

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const buddhistYear = parseInt(parts[2], 10)

  // Validate parts
  if (isNaN(day) || isNaN(month) || isNaN(buddhistYear)) return undefined
  if (day < 1 || day > 31 || month < 1 || month > 12) return undefined
  if (buddhistYear < 2500 || buddhistYear > 3000) return undefined

  // Convert Buddhist year to Gregorian year
  const gregorianYear = buddhistYear - 543

  // สร้างวันที่เป็น UTC 12:00 น. เพื่อหลีกเลี่ยงปัญหา timezone shift
  // เมื่อแปลงไป timezone อื่น วันที่จะยังคงถูกต้อง
  const date = new Date(Date.UTC(gregorianYear, month - 1, day, 12, 0, 0))

  // Validate the date is valid
  if (isNaN(date.getTime())) return undefined

  return date
}


export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    message: "ประเภทต้องเป็น INCOME หรือ EXPENSE เท่านั้น",
  }),
  category: z.string().min(1, "กรุณาระบุหมวดหมู่"),
  amount: z.coerce.number().positive("จำนวนเงินต้องมากกว่า 0"),
  note: z.string().optional().nullable(),
  date: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return parseBuddhistDateString(arg)
    }
    return arg
  }, z.date({ message: "วันที่ไม่ถูกต้อง" })),
})

export const transactionListSchema = z.array(transactionSchema)
