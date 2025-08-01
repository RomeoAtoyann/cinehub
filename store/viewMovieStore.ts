import { create } from "zustand";

interface MovieState {
  open: boolean;
  movie: any;
  setOpen: (value: boolean) => void;
  setMovie: (value: any) => void;
}

export const useViewMovieStore = create<MovieState>()((set) => ({
  open: false,
  movie: null,
  setOpen: (value) => set({ open: value }),
  setMovie: (value) => set({ movie: value }),
}));
