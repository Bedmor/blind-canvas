import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "~/components/AuthButtons";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/rooms");

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {/* Background accent */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="animate-fade-in-up relative z-10 w-full max-w-md">
        <div className="glass-card rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Logo / Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20">
              <svg
                className="h-8 w-8 text-white"
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
            <h1 className="bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Blind Canvas
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Arkadaşlarınla çizmek için giriş yap
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-white/5" />

          {/* How it works */}
          <div className="stagger-children mb-8 space-y-3">
            <h2 className="text-center text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Nasıl çalışır
            </h2>
            <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-400">
                1
              </span>
              <p className="text-sm text-gray-400">
                1. Oyuncu çizer: <strong className="text-gray-300">baş</strong>
              </p>
            </div>
            <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-400">
                2
              </span>
              <p className="text-sm text-gray-400">
                2. Oyuncu çizer:{" "}
                <strong className="text-gray-300">gövde</strong> (sadece boyun
                çizgilerini görür)
              </p>
            </div>
            <div className="animate-fade-in flex items-center gap-3 rounded-xl border border-white/5 bg-white/2 p-3.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-sm font-bold text-purple-400">
                3
              </span>
              <p className="text-sm text-gray-400">
                3. Oyuncu çizer:{" "}
                <strong className="text-gray-300">bacaklar</strong> (sadece bel
                çizgilerini görür)
              </p>
            </div>
          </div>

          {/* Sign In Button */}
          <SignInButton />

          <p className="mt-6 text-center text-xs text-gray-600">
            Giriş yaparak garip yaratıklar çizip eğlenmeyi kabul etmiş
            olursunuz.
          </p>
        </div>
      </div>
    </main>
  );
}
