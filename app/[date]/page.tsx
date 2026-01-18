import { redirect } from "next/navigation";
import CalenderBreadcrumb from "@/components/home/CalenderBreadcrumb";
import { auth } from "@clerk/nextjs/server";
import {
  fetchBudget,
  fetchDayTransactions,
  fetchPreviousRunningBalance,
  fetchDailySummary,
} from "@/actions/actions";
import { DailyHeader } from "@/components/overview/DailyHeader";
import { TransactionManager } from "@/components/overview/TransactionManager";

interface Props {
  params: Promise<{ date: string }>;
}

function validateDate(dateStr: string): boolean {
  // Validate format: dd-MM-yyyy (Buddhist year)
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dateStr)) return false;

  const parts = dateStr.split("-");
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Basic validation
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 2500 || year > 3000) return false; // Buddhist year range

  return true;
}

export default async function DailyPage({ params }: Props) {
  const { date } = await params;
  if (!validateDate(date)) {
    redirect("/");
  }

  const { userId } = await auth();
  if (!userId) redirect("/");

  // Fetch all required data in parallel
  const [budget, transactions, previousRunningBalance, dailySummary] =
    await Promise.all([
      fetchBudget(userId),
      fetchDayTransactions(userId, date),
      fetchPreviousRunningBalance(userId, date),
      fetchDailySummary(userId, date),
    ]);

  // Calculate totals from transactions
  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Use running balance from daily summary if exists, otherwise use previous + budget
  const dailyBudget = budget?.amount || 0;
  const currentRunningBalance =
    dailySummary?.runningBalance ?? previousRunningBalance;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl space-y-8">
        <CalenderBreadcrumb />
        {/* Header Section */}
        <DailyHeader
          date={date}
          budget={budget}
          totalExpense={totalExpense}
          totalIncome={totalIncome}
          runningBalance={currentRunningBalance}
        />
        {/* Transaction Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2">จัดการรายการวันนี้</h3>
          <TransactionManager
            userId={userId}
            dateStr={date}
            existingTransactions={transactions}
            dailyBudget={dailyBudget}
          />
        </div>
      </div>
    </main>
  );
}