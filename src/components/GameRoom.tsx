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
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="animate-fade-in-up max-w-lg text-center">
          <h1 className="mb-2 bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Şaheser Tamamlandı
          </h1>
          <p className="mb-8 text-sm text-gray-500">
            Ortak yaratığınız ortaya çıktı
          </p>
          <div className="glass-card glow-emerald overflow-hidden rounded-2xl border border-white/10">
            <div className="flex flex-col">
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
          </div>
          <button
            onClick={() => router.push("/rooms")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 font-medium text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
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
            Odalar&apos;a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-lg font-semibold text-gray-300">
          Çizim Odası
        </h1>
        <p className="font-mono text-xs text-gray-600">{room.id}</p>
      </div>

      <div className="mb-8 flex gap-3">
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

      <p className="mb-6 text-sm text-gray-500">
        Rolün:{" "}
        <span className="font-bold text-white">{userRole ?? "İzleyici"}</span>
      </p>

      {myDrawing ? (
        <div className="glass-card animate-fade-in rounded-xl border border-emerald-500/20 px-8 py-6 text-center text-emerald-400">
          <svg
            className="animate-pulse-soft mx-auto mb-3 h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium">Çizimin gönderildi</p>
          <p className="mt-1 text-xs text-gray-500">
            Diğerlerinin bitirmesi bekleniyor...
          </p>
        </div>
      ) : userRole === "HEAD" ||
        (userRole === "BODY" && headDrawing) ||
        (userRole === "LEGS" && bodyDrawing) ? (
        <div className="animate-fade-in">
          <DrawingCanvas onSubmit={onDrawSubmit} guideImage={guideImage} />
        </div>
      ) : (
        <div className="glass-card max-w-md rounded-xl border border-amber-500/20 px-8 py-6 text-center text-amber-400">
          <svg
            className="animate-pulse-soft mx-auto mb-3 h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium">
            {userRole ? "Önceki sanatçı bekleniyor..." : "Oda dolu"}
          </p>
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
  const labelMap: Record<string, string> = {
    HEAD: "BAŞ",
    BODY: "GÖVDE",
    LEGS: "BACAKLAR",
  };

  return (
    <div
      className={`rounded-lg px-4 py-2 font-mono text-sm font-medium tracking-wide transition-all ${
        isActive
          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
          : "bg-white/5 text-gray-600 ring-1 ring-white/10"
      } ${isMe ? "scale-110 ring-2 ring-cyan-400/50" : ""}`}
    >
      {labelMap[label] ?? label}
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
