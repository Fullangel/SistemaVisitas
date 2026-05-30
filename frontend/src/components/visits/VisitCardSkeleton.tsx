import { motion } from "framer-motion"

interface VisitCardSkeletonProps {
    index?: number
}

export function VisitCardSkeleton({ index = 0 }: VisitCardSkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
            <div className="h-2 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse" />

            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Visit Info Skeleton */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {/* Avatar skeleton */}
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse" />
                                <div className="space-y-2">
                                    {/* Name skeleton */}
                                    <div className="h-6 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                                    {/* Company skeleton */}
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    {/* Document skeleton */}
                                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                </div>
                            </div>
                            {/* Badge skeleton */}
                            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                        </div>

                        {/* Info grid skeleton */}
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ))}
                        </div>

                        {/* Purpose skeleton */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-3">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* Host skeleton */}
                        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>

                    {/* Right: Actions Skeleton */}
                    <div className="flex flex-col gap-3 lg:w-48">
                        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
                        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export function VisitsLoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[0, 1, 2].map((index) => (
                <VisitCardSkeleton key={index} index={index} />
            ))}
        </div>
    )
}
