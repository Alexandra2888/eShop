import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: any) => state.favorites) || [];
  const isFavorite = favorites.some(
    (favProduct) => favProduct._id === product._id,
  );

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={toggleFavorites}
      className="cursor-pointer p-1.5 rounded-full transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {isFavorite ? (
        <FaHeart className="text-emerald-500" size={18} />
      ) : (
        <FaRegHeart
          className="text-zinc-400 hover:text-emerald-500 transition-colors duration-200"
          size={18}
        />
      )}
    </button>
  );
};

export default HeartIcon;
