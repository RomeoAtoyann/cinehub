"use client";

import Link from "next/link";
import { Menu, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SearchDialog from "./search-dialog";

const Navbar = () => {
  return (
    <header className="container mx-auto px-4 lg:px-0">
      <nav className="absolute z-[1] py-8 max-w-[90vw] w-full">
        <div className="flex items-center justify-between lg:justify-start gap-16">
          {/* Logo */}
          <Link href="/" className="text-5xl font-secondary">
            Cinehub
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center justify-start gap-8">
            <Link href="/" className="text-xl">
              Home
            </Link>
            <Link href="/" className="text-xl">
              Browse
            </Link>
            <Link href="/" className="text-xl">
              Trending
            </Link>
            <Link href="/" className="text-xl">
              Popular
            </Link>
          </ul>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-4">
            <SearchDialog />
            
            {/* Mobile Sidebar */}
            <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="aspect-square border border-white p-2 size-10"
                  variant="ghost"
                >
                  <MenuIcon className="w-full h-full" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-secondary">
                    Cinehub
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <Link href="/" className="text-lg">
                    Home
                  </Link>
                  <Link href="/" className="text-lg">
                    Browse
                  </Link>
                  <Link href="/" className="text-lg">
                    Trending
                  </Link>
                  <Link href="/" className="text-lg">
                    Popular
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
