import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingBag, FaStar, FaShieldAlt, FaBolt } from "react-icons/fa";

const features = [
  { icon: FaBolt, label: "Fast Delivery", desc: "Same-day shipping available" },
  { icon: FaShieldAlt, label: "2-Year Warranty", desc: "On all electronics" },
  { icon: FaStar, label: "Top Rated", desc: "4.9 / 5 average rating" },
];

const ProductShowcase = () => {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-white/[0.06] shadow-card"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon className="text-emerald-500" size={14} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {label}
                </p>
                <p className="text-[11px] text-zinc-400">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main showcase card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 border border-white/[0.06] shadow-card-dark-hover"
        >
          {/* Ambient glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
            {/* Image */}
            <motion.div
              className="flex-1 flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src="https://i.redd.it/qrrpwbko0ag81.jpg"
                alt="iPad Air Gen 5"
                className="w-full max-w-xs lg:max-w-sm h-auto object-contain drop-shadow-2xl rounded-xl"
              />
            </motion.div>

            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
                Featured Product
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                iPad Air Gen 5
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-md">
                Experience blazing-fast performance with the M1 chip, a stunning
                Liquid Retina display, and all-day battery life.
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-8">
                <span className="font-display text-3xl font-bold text-white">
                  $899
                </span>
                <span className="text-zinc-500 line-through text-lg">
                  $1,099
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                  Save $200
                </span>
              </div>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                >
                  <FaShoppingBag size={13} />
                  Buy Now
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-2xl transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
