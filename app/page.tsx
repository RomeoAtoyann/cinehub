import Hero from "@/components/ui/hero";
import MovieRow from "@/components/ui/movie-row";
import TVShowRow from "@/components/ui/tv-show-row";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="relative z-0 mb-8">
        <div className="container mx-auto">
          <Hero />
        </div>
      </div>
      <div className="container mx-auto">
        <div className="space-y-4">
          <MovieRow platformTitle="Movies" />
          <TVShowRow platformTitle="TV Shows" />
        </div>
      </div>
    </>
  );
};

export default Page;
