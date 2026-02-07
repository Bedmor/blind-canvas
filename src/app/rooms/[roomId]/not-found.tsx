import Link from "next/link";

export default function RoomNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 text-neutral-100">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-6xl font-black text-rose-500">404</h1>
        <h2 className="text-2xl font-bold">Room Not Found</h2>
        <p className="text-neutral-400">
          The room you are looking for does not exist, has expired, or you do
          not have permission to view it.
        </p>
        <div>
          <Link
            href="/"
            className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
