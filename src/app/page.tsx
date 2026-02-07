import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 text-white">
      <div className="max-w-2xl rounded-2xl border border-gray-700 bg-gray-800 p-8 text-center shadow-xl">
        <h1 className="mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-5xl font-extrabold text-transparent">
          Kör Kolektif Tuval
        </h1>
        <p className="mb-8 text-xl leading-relaxed text-gray-300">
          The digital "Exquisite Corpse". Create strange and wonderful creatures
          with friends. Draw the head, body, or legs relying only on the
          connection lines from the previous artist.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/rooms"
            className="transform rounded-full bg-emerald-500 px-8 py-3 font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600"
          >
            {session?.user ? "Play Now" : "Enter to Login/Play"}
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
          <div className="h-20 animate-pulse rounded bg-gray-700"></div>
          <div className="h-20 animate-pulse rounded bg-gray-700 delay-75"></div>
          <div className="h-20 animate-pulse rounded bg-gray-700 delay-150"></div>
        </div>
      </div>
    </main>
  );
}
