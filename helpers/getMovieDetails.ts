export const getMovieDetails = async (movieId: number) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
  };

  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`TMDB movie details failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path
        ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
        : null,
      backdrop_path: data.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
        : null,
      release_date: data.release_date,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      genre_ids: data.genres?.map((genre: any) => genre.id) || [],
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}; 