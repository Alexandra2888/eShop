import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Main from "../components/Main";
import Product from "./Products/Product";
import ChatWidget from "../components/ChatWidget";
import Category from "../pages/User/Category";
import ProductShowcase from "../components/ProductShowcase";
import Reviews from "../components/Reviews";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError, error } = useGetProductsQuery({
    keyword: keyword || "",
  });
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      {!keyword && <Main />}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader />
        </div>
      ) : isError ? (
        <div className="max-w-xl mx-auto px-6 py-12">
          <Message variant="error">
            {(error as any)?.data?.message ||
              "An error occurred while fetching products"}
          </Message>
        </div>
      ) : (
        <>
          {/* ── Categories ───────────────────────────────── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-7xl mx-auto px-6 py-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Browse
                </p>
                <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
                  Latest Categories
                </h2>
              </div>
            </div>
            <Category />
          </motion.section>

          {/* ── Divider ──────────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/10 to-transparent" />
          </div>

          {/* ── Latest Products ───────────────────────────── */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-7xl mx-auto px-6 py-16"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-1">
                  Explore
                </p>
                <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white">
                  {t("latest_products")}
                </h2>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-700 dark:text-zinc-300 rounded-xl hover:border-emerald-500 hover:text-emerald-500 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all duration-200"
              >
                {t("shop")} →
              </Link>
            </div>

            {data?.products && data.products.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="flex flex-wrap justify-center gap-2"
              >
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <p className="text-zinc-400 text-lg">No products found</p>
              </div>
            )}
          </motion.section>

          {/* ── Product Showcase ──────────────────────────── */}
          <ProductShowcase />

          {/* ── Reviews ───────────────────────────────────── */}
          <Reviews />
        </>
      )}

      <ChatWidget />
    </div>
  );
};

export default Home;
