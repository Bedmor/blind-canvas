import { createRoom } from "~/app/actions";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  /* eslint-disable */
  const rooms = await db.room.findMany({
    where: {
      OR: [{ status: "WAITING" }, { status: "IN_PROGRESS" }],
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          participants: true,
          drawings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Drawing Rooms
        </h1>
        <p className="mx-auto max-w-md text-sm text-gray-500 sm:text-base">
          Join an active room or create your own
        </p>
      </div>

      {/* Create Room Button */}
      <div className="mb-10 flex justify-center">
        <form action={createRoom}>
          <button className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-110 sm:px-8 sm:py-4 sm:text-lg">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Create New Room
          </button>
        </form>
      </div>

      {/* Rooms List */}
      {rooms.length === 0 ? (
        <div className="glass-card mx-auto max-w-md rounded-2xl border border-white/10 p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
            <svg
              className="h-7 w-7 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">No Active Rooms</h3>
          <p className="text-gray-500">
            Be the first to create a room and start drawing!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const isFull = room._count.participants >= 3;
            const isJoined = room.participants.some(
              (p) => p.userId === session.user.id,
            );

            return (
              <div
                key={room.id}
                className="glass-card group rounded-2xl border border-white/10 p-5 transition-all hover:border-white/20 sm:p-6"
              >
                {/* Room Status */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                      room.status === "WAITING"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {room.status === "WAITING" ? "Waiting" : "In Progress"}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {room._count.participants}/3
                  </span>
                </div>

                {/* Participants */}
                <div className="mb-4 flex -space-x-2">
                  {room.participants.slice(0, 3).map((participant) => (
                    <div
                      key={participant.id}
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 bg-gray-800 text-xs font-bold text-gray-300 ring-1 ring-white/10"
                      title={participant.user.name ?? "Anonymous"}
                    >
                      {participant.user.image ? (
                        <img
                          src={participant.user.image}
                          alt={participant.user.name ?? "User"}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        (participant.user.name?.[0]?.toUpperCase() ?? "?")
                      )}
                    </div>
                  ))}
                  {room._count.participants < 3 && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-white/10 text-xs text-gray-600">
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
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Progress Indicators */}
                <div className="mb-5 flex gap-1.5">
                  {["HEAD", "BODY", "LEGS"].map((part) => {
                    const hasDrawing = room.participants.some(
                      (p) => p.assignedPart === part,
                    );
                    return (
                      <div
                        key={part}
                        className={`flex-1 rounded-md px-2 py-1.5 text-center font-mono text-[11px] font-medium tracking-wide ${
                          hasDrawing
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-white/3 text-gray-600"
                        }`}
                      >
                        {part}
                      </div>
                    );
                  })}
                </div>

                {/* Join Button */}
                <Link
                  aria-disabled={isFull && !isJoined}
                  href={`/rooms/${room.id}`}
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-all ${
                    isJoined
                      ? "bg-blue-500/90 text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500"
                      : isFull
                        ? "cursor-not-allowed bg-white/5 text-gray-600"
                        : "bg-cyan-500/90 text-white shadow-lg shadow-cyan-500/10 hover:bg-cyan-500"
                  }`}
                >
                  {isJoined ? "Continue" : isFull ? "Room Full" : "Join Room"}
                </Link>

                {/* Room ID (small, for copying) */}
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="truncate font-mono text-[11px] text-gray-600">
                    {room.id}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
