"use client";
import { useViewMovieStore } from "@/store/viewMovieStore";
import { Movie } from "./movie-row";

const MovieCard = ({ movie }: { movie: Movie }) => {
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);

  return (
    <button
      key={movie.id}
      className="col-span-1 rounded-sm overflow-hidden cursor-pointer text-left"
      onClick={() => {
        setOpen(true);
        setMovie(movie);
      }}
    >
      <img
        className="object-cover transition-all ease-in-out border mb-2 rounded-sm"
        src={movie.image}
        alt={movie.title}
      />
      <h3 className="text-white text-lg font-bold leading-normal">
        {movie.title}
      </h3>
      <span className="text-gray-400">{movie.year}</span>
    </button>
  );
};

export default MovieCard;
