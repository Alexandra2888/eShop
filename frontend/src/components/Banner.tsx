import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaTruck } from "react-icons/fa";

const words = ["Tech", "Upgrade", "Awaits"];

const Banner = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[88vh] flex items-center overflow-hidden bg-zinc-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&auto=format&fit=crop&q=80"
          alt="Tech hero"
          className="w-full h-full object-cover opacity-30"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8"
          >
            <FaTruck className="text-emerald-400" size={12} />
            Free shipping on orders over $50
          </motion.div>

          {/* Main heading — animated word reveal */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-2">
            {t("ready_for_tech")}
          </h1>
          <div className="flex flex-wrap gap-x-3 mb-8">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, skewY: 3 }}
                animate={{ opacity: 1, y: 0, skewY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight ${
                  i === words.length - 1 ? "text-gradient" : "text-white"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-md"
          >
            {t("check_latest_collection")} — discover the latest gadgets,
            laptops, and accessories at unbeatable prices.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 px-7 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-base rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              {t("shop_now")}
              <motion.span
                className="inline-flex"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaArrowRight size={14} />
              </motion.span>
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-4 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base rounded-2xl backdrop-blur-sm transition-all duration-300"
            >
              Browse Categories
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-white/[0.06]"
          >
            {[
              { value: "10K+", label: "Products" },
              { value: "99%", label: "Satisfaction" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-zinc-500 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Decorative floating cards */}
      <motion.div
        className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {[
          {
            label: "New Arrival",
            sub: "MacBook Pro M4",
            color: "from-emerald-500/20 to-teal-500/20",
          },
          {
            label: "Best Seller",
            sub: "AirPods Pro 3",
            color: "from-violet-500/20 to-purple-500/20",
          },
          {
            label: "Deal of Day",
            sub: "iPad Air Gen 6",
            color: "from-amber-500/20 to-orange-500/20",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4,
              delay: i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`glass-dark rounded-2xl p-4 w-52 bg-gradient-to-br ${card.color}`}
          >
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest">
              {card.label}
            </span>
            <p className="text-white text-sm font-semibold mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Banner;
