// const FAVORITES_KEY = "movieAppFavorites";

// export const loadFavorites = () => {
//   try {
//     const serializedFavorites = localStorage.getItem(FAVORITES_KEY);
//     return serializedFavorites ? JSON.parse(serializedFavorites) : [];
//   } catch (e) {
//     console.error("Could not load favorites from localStorage", e);
//     return [];
//   }
// };

// export const saveFavorites = (favorites) => {
//   try {
//     const serializedFavorites = JSON.stringify(favorites);
//     localStorage.setItem(FAVORITES_KEY, serializedFavorites);
//   } catch (e) {
//     console.error("Could not save favorites to localStorage", e);
//   }
// };
