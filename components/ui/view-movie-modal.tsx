"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useViewMovieStore } from "@/store/viewMovieStore";

const ViewMovieModal = () => {
  const open = useViewMovieStore((state) => state.open);
  const setOpen = useViewMovieStore((state) => state.setOpen);
  const movie = useViewMovieStore((state) => state.movie);

  const { title, year, id } = movie ?? {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full lg:h-auto lg:max-w-6xl lg:min-h-[700px]">
        <DialogHeader className="p-4">
          <DialogTitle className="text-left lg:text-6xl">{title}</DialogTitle>
          <span className="text-gray-400 text-lg inline text-left">{year}</span>
        </DialogHeader>
        {id ? (
          <div className="aspect-video">
            <iframe
              src={`https://www.2embed.cc/embed/${id}`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <h1>No movie found</h1>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewMovieModal;
