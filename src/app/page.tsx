import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-5xl flex-row items-center justify-center gap-12">
        <div className="max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 p-8 text-center shadow-xl">
          <h1 className="mb-6 bg-emerald-400 bg-clip-text text-5xl font-extrabold text-transparent">
            Kör Kolektif Tuval
          </h1>
          <p className="mb-8 text-xl leading-relaxed text-gray-300">
            The digital &ldquo;Exquisite Corpse&rdquo;. Create strange and
            wonderful creatures with friends. Draw the head, body, or legs
            relying only on the connection lines from the previous artist.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href={session?.user ? "/rooms" : "/login"}
              className="transform rounded-full bg-emerald-500 px-8 py-3 font-bold text-white transition-all hover:scale-105 hover:bg-emerald-600"
            >
              {session?.user ? "Play Now" : "Sign In to Play"}
            </Link>
          </div>
        </div>
        {/* Illustration: 3 parts of the creature */}
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="flex h-24 w-24 items-center justify-center rounded-t-xl border border-gray-700 bg-gray-800 text-3xl">
              🧠
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="flex h-24 w-24 items-center justify-center border border-gray-700 bg-gray-800 text-3xl">
              👕
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="flex h-24 w-24 items-center justify-center rounded-b-xl border border-gray-700 bg-gray-800 text-3xl">
              👖
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
