import Link from "next/link";
import { auth } from "~/server/auth";
import { SignOutButton } from "./AuthButtons";

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-gray-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-cyan-500">
            <svg
              className="h-4.5 w-4.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </div>
          <span className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            Blind Canvas
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    className="h-8 w-8 rounded-full ring-2 ring-white/10 transition-all hover:ring-white/20"
                  />
                )}
                <span className="hidden text-sm font-medium text-gray-400 sm:block">
                  {session.user.name}
                </span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-110"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
