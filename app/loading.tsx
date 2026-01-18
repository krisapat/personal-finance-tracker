import { CalendarSkeleton } from "@/components/animations/Skeletons";

export default function Loading() {
    return (
        <section>
            <div className="relative isolate min-h-screen">
                <div className="mx-auto max-w-4xl">
                    {/* Welcome text skeleton */}
                    <div className="h-8 w-48 mx-auto mb-4 rounded-lg bg-muted animate-pulse" />
                    <div className="h-8 w-64 mx-auto mb-6 rounded-lg bg-muted animate-pulse" />
                    {/* Calendar skeleton */}
                    <CalendarSkeleton />
                </div>
            </div>
        </section>
    );
}
