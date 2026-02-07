"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import Ably from "ably";
import { env } from "~/env";

export async function createRoom() {
  const session = await auth();
  if (!session?.user) throw new Error("Must be logged in");

  const room = await db.room.create({
    data: {
      code: nanoid(6).toUpperCase(),
      status: "WAITING",
      participants: {
        create: {
          userId: session.user.id,
          assignedPart: "HEAD", // Creator is Head by default
        },
      },
    },
  });

  redirect(`/rooms/${room.id}`);
}

export async function joinRoom(roomId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Login required" };

  const room = await db.room.findUnique({
      where: { id: roomId },
      include: { participants: true }
  });

  if (!room) return { error: "Room not found" };

  const existing = room.participants.find(p => p.userId === session.user.id);
  if (existing) return { success: true };

  if (room.participants.length >= 3) return { error: "Room full" };

  // Assign next available part
  const takenParts = new Set(room.participants.map(p => p.assignedPart));
  let role: "HEAD" | "BODY" | "LEGS" | null = null;
  
  if (!takenParts.has("HEAD")) role = "HEAD";
  else if (!takenParts.has("BODY")) role = "BODY";
  else if (!takenParts.has("LEGS")) role = "LEGS";

  await db.participant.create({
    data: {
      userId: session.user.id,
      roomId,
      assignedPart: role
    }
  });
  
  const updatedParticipantsCount = room.participants.length + 1;
  if (updatedParticipantsCount === 3) {
      await db.room.update({
          where: { id: roomId },
          data: { status: "IN_PROGRESS" }
      });
  }

  const client = new Ably.Rest(env.ABLY_API_KEY);
  const channel = client.channels.get(`room-${roomId}`);
  await channel.publish("room-update", { roomId });

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

export async function saveDrawing(roomId: string, data: string, part: "HEAD" | "BODY" | "LEGS") {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    
    const participant = await db.participant.findUnique({
        where: {
            userId_roomId: {
               userId: session.user.id,
               roomId
            }
        }
    });

    if(!participant || participant.assignedPart !== part) return { error: "Invalid role" };

    await db.drawing.create({
        data: {
            roomId,
            participantId: participant.id,
            part,
            data
        }
    });

    const drawings = await db.drawing.findMany({ where: { roomId } });
    const partsDone = new Set(drawings.map(d => d.part));
    
    if (partsDone.has("HEAD") && partsDone.has("BODY") && partsDone.has("LEGS")) {
        await db.room.update({
            where: { id: roomId },
            data: { status: "COMPLETED" }
        });
    }

    const client = new Ably.Rest(env.ABLY_API_KEY);
    const channel = client.channels.get(`room-${roomId}`);
    await channel.publish("room-update", { roomId });
    
    revalidatePath(`/rooms/${roomId}`);
    return { success: true };
}
