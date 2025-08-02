export interface RecentlyWatchedItem {
  id: number;
  mediaType: "movie" | "tv";
  timestamp: number;
  season?: number;
  episode?: number;
}

const RECENTLY_WATCHED_KEY = "recentlyWatched";
const MAX_ITEMS = 20;

export const getRecentlyWatched = (): RecentlyWatchedItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(RECENTLY_WATCHED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading recently watched:", error);
    return [];
  }
};

export const addToRecentlyWatched = (
  id: number, 
  mediaType: "movie" | "tv", 
  season?: number, 
  episode?: number
) => {
  if (typeof window === "undefined") return;

  try {
    const currentItems = getRecentlyWatched();
    
    // Remove existing item with same id and mediaType
    const filteredItems = currentItems.filter(
      item => !(item.id === id && item.mediaType === mediaType)
    );
    
    // Add new item at the beginning
    const newItem: RecentlyWatchedItem = {
      id,
      mediaType,
      timestamp: Date.now(),
      ...(season && { season }),
      ...(episode && { episode }),
    };
    
    const updatedItems = [newItem, ...filteredItems].slice(0, MAX_ITEMS);
    localStorage.setItem(RECENTLY_WATCHED_KEY, JSON.stringify(updatedItems));
  } catch (error) {
    console.error("Error adding to recently watched:", error);
  }
};

export const removeFromRecentlyWatched = (id: number, mediaType: "movie" | "tv") => {
  if (typeof window === "undefined") return;

  try {
    const currentItems = getRecentlyWatched();
    const filteredItems = currentItems.filter(
      item => !(item.id === id && item.mediaType === mediaType)
    );
    localStorage.setItem(RECENTLY_WATCHED_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error("Error removing from recently watched:", error);
  }
};

export const clearRecentlyWatched = () => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(RECENTLY_WATCHED_KEY);
  } catch (error) {
    console.error("Error clearing recently watched:", error);
  }
}; 