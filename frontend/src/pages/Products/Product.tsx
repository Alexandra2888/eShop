import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col w-72 h-[340px] rounded-2xl overflow-hidden
        bg-white dark:bg-zinc-900
        border border-zinc-100 dark:border-white/[0.06]
        shadow-card dark:shadow-card-dark
        hover:shadow-card-hover dark:hover:shadow-card-dark-hover
        transition-shadow duration-400 m-4 card-shine"
    >
      {/* Image area */}
      <div className="relative overflow-hidden h-52 bg-zinc-50 dark:bg-zinc-800/50">
        <Link to={`/product/${product._id}`}>
          <motion.img
            className="w-full h-full object-contain p-4"
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </Link>

        {/* Brand badge */}
        <span className="absolute bottom-3 left-3 bg-emerald-500/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {product.brand}
        </span>

        {/* Heart */}
        <div className="absolute top-3 right-3">
          <HeartIcon product={product} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm leading-snug line-clamp-1">
            {product.name}
          </h3>
          <span className="shrink-0 font-bold text-emerald-500 text-sm">
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <Link
          to={`/product/${product._id}`}
          className="group/btn inline-flex items-center justify-between w-full px-4 py-2.5 bg-zinc-900 dark:bg-white/5 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all duration-250"
        >
          {t("read_more")}
          <FaArrowRight
            size={11}
            className="translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>
    </motion.article>
  );
};

export default Product;
