"use client";
import { useViewMovieStore } from "@/store/viewMovieStore";
import { getTVShowDetails } from "@/helpers/getTVShowDetails";

interface MediaItem {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  poster: string;
  year: string;
  genre: string[];
}

const MovieCard = ({ movie, mediaType }: { movie: MediaItem; mediaType: 'movie' | 'tv' }) => {
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);
  const setTVShowDetails = useViewMovieStore((state) => state.setTVShowDetails);

  const handleClick = async () => {
    setOpen(true);
    const movieWithType = {
      ...movie,
      media_type: mediaType,
    };
    setMovie(movieWithType);

    // If it's a TV show, fetch the details
    if (mediaType === 'tv') {
      const tvShowDetails = await getTVShowDetails(movie.id);
      setTVShowDetails(tvShowDetails);
    }
  };

  return (
    <button
      key={movie.id}
      className="col-span-1 rounded-sm overflow-hidden cursor-pointer text-left"
      onClick={handleClick}
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
