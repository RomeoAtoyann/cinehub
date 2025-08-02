export interface TVShowDetailsForRecent {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  overview: string;
}

export const getTVShowDetailsForRecent = async (
  id: number
): Promise<TVShowDetailsForRecent | null> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.id,
      title: data.name,
      backdrop_path: data.backdrop_path ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` : "",
      poster_path: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "",
      first_air_date: data.first_air_date,
      overview: data.overview,
    };
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}; 