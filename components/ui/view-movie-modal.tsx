"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useViewMovieStore } from "@/store/viewMovieStore";
import { addToRecentlyWatched, getRecentlyWatched } from "@/helpers/recentlyWatchedUtils";

const ViewMovieModal = () => {
  const open = useViewMovieStore((state) => state.open);
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const movie = useViewMovieStore((state) => state.movie);
  const tvShowDetails = useViewMovieStore((state) => state.tvShowDetails);
  const selectedSeason = useViewMovieStore((state) => state.selectedSeason);
  const selectedEpisode = useViewMovieStore((state) => state.selectedEpisode);
  const setSelectedSeason = useViewMovieStore((state) => state.setSelectedSeason);
  const setSelectedEpisode = useViewMovieStore((state) => state.setSelectedEpisode);

  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const isInitialLoad = useRef(true);
  const lastProcessedSeason = useRef(1);

  const { title, year, id, media_type, overview } = (movie as any) ?? {};

  // Reset the initial load flag when modal opens
  useEffect(() => {
    if (open && media_type === 'tv') {
      isInitialLoad.current = true;
      lastProcessedSeason.current = selectedSeason;
    }
  }, [open, media_type, selectedSeason]);

  // Fetch episodes when season changes
  useEffect(() => {
    if (media_type === 'tv' && tvShowDetails?.tmdbId && selectedSeason) {
      setLoadingEpisodes(true);
      // Get episodes from TMDB API
      fetch(`https://api.themoviedb.org/3/tv/${tvShowDetails.tmdbId}/season/${selectedSeason}?language=en-US`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
        },
      })
      .then(res => res.json())
      .then((seasonData) => {
        if (seasonData?.episodes) {
          setEpisodes(seasonData.episodes);
          // Only reset episode to 1 if this is a manual season change, not initial load
          if (isInitialLoad.current) {
            // This is the initial load, don't reset episode
            isInitialLoad.current = false;
          } else if (lastProcessedSeason.current !== selectedSeason) {
            // This is a manual season change, reset episode
            setSelectedEpisode(1);
          }
          // Update lastProcessedSeason after processing
          lastProcessedSeason.current = selectedSeason;
        }
        setLoadingEpisodes(false);
      })
      .catch(error => {
        setLoadingEpisodes(false);
      });
    }
  }, [media_type, tvShowDetails?.tmdbId, selectedSeason, setSelectedEpisode, selectedEpisode]);

  const getEmbedUrl = () => {
    if (media_type === 'movie') {
      return `https://www.2embed.cc/embed/${id}`;
    } else if (media_type === 'tv' && id) {
      return `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode}`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();



  // Track when user watches content
  useEffect(() => {
    if (embedUrl && movie) {
      if (media_type === 'movie') {
        addToRecentlyWatched(movie.id, 'movie');
      } else if (media_type === 'tv') {
        addToRecentlyWatched(movie.id, 'tv', selectedSeason, selectedEpisode);
      }
    }
  }, [embedUrl, movie, media_type, selectedSeason, selectedEpisode]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full lg:h-auto lg:max-w-6xl lg:min-h-[700px]">
        <DialogHeader className="p-4">
          <DialogTitle className="text-left lg:text-6xl">{title}</DialogTitle>
          <span className="text-gray-400 text-lg inline text-left">{year}</span>
          {(overview || (media_type === 'tv' && tvShowDetails?.overview)) && (
            <p className="text-gray-300 text-sm lg:text-base mt-4 leading-relaxed max-w-2xl text-left">
              {media_type === 'tv' && tvShowDetails?.overview ? tvShowDetails.overview : (overview || '')}
            </p>
          )}
        </DialogHeader>
        
        {media_type === 'tv' && tvShowDetails && (
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-center">
              <div>
                <label className="text-sm font-medium text-white">Season:</label>
                <select 
                  value={selectedSeason} 
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="ml-2 px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded"
                >
                  {Array.from({ length: tvShowDetails.total_seasons }, (_, i) => i + 1).map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-white">Episode:</label>
                <select 
                  value={selectedEpisode} 
                  onChange={(e) => setSelectedEpisode(parseInt(e.target.value))}
                  className="ml-2 px-2 py-1 bg-gray-800 text-white border border-gray-600 rounded"
                >
                  {loadingEpisodes ? (
                    <option value="loading">Loading...</option>
                  ) : (
                    episodes.map((episode, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {embedUrl ? (
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <h1 className="text-xl text-muted-foreground">
              {media_type === 'tv' ? 'Loading TV show details...' : 'No content found'}
            </h1>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMovieModal;
