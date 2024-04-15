import { useTranslation } from "react-i18next";

import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import Banner from "./Banner";

const Main = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  const { t } = useTranslation();


  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>  {t('error')}</h1>;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <Banner />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <h3 className="text-xl font-semibold text-center col-span-full">{t('latest_products')}</h3>
  {data.map((product) => (
    <div key={product._id} className="p-3">
      <SmallProduct product={product} />
    </div>
  ))}
</div>

      <ProductCarousel />

       
        </div>
    </>
  );
};

export default Main;
