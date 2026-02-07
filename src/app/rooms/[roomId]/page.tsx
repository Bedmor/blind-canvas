/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any */
// src/app/rooms/[roomId]/page.tsx
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { joinRoom } from "~/app/actions";
import GameRoom from "~/components/GameRoom";
import { notFound, redirect } from "next/navigation";

export default async function Page(props: any) {
  const { params } = props;
  const roomId = String(params?.roomId);
  const session = await auth();
  if (!session?.user) redirect("/");

  // Run joinRoom and room data fetch concurrently
  const [, roomWithUsers] = await Promise.all([
    joinRoom(roomId),
    db.room.findUnique({
      where: { id: roomId },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        drawings: {
          select: {
            id: true,
            part: true,
            data: true,
            roomId: true,
            participantId: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  if (!roomWithUsers) notFound();

  const myParticipant = roomWithUsers.participants.find(
    (p) => p.userId === session.user.id,
  );

  return (
    <GameRoom
      roomId={roomId}
      initialRoom={roomWithUsers}
      userId={session.user.id}
      userRole={myParticipant?.assignedPart}
    />
  );
}
