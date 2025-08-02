export const getTVShowDetailsForRecent = async (tvShowId: number) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
  };

  try {
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}?language=en-US`;
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`TMDB TV show details failed: ${res.status}`);
    }

    const data = await res.json();

    return {
      id: data.id,
      title: data.name,
      overview: data.overview,
      poster_path: data.poster_path
        ? `https://image.tmdb.org/t/p/w200${data.poster_path}`
        : null,
      backdrop_path: data.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}`
        : null,
      first_air_date: data.first_air_date,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      genre_ids: data.genres?.map((genre: any) => genre.id) || [],
    };
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}; 