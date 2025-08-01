import type { Metadata } from "next";
import { Red_Hat_Display, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/ui/navbar";
import ViewMovieModal from "@/components/ui/view-movie-modal";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cinehub - Your one-stop hub for movies and TV shows",
  description: "Discover the best movies and TV shows from around the world",
  icons: "/favicon.png"
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${redHatDisplay.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <body className="font-primary antialiased dark">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative z-0 overflow-hidden">
            <Navbar />
            {children}
            <ViewMovieModal />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
