import Link from "next/link";

export default function RoomNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="animate-fade-in-up max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10">
          <svg
            className="h-8 w-8 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h1 className="text-5xl font-black tracking-tight text-rose-400">
          404
        </h1>
        <h2 className="text-xl font-bold text-white">Room Not Found</h2>
        <p className="text-sm leading-relaxed text-gray-500">
          The room you are looking for does not exist, has expired, or you do
          not have permission to view it.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
