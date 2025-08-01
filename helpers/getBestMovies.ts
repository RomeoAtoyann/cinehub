import { GENRE_ID_TO_NAME } from "./genres";

export interface BestMovie {
  id: number;
  title: string;
  year: string;
  runtime: number | null;
  genres: string[];
  overview: string;
  backdrop: string;
  poster: string;
}

export const getBestMovies = async (page = 1): Promise<BestMovie[]> => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`,
    options
  );

  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return data.results.map((movie: any) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date?.slice(0, 4) ?? "",
    runtime: null, // Not available in this endpoint; set null or fetch separately
    genres: (movie.genre_ids ?? [])
      .map((id: number) => GENRE_ID_TO_NAME[id])
      .filter(Boolean),
    overview: movie.overview,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : "",
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "",
  }));
};
