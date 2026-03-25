import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import Banner from "./Banner";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Main = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-zinc-400">{t("error")}</p>
      </div>
    );
  }

  return (
    <div>
      <Banner />
      {data && data.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-950 py-4"
        >
          <ProductCarousel />
        </motion.section>
      )}
    </div>
  );
};

export default Main;
