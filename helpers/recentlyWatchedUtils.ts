export interface RecentlyWatchedItem {
  id: number;
  mediaType: "movie" | "tv";
}

export const addToRecentlyWatched = (id: number, mediaType: "movie" | "tv") => {
  try {
    const key = "recently_watched";
    const raw = localStorage.getItem(key);
    const existingItems = raw ? JSON.parse(raw) : [];
    
    // Create new item with id and media type
    const newItem: RecentlyWatchedItem = { id, mediaType };
    
    // Remove existing item with same id if exists, then add new item at the beginning
    const filteredItems = existingItems.filter((item: RecentlyWatchedItem) => item.id !== id);
    const updatedItems = [newItem, ...filteredItems];
    
    // Keep only the last 20 items
    const limitedItems = updatedItems.slice(0, 20);
    
    localStorage.setItem(key, JSON.stringify(limitedItems));
  } catch (e) {
    console.error("localStorage error:", e);
  }
};

export const getRecentlyWatched = (): RecentlyWatchedItem[] => {
  try {
    if (typeof window === "undefined") return [];
    
    const raw = localStorage.getItem("recently_watched");
    if (!raw) return [];
    
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error getting recently watched:", e);
    return [];
  }
};

export const clearRecentlyWatched = () => {
  try {
    localStorage.removeItem("recently_watched");
  } catch (e) {
    console.error("Error clearing recently watched:", e);
  }
}; 