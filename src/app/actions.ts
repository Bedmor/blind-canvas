/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ablyRest } from "~/server/ably";

export async function createRoom() {
  const session = await auth();
  if (!session?.user) throw new Error("Must be logged in");

  const room = await db.room.create({
    data: {
      status: "WAITING",
      participants: {
        create: {
          userId: session.user.id,
          assignedPart: "HEAD",
        },
      },
    },
    select: { id: true },
  });

  redirect(`/rooms/${room.id}`);
}

export async function joinRoom(roomId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Login required" };

  const room = await db.room.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      status: true,
      participants: {
        select: { userId: true, assignedPart: true },
      },
    },
  });

  if (!room) return { error: "Room not found" };

  const existing = room.participants.find((p) => p.userId === session.user.id);
  if (existing) return { success: true };

  if (room.participants.length >= 3) return { error: "Room full" };

  // Assign next available part
  const takenParts = new Set(room.participants.map((p) => p.assignedPart));
  let role: "HEAD" | "BODY" | "LEGS" | null = null;

  if (!takenParts.has("HEAD")) role = "HEAD";
  else if (!takenParts.has("BODY")) role = "BODY";
  else if (!takenParts.has("LEGS")) role = "LEGS";

  const updatedParticipantsCount = room.participants.length + 1;

  // Run participant creation and (conditional) room status update in parallel
  const dbOps: Promise<unknown>[] = [
    db.participant.create({
      data: {
        userId: session.user.id,
        roomId,
        assignedPart: role,
      },
    }),
  ];

  if (updatedParticipantsCount === 3) {
    dbOps.push(
      db.room.update({
        where: { id: roomId },
        data: { status: "IN_PROGRESS" },
      }),
    );
  }

  // Run DB writes + Ably publish + revalidate concurrently
  await Promise.all([
    ...dbOps,
    ablyRest.channels.get(`room-${roomId}`).publish("room-update", { roomId }),
  ]);

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

export async function saveDrawing(
  roomId: string,
  data: string,
  part: "HEAD" | "BODY" | "LEGS",
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const participant = await db.participant.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
    select: { id: true, assignedPart: true },
  });

  if (participant?.assignedPart !== part) return { error: "Invalid role" };

  // Save drawing and count existing drawings in a single transaction
  const [, drawingCount] = await db.$transaction([
    db.drawing.create({
      data: {
        roomId,
        participantId: participant.id,
        part,
        data,
      },
    }),
    db.drawing.count({ where: { roomId } }),
  ]);

  // All 3 parts done? (count includes the one we just created)
  const statusUpdate =
    drawingCount >= 3
      ? db.room.update({
          where: { id: roomId },
          data: { status: "COMPLETED" },
        })
      : Promise.resolve();

  // Run status update + Ably publish concurrently
  await Promise.all([
    statusUpdate,
    ablyRest.channels.get(`room-${roomId}`).publish("room-update", { roomId }),
  ]);

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}
