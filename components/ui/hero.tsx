"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./badge";
import { Button } from "./button";
import { PlayIcon } from "lucide-react";
import { getBestMovies } from "@/helpers/getBestMovies";
import { useViewMovieStore } from "@/store/viewMovieStore";

const Hero = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getBestMovies();
      setMovies(data);
      // Start with a random movie instead of always the first one
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentIndex(randomIndex);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-xl">
        Loading ...
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="h-[70vh] overflow-hidden flex items-end py-6 px-4 lg:px-0 lg:pb-16">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentMovie.id}
          src={currentMovie.backdrop}
          alt={currentMovie.title}
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-65"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.65, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${currentMovie.id}`}
          className="max-w-xl relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl lg:text-7xl font-black mb-2">{currentMovie.title}</h1>
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-4">
              <span className="font-bold">{currentMovie.year}</span>
              {currentMovie.runtime && (
                <span className="font-bold">{currentMovie.runtime}m</span>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-4">
              {currentMovie.genres?.map((g: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-white font-bold"
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>
          <p className="mb-6 font-semibold">{currentMovie.overview}</p>
          <div>
            <Button
              onClick={() => {
                setMovie({
                  ...currentMovie,
                  media_type: 'movie',
                });
                setOpen(true);
              }}
              className="hover:scale-105 transition-transform duration-200 hover:bg-white/90"
              size="lg"
            >
              <PlayIcon fill="black" className="mr-2" />
              Watch Now
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Hero;
