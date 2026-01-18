import { CardSkeleton, Skeleton } from "@/components/animations/Skeletons";

export default function Loading() {
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
                {/* Header skeleton */}
                <div className="text-center space-y-2">
                    <Skeleton className="h-10 w-64 mx-auto" />
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>

                {/* Summary cards skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>

                {/* Chart skeleton */}
                <div className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-border space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </main>
    );
}
