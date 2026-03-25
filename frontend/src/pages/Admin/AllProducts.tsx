import { Link } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";

import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AdminMenu />
      <main className="md:pl-56 px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">
              Admin
            </p>
            <h1 className="font-display text-3xl font-bold text-white">
              {t("all_products")}
              {!isLoading && products && (
                <span className="ml-3 text-lg font-normal text-zinc-500">
                  ({products.length})
                </span>
              )}
            </h1>
          </div>
          <Link
            to="/admin/productlist"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl shadow-glow-sm hover:shadow-glow transition-all duration-200"
          >
            + {t("create_product")}
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : isError ? (
          <p className="text-zinc-400 text-center py-16">
            {t("error_loading_products")}
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-3"
          >
            {products?.map((product: any, i: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group flex items-center gap-4 bg-zinc-900 hover:bg-zinc-800/80 border border-white/[0.06] hover:border-white/10 rounded-2xl p-4 transition-all duration-200"
              >
                {/* Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-white font-medium text-sm truncate">
                      {product.name}
                    </h3>
                    <span className="font-bold text-emerald-400 text-sm shrink-0">
                      ${product.price}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-1 line-clamp-1 max-w-lg">
                    {product.description?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                      {product.brand}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {moment(product.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to={`/admin/product/update/${product._id}`}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all duration-200"
                >
                  <FaEdit size={10} />
                  {t("update_product")}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AllProducts;
