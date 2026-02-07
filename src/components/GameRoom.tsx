"use client";

import { useState } from "react";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider, useChannel } from "ably/react";
import DrawingCanvas from "./DrawingCanvas";
import { saveDrawing } from "~/app/actions";
import { useRouter } from "next/navigation";

interface DrawingData {
  id: string;
  part: "HEAD" | "BODY" | "LEGS";
  data: string;
  roomId: string;
  participantId: string;
  createdAt: Date | string;
}

interface RoomData {
  id: string;
  createdAt: Date | string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  drawings: DrawingData[];
  participants: {
    id: string;
    userId: string;
    assignedPart: "HEAD" | "BODY" | "LEGS" | null;
    user: { id: string; name: string | null; image: string | null };
  }[];
}

// Inner component to use hooks
function GameBoard({
  room,
  _userId,
  userRole,
  roomId,
}: {
  room: RoomData;
  _userId: string;
  userRole?: "HEAD" | "BODY" | "LEGS" | null;
  roomId: string;
}) {
  const router = useRouter();

  useChannel(`room-${roomId}`, (message) => {
    console.log("Room update", message);
    router.refresh();
  });

  const myDrawing = room.drawings.find((d) => d.part === userRole);
  const headDrawing = room.drawings.find((d) => d.part === "HEAD");
  const bodyDrawing = room.drawings.find((d) => d.part === "BODY");
  const legsDrawing = room.drawings.find((d) => d.part === "LEGS");

  const onDrawSubmit = async (data: string) => {
    if (!userRole) return;
    await saveDrawing(roomId, data, userRole);
  };

  let guideImage: string | null = null;
  if (userRole === "BODY" && headDrawing) {
    guideImage = headDrawing.data;
  } else if (userRole === "LEGS" && bodyDrawing) {
    guideImage = bodyDrawing.data;
  }

  if (room.status === "COMPLETED") {
    return (
      <div className="flex min-h-screen flex-col items-center gap-2 bg-white p-8">
        <h1 className="mb-8 text-3xl font-bold text-black">Masterpiece!</h1>
        <div className="flex w-100 flex-col border-4 border-black shadow-2xl">
          {headDrawing && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={headDrawing.data}
              className="h-75 w-full bg-white object-contain"
              alt="head"
            />
          )}
          {bodyDrawing && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bodyDrawing.data}
              className="h-75 w-full bg-white object-contain"
              alt="body"
            />
          )}
          {legsDrawing && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={legsDrawing.data}
              className="h-75 w-full bg-white object-contain"
              alt="legs"
            />
          )}
        </div>
        <button
          onClick={() => router.push("/rooms")}
          className="mt-8 rounded bg-gray-800 px-6 py-2 text-white transition hover:bg-black"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 py-8 text-black">
      <h1 className="mb-4 text-2xl font-bold">Room: {room.id}</h1>
      <div className="mb-8 flex gap-4">
        <StatusBadge
          label="HEAD"
          isActive={!!headDrawing}
          isMe={userRole === "HEAD"}
        />
        <StatusBadge
          label="BODY"
          isActive={!!bodyDrawing}
          isMe={userRole === "BODY"}
        />
        <StatusBadge
          label="LEGS"
          isActive={!!legsDrawing}
          isMe={userRole === "LEGS"}
        />
      </div>

      <p className="mb-4 text-gray-700">
        You are:{" "}
        <span className="text-xl font-bold">{userRole ?? "Spectator"}</span>
      </p>

      {myDrawing ? (
        <div className="rounded border border-green-200 bg-green-100 p-8 text-green-800">
          Wait for others to finish...
        </div>
      ) : userRole === "HEAD" ||
        (userRole === "BODY" && headDrawing) ||
        (userRole === "LEGS" && bodyDrawing) ? (
        <div className="animate-fade-in">
          <DrawingCanvas onSubmit={onDrawSubmit} guideImage={guideImage} />
        </div>
      ) : (
        <div className="max-w-md rounded border border-yellow-200 bg-yellow-100 p-8 text-center text-yellow-800">
          {userRole
            ? "Waiting for the previous part to finish..."
            : "Room is full."}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  label,
  isActive,
  isMe,
}: {
  label: string;
  isActive: boolean;
  isMe: boolean;
}) {
  return (
    <div
      className={`rounded-lg border-2 px-4 py-2 font-mono transition-all ${
        isActive
          ? "border-emerald-600 bg-emerald-500 text-white"
          : "border-gray-300 bg-gray-200 text-gray-500"
      } ${isMe ? "scale-110 ring-4 ring-blue-400" : ""}`}
    >
      {label}
    </div>
  );
}

export default function GameRoom({
  roomId,
  initialRoom,
  userId,
  userRole,
}: {
  roomId: string;
  initialRoom: RoomData;
  userId: string;
  userRole?: "HEAD" | "BODY" | "LEGS" | null;
}) {
  const [client] = useState(() => new Ably.Realtime({ authUrl: "/api/ably" }));

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={`room-${roomId}`}>
        <GameBoard
          room={initialRoom}
          _userId={userId}
          userRole={userRole}
          roomId={roomId}
        />
      </ChannelProvider>
    </AblyProvider>
  );
}
