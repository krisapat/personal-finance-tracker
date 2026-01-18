"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import type { DailyHeaderProps } from "@/utils/types";

const chartConfig = {
  used: { label: "ใช้ไป", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export function DailyHeader({
  date,
  budget,
  totalExpense,
  totalIncome,
  runningBalance,
}: DailyHeaderProps) {
  const budgetAmount = budget?.amount || 0;
  const percentageUsed =
    budgetAmount > 0 ? (totalExpense / budgetAmount) * 100 : 0;

  const chartData = [
    {
      name: "used",
      value: Math.min(percentageUsed, 100),
      fill: "#4ade80",
    },
  ];

  // Calculate today's savings/overspend
  const todaySavings = budgetAmount - totalExpense + totalIncome;
  const isOverBudget = totalExpense > budgetAmount;

  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-md p-4 sm:p-6 md:p-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left: Text Content */}
        <div className="flex flex-col justify-center space-y-4 z-10">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-muted-foreground">
            บันทึกรายรับรายจ่าย
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black">
            ประจำวันที่ {date}
          </h1>

          {budget ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Daily Budget */}
              <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">งบรายวัน</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  {budgetAmount.toLocaleString()} ฿
                </p>
              </div>

              {/* Running Balance (ยอดสะสม) */}
              <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">ยอดสะสม</p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${runningBalance >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {runningBalance >= 0 ? "+" : ""}
                  {runningBalance.toLocaleString()} ฿
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  (ยอดทบจากวันก่อนหน้า)
                </p>
              </div>

              {/* Today's Expense */}
              <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  ใช้ไปแล้วในวันนี้
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${isOverBudget ? "text-red-500" : "text-destructive"
                    }`}
                >
                  {totalExpense.toLocaleString()} ฿
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                  ({percentageUsed.toFixed(1)}% ของงบ)
                </p>
              </div>

              {/* Today's Income (if any) */}
              {totalIncome > 0 && (
                <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    รายรับวันนี้
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                    +{totalIncome.toLocaleString()} ฿
                  </p>
                </div>
              )}

              {/* Today's Savings/Overspend */}
              <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-3 sm:px-4 md:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                  {todaySavings >= 0 ? "ประหยัดได้วันนี้" : "ใช้เกินวันนี้"}
                </p>
                <p
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${todaySavings >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {todaySavings >= 0 ? "+" : ""}
                  {todaySavings.toLocaleString()} ฿
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl sm:rounded-2xl border border-white/40 bg-white/20 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl shadow-inner">
              <p className="text-xs sm:text-sm text-muted-foreground italic">
                ยังไม่ได้ตั้งงบประมาณ
              </p>
            </div>
          )}
        </div>

        {/* Right: Semi-circle Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-full h-[250px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <RadialBarChart
                data={chartData}
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="90%"
                className="mx-auto"
                cy="70%"
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  background={{ fill: "#71717b" }}
                  fill="#4ade80"
                  cornerRadius={10}
                  angleAxisId={0}
                />
              </RadialBarChart>
            </ChartContainer>
            {/* Center Text */}
            {budget && (
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-15 text-primary">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold">{percentageUsed.toFixed(0)}%</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">ใช้งบแล้ว</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}