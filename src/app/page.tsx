import Link from "next/link";
import { auth } from "~/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      {/* Background accent blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-125 w-125 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute right-1/4 -bottom-40 h-100 w-100 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between">
        {/* Text content */}
        <div className="animate-fade-in-up max-w-xl text-center lg:text-left">
          <p className="mb-4 text-sm font-semibold tracking-widest text-emerald-400 uppercase">
            İşbirlikçi Çizim Oyunu
          </p>
          <h1 className="mb-6 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              Blind Canvas
            </span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-gray-400 sm:text-xl">
            Dijital Zarif Ceset oyunu. Arkadaşlarınızla garip ve harika
            yaratıklar oluşturun. Sadece önceki sanatçının bağlantı çizgilerine
            bakarak başını, gövdesini veya bacaklarını çizin.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href={session?.user ? "/rooms" : "/login"}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 font-bold text-white shadow-xl shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-110"
            >
              {session?.user ? "Çizime Başla" : "Oynamak İçin Giriş Yap"}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Illustration: Stacked creature parts with SVG icons */}
        <div className="animate-float flex flex-col items-center gap-0">
          {/* Head */}
          <div className="glass-card flex h-28 w-28 items-center justify-center rounded-t-2xl border border-white/10 bg-linear-to-br from-emerald-500/10 to-transparent">
            <svg
              className="h-12 w-12 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="10" r="7" />
              <circle cx="9.5" cy="9" r="1" fill="currentColor" />
              <circle cx="14.5" cy="9" r="1" fill="currentColor" />
              <path d="M9 13c.5 1 1.5 1.5 3 1.5s2.5-.5 3-1.5" />
            </svg>
          </div>
          {/* Dashed connector */}
          <div className="h-px w-20 border-t border-dashed border-white/20" />
          {/* Body */}
          <div className="glass-card flex h-28 w-28 items-center justify-center border-x border-white/10 bg-linear-to-br from-cyan-500/10 to-transparent">
            <svg
              className="h-12 w-12 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18" />
              <path d="M5 8l7-2 7 2" />
              <path d="M8 8v6c0 1 1.5 2 4 2s4-1 4-2V8" />
            </svg>
          </div>
          {/* Dashed connector */}
          <div className="h-px w-20 border-t border-dashed border-white/20" />
          {/* Legs */}
          <div className="glass-card flex h-28 w-28 items-center justify-center rounded-b-2xl border border-white/10 bg-linear-to-br from-purple-500/10 to-transparent">
            <svg
              className="h-12 w-12 text-purple-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 4v8l-4 8" />
              <path d="M14 4v8l4 8" />
              <path d="M6 20h3" />
              <path d="M15 20h3" />
            </svg>
          </div>

          {/* Labels */}
          <div className="mt-4 flex gap-6 text-xs font-medium tracking-wider text-gray-500">
            <span className="text-emerald-500/70">HEAD</span>
            <span className="text-cyan-500/70">BODY</span>
            <span className="text-purple-500/70">LEGS</span>
          </div>
        </div>
      </div>
    </main>
  );
}
