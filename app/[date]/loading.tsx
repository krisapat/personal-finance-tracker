import { TransactionSkeleton, Skeleton } from "@/components/animations/Skeletons";

export default function Loading() {
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
                {/* Breadcrumb skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <span className="text-muted-foreground">/</span>
                    <Skeleton className="h-4 w-24" />
                </div>

                {/* Header Section skeleton */}
                <div className="p-6 rounded-xl bg-card/50 backdrop-blur-xl border border-border space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction Content skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40 px-2" />
                    {/* Transaction list skeleton */}
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <TransactionSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
