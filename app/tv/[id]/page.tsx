"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Episode {
  episode_number: number;
  name: string;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
}

interface TVShow {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  tagline: string;
  genres: { id: number; name: string }[];
  seasons: Season[];
}

export default function TVPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [show, setShow] = useState<TVShow | null>(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    fetch(`/api/tv/${id}`)
      .then((r) => r.json())
      .then((data: TVShow) => {
        setShow(data);
        const first = data.seasons?.find((s) => s.season_number > 0);
        if (first) setSeason(first.season_number);
      });
  }, [id]);

  useEffect(() => {
    fetch(`/api/tv/${id}/season/${season}`)
      .then((r) => r.json())
      .then((data) => {
        setEpisodes(data.episodes || []);
        setEpisode(1);
        setIframeKey((k) => k + 1);
      });
  }, [id, season]);

  const handleEpisode = (ep: number) => {
    setEpisode(ep);
    setIframeKey((k) => k + 1);
  };

  const realSeasons = show?.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] backdrop-blur-sm sticky top-0 bg-[#08080f]/80 z-10">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          ← Back
        </Link>
        <span className="text-zinc-600">|</span>
        <h1 className="font-semibold text-sm truncate text-zinc-200">
          {show?.name ?? "Loading…"}
        </h1>
        {show && (
          <span className="text-xs text-zinc-500 ml-auto shrink-0">
            S{season} · E{episode}
          </span>
        )}
      </header>

      {/* Player */}
      <div className="w-full bg-black aspect-video">
        <iframe
          key={iframeKey}
          src={`https://www.vidking.net/embed/tv/${id}/${season}/${episode}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        />
      </div>

      {/* Controls */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Season tabs */}
        {realSeasons.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Season
            </p>
            <div className="flex flex-wrap gap-2">
              {realSeasons.map((s) => (
                <button
                  key={s.season_number}
                  onClick={() => setSeason(s.season_number)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    season === s.season_number
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {s.season_number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode grid */}
        {episodes.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              Episode
            </p>
            <div className="flex flex-wrap gap-2">
              {episodes.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => handleEpisode(ep.episode_number)}
                  title={ep.name}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    episode === ep.episode_number
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                      : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  E{ep.episode_number}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Show info */}
        {show && (
          <>
            <h2 className="text-3xl font-bold mb-1">{show.name}</h2>
            {show.tagline && (
              <p className="text-zinc-500 italic mb-4 text-sm">
                {show.tagline}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-sm text-zinc-400 mb-5">
              {show.first_air_date && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  {show.first_air_date.slice(0, 4)}
                </span>
              )}
              {show.vote_average > 0 && (
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-yellow-400">
                  ★ {show.vote_average.toFixed(1)}
                </span>
              )}
              {show.genres?.map((g) => (
                <span
                  key={g.id}
                  className="bg-purple-900/30 border border-purple-500/20 px-3 py-1 rounded-full text-purple-300"
                >
                  {g.name}
                </span>
              ))}
            </div>
            {show.overview && (
              <p className="text-zinc-400 leading-relaxed">{show.overview}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
