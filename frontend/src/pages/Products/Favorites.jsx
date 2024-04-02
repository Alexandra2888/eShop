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
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
      {t('favorite_products')}
      </h1>

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
    </>
  );
};

export default Favorites;
