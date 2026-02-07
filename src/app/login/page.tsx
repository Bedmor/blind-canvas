import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "~/components/AuthButtons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/rooms");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-8 shadow-2xl">
        {/* Logo / Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-cyan-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10"
            >
              <path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6z" />
              <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M16 17c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
            </svg>
          </div>
          <h1 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-extrabold text-transparent">
            Kör Kolektif Tuval
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to start drawing with friends
          </p>
        </div>

        {/* Divider */}
        <div className="mb-6 border-t border-gray-700" />

        {/* How it works */}
        <div className="mb-8 space-y-3">
          <h2 className="text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
            How it works
          </h2>
          <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-400">
              1
            </span>
            <p className="text-sm text-gray-300">
              Player 1 draws the <strong>head</strong>
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-400">
              2
            </span>
            <p className="text-sm text-gray-300">
              Player 2 draws the <strong>body</strong> (only sees neck lines)
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-800 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
              3
            </span>
            <p className="text-sm text-gray-300">
              Player 3 draws the <strong>legs</strong> (only sees waist lines)
            </p>
          </div>
        </div>

        {/* Sign In Button */}
        <SignInButton />

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing in you agree to have fun drawing weird creatures.
        </p>
      </div>
    </main>
  );
}
