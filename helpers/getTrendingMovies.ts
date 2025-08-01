export const GENRES = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
  } as const;
  
  export type GenreName = keyof typeof GENRES;
  
  export const getTrendingMovies = async (page = 1) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
      },
    };
  
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`, 
        options
      );
  
      if (!res.ok) {
        throw new Error(`TMDB fetch failed: ${res.status}`);
      }
  
      const data = await res.json();
  
      const movies = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        backdrop: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
          : "",
        poster: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
          : "",
        year: movie.release_date?.slice(0, 4) ?? "",
        genre: (movie.genre_ids ?? [])
          .map((id: number) =>
            (Object.keys(GENRES) as GenreName[]).find(
              (key) => GENRES[key] === id
            )
          )
          .filter(Boolean) as GenreName[],
      }));
  
      return movies;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return [];
    }
  };
  