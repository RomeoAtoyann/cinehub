"use client";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Badge } from "./badge";
import { useViewMovieStore } from "@/store/viewMovieStore";
import { getTVShowDetails } from "@/helpers/getTVShowDetails";
import { addToRecentlyWatched } from "@/helpers/recentlyWatchedUtils";

interface MovieRowCarouselProps {
  movies: MovieRowCard[];
  mediaType?: "movie" | "tv";
}

interface MovieRowCard {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  year: string;
  genre: number[];
}

const MovieRowCarousel = ({ movies, mediaType = "movie" }: MovieRowCarouselProps) => {
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);
  const setTVShowDetails = useViewMovieStore((state) => state.setTVShowDetails);

  const handleClick = async (movie: MovieRowCard) => {
    setOpen(true);
    const movieWithType = {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      image: movie.image,
      backdrop: movie.backdrop,
      poster: movie.image,
      genre: [],
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
    <Swiper spaceBetween={20} slidesPerView={3}>
      {movies.map((movie) => (
        <SwiperSlide key={movie.id} className="cursor-pointer" onClick={() => handleClick(movie)}>
          <div className="relative h-64 w-full rounded-sm border border-gray-600 overflow-hidden mb-4">
            <img
              className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-all ease-in-out"
              src={`https://image.tmdb.org/t/p/w780${movie.backdrop}`}
              alt={movie.title}
            />
          </div>
          <div>
            <div className="flex flex-col items-start">
              <span className="text-gray-400 font-bold">
                {movie.year?.slice(0, 4) || "—"}
              </span>
              <h3 className="text-2xl capitalize mb-2">{movie.title}</h3>
            </div>
            <div className="space-x-2">
              {movie.genre.map((genre, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-white font-bold"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MovieRowCarousel;
