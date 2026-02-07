import { createRoom } from "~/app/actions";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import Link from "next/link";

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
    <div className="container mx-auto min-h-screen px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Drawing Rooms
        </h1>
        <p className="mx-auto max-w-md text-sm text-gray-400 sm:text-base">
          Join an active room or create your own!
        </p>
      </div>

      {/* Create Room Button */}
      <div className="mb-8 flex justify-center">
        <form action={createRoom}>
          <button className="rounded-lg bg-emerald-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:bg-emerald-600 sm:px-8 sm:py-4 sm:text-lg">
            + Create New Room
          </button>
        </form>
      </div>

      {/* Rooms List */}
      {rooms.length === 0 ? (
        <div className="mx-auto max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8 text-center">
          <div className="mb-4 text-5xl">🎨</div>
          <h3 className="mb-2 text-xl font-bold text-white">No Active Rooms</h3>
          <p className="text-gray-400">
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
                className="rounded-xl border border-gray-700 bg-gray-800 p-4 transition-all hover:border-gray-600 sm:p-6"
              >
                {/* Room Status */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      room.status === "WAITING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {room.status === "WAITING" ? "Waiting" : "In Progress"}
                  </span>
                  <span className="text-sm text-gray-400">
                    {room._count.participants}/3 players
                  </span>
                </div>

                {/* Participants */}
                <div className="mb-4 flex -space-x-2">
                  {room.participants.slice(0, 3).map((participant, idx) => (
                    <div
                      key={participant.id}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-800 bg-gray-700 text-xs font-bold text-white"
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
                </div>

                {/* Progress Indicators */}
                <div className="mb-4 flex gap-2">
                  {["HEAD", "BODY", "LEGS"].map((part) => {
                    const hasDrawing = room.participants.some(
                      (p) => p.assignedPart === part,
                    );
                    return (
                      <div
                        key={part}
                        className={`flex-1 rounded px-2 py-1 text-center font-mono text-xs ${
                          hasDrawing
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-gray-700 text-gray-500"
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
                  className={`block w-full rounded-lg py-2 text-center font-semibold transition-colors ${
                    isJoined
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : isFull
                        ? "cursor-not-allowed bg-gray-700 text-gray-500"
                        : "bg-cyan-500 text-white hover:bg-cyan-600"
                  }`}
                >
                  {isJoined ? "Continue" : isFull ? "Room Full" : "Join Room"}
                </Link>

                {/* Room ID (small, for copying) */}
                <div className="mt-3 border-t border-gray-700 pt-3">
                  <p className="truncate text-xs text-gray-500">
                    ID: {room.id}
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
