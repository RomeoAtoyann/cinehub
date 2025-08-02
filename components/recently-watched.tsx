"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useEffect } from "react";
import { getMovieDetails } from "@/helpers/getMovieDetails";
import { getTVShowDetailsForRecent } from "@/helpers/getTVShowDetailsForRecent";
import { useViewMovieStore } from "@/store/viewMovieStore";
import { getTVShowDetails } from "@/helpers/getTVShowDetails";
import {
  getRecentlyWatched,
  RecentlyWatchedItem,
  addToRecentlyWatched,
} from "@/helpers/recentlyWatchedUtils";

interface MediaItem {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  poster: string;
  year: string;
  overview: string;
  genre: string[];
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

const RecentlyWatched = () => {
  const [recentItems, setRecentItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);
  const setTVShowDetails = useViewMovieStore((state) => state.setTVShowDetails);
  const setInitialSeasonAndEpisode = useViewMovieStore((state) => state.setInitialSeasonAndEpisode);

  useEffect(() => {
    const loadRecentlyWatched = async () => {
      if (typeof window === "undefined") return;

      try {
        const recentlyWatchedItems = getRecentlyWatched();
        if (recentlyWatchedItems.length === 0) {
          setLoading(false);
          return;
        }
        const mediaItems: MediaItem[] = [];

        // Process items in parallel for better performance
        const promises = recentlyWatchedItems.map(async (item) => {
          try {
            if (item.mediaType === "movie") {
              const movieDetails = await getMovieDetails(item.id);
              if (movieDetails) {
                return {
                  id: movieDetails.id,
                  title: movieDetails.title,
                  image:
                    movieDetails.backdrop_path ||
                    movieDetails.poster_path ||
                    "",
                  backdrop: movieDetails.backdrop_path || "",
                  poster: movieDetails.poster_path || "",
                  year: movieDetails.release_date
                    ? new Date(movieDetails.release_date)
                        .getFullYear()
                        .toString()
                    : "",
                  overview: movieDetails.overview,
                  genre: [] as string[],
                  mediaType: "movie" as const,
                  season: item.season,
                  episode: item.episode,
                };
              }
            } else if (item.mediaType === "tv") {
              const tvShowDetails = await getTVShowDetailsForRecent(item.id);
              if (tvShowDetails) {
                return {
                  id: tvShowDetails.id,
                  title: tvShowDetails.title,
                  image:
                    tvShowDetails.backdrop_path ||
                    tvShowDetails.poster_path ||
                    "",
                  backdrop: tvShowDetails.backdrop_path || "",
                  poster: tvShowDetails.poster_path || "",
                  year: tvShowDetails.first_air_date
                    ? new Date(tvShowDetails.first_air_date)
                        .getFullYear()
                        .toString()
                    : "",
                  overview: tvShowDetails.overview,
                  genre: [] as string[],
                  mediaType: "tv" as const,
                  season: item.season,
                  episode: item.episode,
                };
              }
            }
          } catch (error) {
            console.error(`Error loading item ${item.id}:`, error);
          }
          return null;
        });

        const results = await Promise.all(promises);
        const validItems = results.filter((item) => item !== null) as MediaItem[];
        setRecentItems(validItems);
      } catch (error) {
        console.error("Error loading recently watched:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentlyWatched();
  }, []);

  const handleItemClick = async (item: MediaItem) => {
    setOpen(true);
    const movieWithType = {
      ...item,
      media_type: item.mediaType,
    };
    setMovie(movieWithType);

    // If it's a TV show, fetch the details and set initial season/episode
    if (item.mediaType === "tv") {
      const tvShowDetails = await getTVShowDetails(item.id);
      setTVShowDetails(tvShowDetails);
      
      // Set the initial season and episode from recently watched data
      if (item.season && item.episode) {
        // Add a small delay to ensure the modal is open before setting the values
        setTimeout(() => {
          if (item.season && item.episode) {
            setInitialSeasonAndEpisode(item.season, item.episode);
          }
        }, 100);
      }
    }

    // Move this item to the beginning of recently watched
    addToRecentlyWatched(item.id, item.mediaType, item.season, item.episode);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 lg:px-0 py-10">
        <h2 className="text-4xl mb-6">Continue Watching...</h2>
        <div className="text-gray-400">Loading recently watched...</div>
      </div>
    );
  }

  if (recentItems.length === 0) {
    return null; // Don't show the section if no recently watched items
  }

  return (
    <div className="container mx-auto px-6 lg:px-0 py-10">
      <h2 className="text-4xl mb-6 font-bold">Continue Watching...</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
        }}
      >
        {recentItems.map((item, index) => (
          <SwiperSlide key={`${item.id}-${index}`}>
            <div
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-sm"
              onClick={() => handleItemClick(item)}
            >
              <img
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={item.image}
                alt={`${item.title} poster`}
              />

              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/60" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center text-center text-white opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 drop-shadow">
                  <h3 className="text-3xl md:text-3xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  {item.mediaType === "tv" && item.season && item.episode && (
                    <p className="text-lg font-medium text-gray-200 mb-2">
                      Season {item.season} • Episode {item.episode}
                    </p>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecentlyWatched;
