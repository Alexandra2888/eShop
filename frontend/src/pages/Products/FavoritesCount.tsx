import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state: any) => state.favorites);
  const favoriteCount = favorites.length;

  if (favoriteCount === 0) return null;

  return (
    <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none shrink-0">
      {favoriteCount}
    </span>
  );
};

export default FavoritesCount;
