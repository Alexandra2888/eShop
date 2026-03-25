import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const reviews = {
  average: 4.2,
  totalCount: 1624,
  counts: [
    { rating: 5, count: 1019 },
    { rating: 4, count: 162 },
    { rating: 3, count: 97 },
    { rating: 2, count: 199 },
    { rating: 1, count: 147 },
  ],
  featured: [
    {
      id: 1,
      rating: 5,
      content:
        "The custom-built gaming PC I received exceeded my expectations. High-end components and flawless performance. Definitely worth the investment!",
      author: "Alex Johnson",
      role: "Verified Buyer",
      avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      rating: 4,
      content:
        "Impressed with the speedy delivery of my new tablet. It's sleek, runs all my apps smoothly, and the battery life is just incredible.",
      author: "Samantha Brown",
      role: "Verified Buyer",
      avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ],
};

const StarRow = ({ rating, max = 5 }: { rating: number; max?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <FaStar
        key={i}
        size={12}
        className={
          i < rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"
        }
      />
    ))}
  </div>
);

const Reviews = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-white dark:bg-zinc-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-2">
            Testimonials
          </p>
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
            {t("customer_reviews")}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Rating summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-white/[0.06]">
              {/* Big number */}
              <div className="text-center mb-8">
                <p className="font-display text-7xl font-bold text-zinc-900 dark:text-white">
                  {reviews.average}
                </p>
                <div className="flex justify-center my-3">
                  <StarRow rating={Math.round(reviews.average)} />
                </div>
                <p className="text-zinc-500 text-sm">
                  Based on {reviews.totalCount.toLocaleString()} reviews
                </p>
              </div>

              {/* Bar chart */}
              <div className="space-y-3">
                {reviews.counts.map((item) => {
                  const pct = Math.round(
                    (item.count / reviews.totalCount) * 100,
                  );
                  return (
                    <div
                      key={item.rating}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="w-4 text-right text-zinc-500 font-medium text-xs">
                        {item.rating}
                      </span>
                      <FaStar size={10} className="text-amber-400 shrink-0" />
                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          className="h-full bg-amber-400 rounded-full"
                        />
                      </div>
                      <span className="w-8 text-right text-zinc-400 text-xs">
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Review cards */}
          <div className="lg:col-span-8 space-y-6">
            {reviews.featured.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-white/[0.06]"
              >
                <FaQuoteLeft
                  size={28}
                  className="text-emerald-500/20 absolute top-6 right-8"
                />
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={review.avatarSrc}
                    alt={review.author}
                    className="w-12 h-12 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                      {review.author}
                    </p>
                    <p className="text-zinc-400 text-xs">{review.role}</p>
                  </div>
                  <div className="ml-auto">
                    <StarRow rating={review.rating} />
                  </div>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  "{review.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
