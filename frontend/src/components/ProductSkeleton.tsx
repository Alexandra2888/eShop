import { motion } from "framer-motion";

const ProductSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/[0.06] animate-pulse">
    <div className="h-48 bg-zinc-100 dark:bg-zinc-800" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between gap-3">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full flex-1" />
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-16" />
      </div>
      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-4/5" />
      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-2/3" />
      <div className="h-9 bg-zinc-100 dark:bg-zinc-800 rounded-xl mt-4" />
    </div>
  </div>
);

export const ProductSkeletonGrid = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.04 }}
      >
        <ProductSkeleton />
      </motion.div>
    ))}
  </div>
);

export default ProductSkeleton;
