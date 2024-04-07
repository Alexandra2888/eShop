import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute right-2 px-1">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-gray-700 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
