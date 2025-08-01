"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
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

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-4">
            <SearchDialog />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
