import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { addToCart } from "../../redux/features/cart/cartSlice";
import { getImageUrl } from "../../utils/imageUtils";

import HeartIcon from "./HeartIcon";
import Button from "../../components/Button";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

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
        transition-shadow duration-400 card-shine"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-zinc-50 dark:bg-zinc-800/50">
        <Link to={`/product/${p._id}`}>
          <motion.img
            className="w-full h-full object-cover"
            src={getImageUrl(p.image)}
            alt={p.name}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </Link>
        <span className="absolute bottom-3 right-3 bg-emerald-500/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          {p?.brand}
        </span>
        <div className="absolute top-3 left-3">
          <HeartIcon product={p} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-sm leading-snug line-clamp-1">
            {p?.name}
          </h3>
          <span className="shrink-0 font-bold text-emerald-500 text-sm">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {p?.description?.substring(0, 80)}...
        </p>

        <div className="flex items-center gap-2">
          <Link
            to={`/product/${p._id}`}
            className="group/btn flex-1 inline-flex items-center justify-between px-4 py-2.5 bg-zinc-900 dark:bg-white/5 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all duration-250"
          >
            {t("read_more")}
            <FaArrowRight
              size={11}
              className="translate-x-0 group-hover/btn:translate-x-1 transition-transform duration-200"
            />
          </Link>

          <Button
            aria-label={`Add ${p.name} to cart`}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 dark:hover:border-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-200"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={18} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
