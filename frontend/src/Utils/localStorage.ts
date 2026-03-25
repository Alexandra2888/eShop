import { Product } from "../types/index";

// Add a product to localStorage
export const addFavoriteToLocalStorage = (product: Product): void => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

// Remove product from localStorage
export const removeFavoriteFromLocalStorage = (productId: string): void => {
  const favorites = getFavoritesFromLocalStorage();
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );
  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

// Retrieve favorites from localStorage
export const getFavoritesFromLocalStorage = (): Product[] => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};
