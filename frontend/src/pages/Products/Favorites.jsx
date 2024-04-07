import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";

import Product from "./Product";
import Metadata from "../../components/Metadata"


const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  const { t } = useTranslation();

  return (
    <>
    <Metadata title={"Favorites"} />
    <div className="flex flex-col justify-center items-center h-screen dark:bg-gray-900 dark:text-slate-50">
      <h1 className="text-lg font-bold md:py-12">
      {t('favorite_products')}
      </h1>

      <div className="flex flex-wrap max-w-xs md:max-3xl">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
    </>
  );
};

export default Favorites;
