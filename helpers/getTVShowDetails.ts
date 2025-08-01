export const getTVShowDetails = async (tmdbId: number) => {
  try {
    // Get the TMDB details
    const tmdbResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      }
    );

    if (!tmdbResponse.ok) {
      throw new Error(`TMDB fetch failed: ${tmdbResponse.status}`);
    }

    const tmdbData = await tmdbResponse.json();

    // Get seasons information
    const seasonsResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US&append_to_response=seasons`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      }
    );

    if (!seasonsResponse.ok) {
      throw new Error(`TMDB seasons fetch failed: ${seasonsResponse.status}`);
    }

    const seasonsData = await seasonsResponse.json();

    return {
      tmdbId,
      imdbId: tmdbData.external_ids?.imdb_id || null,
      title: tmdbData.name,
      overview: tmdbData.overview,
      poster_path: tmdbData.poster_path,
      backdrop_path: tmdbData.backdrop_path,
      first_air_date: tmdbData.first_air_date,
      seasons: seasonsData.seasons || [],
      total_seasons: tmdbData.number_of_seasons,
    };
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
};

 