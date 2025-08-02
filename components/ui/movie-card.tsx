"use client";
import { useViewMovieStore } from "@/store/viewMovieStore";
import { getTVShowDetails } from "@/helpers/getTVShowDetails";
import { addToRecentlyWatched } from "@/helpers/recentlyWatchedUtils";
import { useState } from "react";

interface MediaItem {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  poster: string;
  year: string;
  overview?: string;
  genre: string[];
}

const MovieCard = ({
  movie,
  mediaType,
}: {
  movie: MediaItem;
  mediaType: "movie" | "tv";
}) => {
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);
  const setTVShowDetails = useViewMovieStore((state) => state.setTVShowDetails);

  const handleClick = async () => {
    setOpen(true);
    const movieWithType = {
      ...movie,
      overview: movie.overview,
      media_type: mediaType,
    };
    setMovie(movieWithType);

    // If it's a TV show, fetch the details
    if (mediaType === "tv") {
      const tvShowDetails = await getTVShowDetails(movie.id);
      setTVShowDetails(tvShowDetails);
    }

    // Add to recently watched
    addToRecentlyWatched(movie.id, mediaType);
  };

  return (
    <button
      key={movie.id}
      className="group relative col-span-1 rounded-sm overflow-hidden cursor-pointer text-left group"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          className="object-cover w-full h-full transition-all duration-300 ease-in-out group-hover:opacity-35"
          src={movie.image}
          alt={movie.title}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      <h3 className="text-white text-lg font-bold leading-normal mt-2">
        {movie.title}
      </h3>
      <span className="text-gray-400">{movie.year}</span>
    </button>
  );
};

export default MovieCard;
