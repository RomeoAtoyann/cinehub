export const searchTVShows = async (query: string, page = 1) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    },
  };

  try {
    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`;
    
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`TMDB search failed: ${res.status}`);
    }

    const data = await res.json();

    const tvShows = data.results.map((show: any) => ({
      id: show.id,
      title: show.name,
      overview: show.overview,
      poster_path: show.poster_path
        ? `https://image.tmdb.org/t/p/w200${show.poster_path}`
        : null,
      backdrop_path: show.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
        : null,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
      vote_count: show.vote_count,
      genre_ids: show.genre_ids || [],
    }));

    return {
      tvShows,
      total_pages: data.total_pages,
      total_results: data.total_results,
    };
  } catch (error) {
    console.error("Error searching TV shows:", error);
    return {
      tvShows: [],
      total_pages: 0,
      total_results: 0,
    };
  }
}; 