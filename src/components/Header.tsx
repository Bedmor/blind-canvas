import Link from "next/link";
import { auth } from "~/server/auth";
import { SignOutButton } from "./AuthButtons";

export default async function Header() {
  const session = await auth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-lg font-extrabold text-transparent"
        >
          Kör Tuval
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="h-8 w-8 rounded-full border border-gray-600"
                />
              )}
              <span className="hidden text-sm text-gray-300 sm:block">
                {session.user.name}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
