import Link from "next/link";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
  tagline: string;
}

async function getMovie(id: string): Promise<Movie> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  );
  return res.json();
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovie(id);

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
          {movie.title}
        </h1>
      </header>

      {/* Player */}
      <div className="w-full bg-black aspect-video">
        <iframe
          src={`https://www.vidking.net/embed/movie/${id}`}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        />
      </div>

      {/* Info */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-1">{movie.title}</h2>
        {movie.tagline && (
          <p className="text-zinc-500 italic mb-4 text-sm">{movie.tagline}</p>
        )}
        <div className="flex flex-wrap gap-2 text-sm text-zinc-400 mb-5">
          {movie.release_date && (
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {movie.release_date.slice(0, 4)}
            </span>
          )}
          {movie.runtime > 0 && (
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </span>
          )}
          {movie.vote_average > 0 && (
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-yellow-400">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          )}
          {movie.genres?.map((g) => (
            <span
              key={g.id}
              className="bg-purple-900/30 border border-purple-500/20 px-3 py-1 rounded-full text-purple-300"
            >
              {g.name}
            </span>
          ))}
        </div>
        {movie.overview && (
          <p className="text-zinc-400 leading-relaxed">{movie.overview}</p>
        )}
      </div>
    </div>
  );
}
