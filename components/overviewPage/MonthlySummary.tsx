"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { fetchMonthlySummary } from "@/actions/actions";
import type { MonthlySummaryData } from "@/utils/types";
import { CATEGORY_LABELS } from "@/utils/data";

const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const PIE_COLORS = ["#4ade80", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa", "#94a3b8"];

interface MonthlySummaryProps {
    userId: string;
}

export function MonthlySummary({ userId }: MonthlySummaryProps) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [data, setData] = useState<MonthlySummaryData | null>(null);
    const [isPending, startTransition] = useTransition();

    // Fetch data when month/year changes
    useEffect(() => {
        startTransition(async () => {
            const result = await fetchMonthlySummary(userId, year, month);
            setData(result);
        });
    }, [userId, year, month]);

    const goToPreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    // Buddhist year
    const buddhistYear = year + 543;

    // Prepare chart data
    const barChartData = data?.dailyData
        .filter((d) => d.income > 0 || d.expense > 0)
        .map((d) => ({
            day: d.day,
            รายรับ: d.income,
            รายจ่าย: d.expense,
        })) || [];

    const pieChartData = data?.categoryBreakdown.map((c) => ({
        name: CATEGORY_LABELS[c.category] || c.category,
        value: c.amount,
        percentage: c.percentage,
    })) || [];

    return (
        <div className="space-y-6">
            {/* Month Navigator */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-xl sm:text-2xl font-bold">
                    {THAI_MONTHS[month - 1]} {buddhistYear}
                </h2>
                <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {isPending ? (
                <div className="flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : data ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {/* Total Income */}
                        <Card className="p-4 bg-green-500/10 border-green-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-xs sm:text-sm text-muted-foreground">รายรับ</span>
                            </div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-500">
                                +{data.totalIncome.toLocaleString()} ฿
                            </p>
                        </Card>

                        {/* Total Expense */}
                        <Card className="p-4 bg-red-500/10 border-red-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                <span className="text-xs sm:text-sm text-muted-foreground">รายจ่าย</span>
                            </div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-500">
                                -{data.totalExpense.toLocaleString()} ฿
                            </p>
                        </Card>

                        {/* Net Amount */}
                        <Card className={`p-4 col-span-2 sm:col-span-1 ${data.netAmount >= 0
                                ? "bg-primary/10 border-primary/30"
                                : "bg-destructive/10 border-destructive/30"
                            }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs sm:text-sm text-muted-foreground">คงเหลือ</span>
                            </div>
                            <p className={`text-lg sm:text-xl md:text-2xl font-bold ${data.netAmount >= 0 ? "text-primary" : "text-destructive"
                                }`}>
                                {data.netAmount >= 0 ? "+" : ""}{data.netAmount.toLocaleString()} ฿
                            </p>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    {(barChartData.length > 0 || pieChartData.length > 0) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Bar Chart - Daily Income vs Expense */}
                            {barChartData.length > 0 && (
                                <Card className="p-4 sm:p-6">
                                    <h3 className="text-sm sm:text-base font-semibold mb-4">รายรับ-รายจ่ายรายวัน</h3>
                                    <div className="h-[200px] sm:h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barChartData}>
                                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                                <Tooltip
                                                    formatter={(value: number) => `${value.toLocaleString()} ฿`}
                                                    contentStyle={{
                                                        backgroundColor: "hsl(var(--card))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Bar dataKey="รายรับ" fill="#4ade80" radius={[2, 2, 0, 0]} />
                                                <Bar dataKey="รายจ่าย" fill="#f87171" radius={[2, 2, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            )}

                            {/* Pie Chart - Category Breakdown */}
                            {pieChartData.length > 0 && (
                                <Card className="p-4 sm:p-6">
                                    <h3 className="text-sm sm:text-base font-semibold mb-4">สัดส่วนรายจ่ายตามหมวดหมู่</h3>
                                    <div className="h-[200px] sm:h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                                                    labelLine={false}
                                                >
                                                    {pieChartData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number) => `${value.toLocaleString()} ฿`}
                                                    contentStyle={{
                                                        backgroundColor: "hsl(var(--card))",
                                                        border: "1px solid hsl(var(--border))",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {barChartData.length === 0 && pieChartData.length === 0 && (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">
                                ยังไม่มีข้อมูลรายการในเดือนนี้
                            </p>
                        </Card>
                    )}
                </>
            ) : null}
        </div>
    );
}
