"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200",
                className
            )}
        />
    );
}

// Pre-built skeleton variants
export function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonTableRow() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-gray-100">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full ml-auto" />
        </div>
    );
}

export function SkeletonKanbanColumn() {
    return (
        <div className="bg-gray-50 rounded-xl p-4 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8 rounded-full" />
            </div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
}

export function SkeletonMetricCard() {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-24" />
        </div>
    );
}
