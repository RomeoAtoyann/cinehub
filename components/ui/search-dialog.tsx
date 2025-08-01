"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, Star, Calendar, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMovies } from "@/helpers/searchMovies";
import { useViewMovieStore } from "@/store/viewMovieStore";

interface SearchResult {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
}

interface SearchDialogProps {
  onSearch?: (query: string) => void;
}

const SearchDialog = ({ onSearch }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Real API search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchMovies(query, 1);
      setSearchResults(result.movies);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, performSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const setOpen = useViewMovieStore((state) => state.setOpen);
  const setMovie = useViewMovieStore((state) => state.setMovie);

  const handleResultClick = (result: SearchResult) => {
    // Convert search result to movie format expected by the store
    const movie = {
      id: result.id,
      title: result.title,
      year: result.release_date ? new Date(result.release_date).getFullYear().toString() : "",
      image: result.poster_path || "",
      backdrop: result.backdrop_path || "",
      poster: result.poster_path || "",
      genre: [], // We could add genre mapping if needed
    };

    // Open the view movie modal
    setMovie(movie);
    setOpen(true);
    
    // Close the search dialog and reset
    setIsOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="aspect-square border border-white p-2 size-10"
        >
          <Search className="w-full h-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-scroll flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-secondary">
            Search Movies
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col flex-1 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
            )}
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-muted-foreground">Searching for movies...</p>
              </div>
            )}
            
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <div className="flex flex-col items-center gap-2">
                  <Search className="w-8 h-8 opacity-50" />
                  <p>No movies found for "{searchQuery}"</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              </div>
            )}
            
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-border group"
                  >
                    {/* Movie Poster */}
                    <div className="flex-shrink-0">
                      {result.poster_path ? (
                        <img
                          src={result.poster_path}
                          alt={result.title}
                          className="w-16 h-24 object-cover rounded-md shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-muted rounded-md flex items-center justify-center">
                          <Play className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Movie Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                          {result.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {result.vote_average && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{result.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                          <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>

                      {/* Release Year */}
                      {result.release_date && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(result.release_date).getFullYear()}</span>
                        </div>
                      )}

                      {/* Overview */}
                      {result.overview && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                          {result.overview}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog; 