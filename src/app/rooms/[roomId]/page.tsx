// src/app/rooms/[roomId]/page.tsx
import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { joinRoom } from "~/app/actions";
import GameRoom from "~/components/GameRoom";
import { notFound, redirect } from "next/navigation";

export default async function Page({ params }: { params: { roomId: string } }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  // Await params for Next.js 15+
  // If it's still treated as prompt but usually Next 15 requires async params access
  const roomId = (await params).roomId;

  await joinRoom(roomId);

  const roomWithUsers = await db.room.findUnique({
    where: { id: roomId },
    include: {
      participants: { include: { user: true } },
      drawings: true,
    },
  });

  if (!roomWithUsers) notFound();

  const myParticipant = roomWithUsers.participants.find(
    (p: any) => p.userId === session.user.id,
  );

  // Pass pure data
  return (
    <GameRoom
      roomId={roomId}
      initialRoom={roomWithUsers}
      userId={session.user.id}
      userRole={myParticipant?.assignedPart}
    />
  );
}
