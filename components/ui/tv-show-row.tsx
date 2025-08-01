"use client";

import { useState, useEffect } from "react";
import { GenreName, getTrendingTVShows } from "@/helpers/getTrendingTVShows";
import MovieCard from "./movie-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TVShowRowProps {
  platformTitle: "TV Shows";
}

export interface TVShow {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  poster: string;
  year: string;
  genre: GenreName[];
}

const TVShowRow = ({ platformTitle }: TVShowRowProps) => {
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTVShows = async () => {
      const data = await getTrendingTVShows(page);
      setTVShows(data);
    };
    fetchTVShows();
  }, [page]);

  return (
    <div className="pb-8 px-4 lg:px-0">
      <h1 className="text-4xl font-bold mb-6">Popular {platformTitle}</h1>
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {tvShows.map((show) => (
          <MovieCard key={show.id} movie={show} mediaType="tv" />
        ))}
      </section>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" onClick={() => setPage((p) => p + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage((p) => p + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TVShowRow; 