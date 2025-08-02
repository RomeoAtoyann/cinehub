import { create } from "zustand";

interface MediaItem {
  id: number;
  title: string;
  year: string;
  image: string;
  backdrop: string;
  poster: string;
  genre: string[];
  media_type: 'movie' | 'tv';
}

interface TVShowDetails {
  tmdbId: number;
  imdbId: string | null;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  seasons: any[];
  total_seasons: number;
}

interface MovieState {
  open: boolean;
  movie: MediaItem | null;
  tvShowDetails: TVShowDetails | null;
  selectedSeason: number;
  selectedEpisode: number;
  setOpen: (value: boolean) => void;
  setMovie: (value: MediaItem) => void;
  setTVShowDetails: (details: TVShowDetails | null) => void;
  setSelectedSeason: (season: number) => void;
  setSelectedEpisode: (episode: number) => void;
  setInitialSeasonAndEpisode: (season: number, episode: number) => void;
}

export const useViewMovieStore = create<MovieState>()((set) => ({
  open: false,
  movie: null,
  tvShowDetails: null,
  selectedSeason: 1,
  selectedEpisode: 1,
  setOpen: (value) => set({ open: value }),
  setMovie: (value) => set({ movie: value }),
  setTVShowDetails: (details) => set({ tvShowDetails: details }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),
  setSelectedEpisode: (episode) => set({ selectedEpisode: episode }),
  setInitialSeasonAndEpisode: (season, episode) => set({ selectedSeason: season, selectedEpisode: episode }),
}));
