"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { WavyBackground } from "@/components/ui/wavy-background";

type MediaType = "movie" | "tv";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string, type: MediaType) => {
    if (!q.trim()) return setResults([]);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&type=${type}`,
      );
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val, mediaType);
  };

  const switchType = (type: MediaType) => {
    setMediaType(type);
    if (query) search(query, type);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Fixed wavy background — always visible behind all content */}
      <WavyBackground
        containerClassName="fixed inset-0 -z-10"
        backgroundFill="#08080f"
        colors={["#7c3aed", "#4f46e5", "#0ea5e9", "#c084fc", "#38bdf8"]}
        speed="slow"
        blur={8}
        waveOpacity={0.6}
      />

      {/* Scrollable content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero */}
        <div className="flex flex-col items-center pt-20 pb-12 px-4">
          <h1 className="text-5xl font-bold tracking-tight mb-2 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Aurora Movies
          </h1>
          <p className="text-zinc-400 mb-8 text-sm">
            Stream movies &amp; TV shows instantly
          </p>

          {/* Type toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-6 backdrop-blur-sm">
            <button
              onClick={() => switchType("movie")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mediaType === "movie"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => switchType("tv")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                mediaType === "tv"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              TV Shows
            </button>
          </div>

          {/* Search */}
          <div className="w-full max-w-xl relative">
            <input
              type="text"
              value={query}
              onChange={handleInput}
              placeholder={`Search ${mediaType === "movie" ? "movies" : "TV shows"}…`}
              className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/60 backdrop-blur-sm transition-all"
            />
            {loading && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={`/${mediaType}/${item.id}`}
                  className="group relative rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-purple-500/40 hover:scale-[1.03] transition-all duration-200 shadow-xl backdrop-blur-sm"
                >
                  {item.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={item.title || item.name || ""}
                      width={342}
                      height={513}
                      className="w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[2/3] bg-white/5 flex items-center justify-center text-zinc-600 text-xs text-center p-4">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-medium leading-tight text-white">
                      {item.title || item.name}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate text-zinc-100">
                      {item.title || item.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {(item.release_date || item.first_air_date || "").slice(
                        0,
                        4,
                      )}
                      {item.vote_average > 0 &&
                        ` · ★ ${item.vote_average.toFixed(1)}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center text-zinc-700 pb-20 text-sm">
              {query
                ? "No results found."
                : "Start searching to discover content."}
            </div>
          )
        )}
      </div>
    </div>
  );
}
