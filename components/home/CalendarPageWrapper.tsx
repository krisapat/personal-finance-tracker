"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { fetchDailySummariesForCalendar } from "@/actions/actions";
import { CalendarSkeleton } from "@/components/animations/Skeletons";
import type { DailySummaryForCalendar } from "@/utils/types";

/** ดึงวันที่ปัจจุบันตามเวลาไทย (ฝั่ง client เท่านั้น) */
function getThaiToday() {
    const now = new Date();
    const thaiString = now.toLocaleString("en-US", {
        timeZone: "Asia/Bangkok",
    });
    return new Date(thaiString);
}

/** แปลง Date (ค.ศ.) → string พ.ศ. */
function formatThaiDate(date: Date) {
    const day = format(date, "dd");
    const month = format(date, "MM");
    const buddhistYear = date.getFullYear() + 543;
    return `${day}-${month}-${buddhistYear}`;
}

export default function CalendarPageWrapper() {
    const { isSignedIn, isLoaded, user } = useUser();
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [month, setMonth] = useState<Date>();
    const [selected, setSelected] = useState<Date>();
    const [showSignInTrigger, setShowSignInTrigger] = useState(false);
    const [dailySummaries, setDailySummaries] = useState<DailySummaryForCalendar[]>([]);
    const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);

    useEffect(() => {
        const today = getThaiToday();
        setMonth(today);
        setSelected(today);
        setReady(true);
    }, []);

    // Fetch daily summaries when user is signed in and month changes
    useEffect(() => {
        async function loadSummaries() {
            if (!isSignedIn || !user?.id || !month) return;

            const year = month.getFullYear();
            const monthNum = month.getMonth() + 1;

            setIsLoadingSummaries(true);
            try {
                const summaries = await fetchDailySummariesForCalendar(
                    user.id,
                    year,
                    monthNum
                );
                setDailySummaries(summaries);
            } catch (error) {
                console.error("Error loading daily summaries:", error);
            } finally {
                setIsLoadingSummaries(false);
            }
        }

        loadSummaries();
    }, [isSignedIn, user?.id, month]);

    if (!ready || !isLoaded) {
        return <CalendarSkeleton />;
    }

    const handleDayClick = (date?: Date) => {
        if (!date) return;

        // ถ้ายังไม่ล็อกอิน ให้เปิด modal login โดยไม่เปลี่ยน selected date
        if (!isSignedIn) {
            setShowSignInTrigger(true);
            return;
        }

        // ถ้าล็อกอินแล้ว ให้เปลี่ยน selected และไปหน้า route ตามปกติ
        setSelected(date);
        router.push(`/${formatThaiDate(date)}`);
    };

    // Create modifiers for calendar based on daily summaries
    const underBudgetDays = dailySummaries
        .filter((s) => s.status === "UNDER_BUDGET")
        .map((s) => new Date(s.date));

    const overBudgetDays = dailySummaries
        .filter((s) => s.status === "OVER_BUDGET")
        .map((s) => new Date(s.date));

    return (
        <motion.div
            className="w-full mx-auto max-w-2xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Calendar
                    mode="single"
                    month={month}
                    selected={selected}
                    onMonthChange={setMonth}
                    onDayClick={handleDayClick}
                    locale={th}
                    modifiers={{
                        underBudget: underBudgetDays,
                        overBudget: overBudgetDays,
                    }}
                    modifiersClassNames={{
                        underBudget: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-green-500",
                        overBudget: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
                    }}
                    className="
                        w-full rounded-xl
                        bg-white/80 dark:bg-black/50 
                        backdrop-blur-3xl
                        border-2 border-zinc-200/80 dark:border-white/20
                        shadow-[0_20px_50px_rgba(0,0,0,0.08)]
                        p-4 sm:p-6
                        transition-all duration-300
                    "
                />
            </motion.div>

            {/* Loading indicator for summaries */}
            <AnimatePresence>
                {isLoadingSummaries && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl"
                    >
                        <motion.div
                            className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden SignInButton trigger - จะถูกคลิกอัตโนมัติเมื่อ user ยังไม่ได้ login */}
            {showSignInTrigger && (
                <SignInButton mode="modal">
                    <button
                        ref={(btn) => {
                            if (btn) {
                                btn.click();
                                setShowSignInTrigger(false);
                            }
                        }}
                        className="hidden"
                    />
                </SignInButton>
            )}

            {/* Legend with animation */}
            <AnimatePresence>
                {isSignedIn && dailySummaries.length > 0 && (
                    <motion.div
                        className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.span
                                className="w-3 h-3 rounded-full bg-green-500"
                                animate={{
                                    boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 8px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span>ประหยัดได้</span>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.span
                                className="w-3 h-3 rounded-full bg-red-500"
                                animate={{
                                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 8px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            />
                            <span>ใช้เกินงบ</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

