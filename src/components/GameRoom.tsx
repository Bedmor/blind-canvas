"use client";

import { useEffect, useState } from "react";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider, useChannel } from 'ably/react';
import DrawingCanvas from "./DrawingCanvas";
import { saveDrawing } from "~/app/actions";
import { useRouter } from "next/navigation";

// Define simpler types to avoid Prisma import issues on client
type Room = any; 

// Inner component to use hooks
function GameBoard({ 
    room, 
    userId, 
    userRole,
    roomId
}: { 
    room: Room, 
    userId: string, 
    userRole?: "HEAD" | "BODY" | "LEGS" | null,
    roomId: string
}) {
    const router = useRouter();

    useChannel(`room-${roomId}`, (message) => {
        console.log("Room update", message);
        router.refresh();
    });

    const myDrawing = room.drawings.find((d: any) => d.part === userRole);
    const headDrawing = room.drawings.find((d: any) => d.part === "HEAD");
    const bodyDrawing = room.drawings.find((d: any) => d.part === "BODY");
    const legsDrawing = room.drawings.find((d: any) => d.part === "LEGS");

    const onDrawSubmit = async (data: string) => {
        if (!userRole) return;
        await saveDrawing(roomId, data, userRole);
    };

    let guideImage = null;
    if (userRole === "BODY" && headDrawing) {
        guideImage = headDrawing.data;
    } else if (userRole === "LEGS" && bodyDrawing) {
        guideImage = bodyDrawing.data;
    }

    if (room.status === "COMPLETED") {
        return (
             <div className="flex flex-col items-center gap-2 p-8 bg-white min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-black">Masterpiece!</h1>
                <div className="flex flex-col w-[400px] border-4 border-black shadow-2xl">
                    {headDrawing && <img src={headDrawing.data} className="w-full h-[300px] object-contain bg-white" alt="head" />}
                    {bodyDrawing && <img src={bodyDrawing.data} className="w-full h-[300px] object-contain bg-white" alt="body" />}
                    {legsDrawing && <img src={legsDrawing.data} className="w-full h-[300px] object-contain bg-white" alt="legs" />}
                </div>
                <button 
                    onClick={() => router.push('/rooms')} 
                    className="mt-8 px-6 py-2 bg-gray-800 text-white rounded hover:bg-black transition"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 text-black">
            <h1 className="text-2xl font-bold mb-4">Code: {room.code}</h1>
             <div className="flex gap-4 mb-8">
                <StatusBadge label="HEAD" isActive={!!headDrawing} isMe={userRole === "HEAD"} />
                <StatusBadge label="BODY" isActive={!!bodyDrawing} isMe={userRole === "BODY"} />
                <StatusBadge label="LEGS" isActive={!!legsDrawing} isMe={userRole === "LEGS"} />
            </div>
            
            <p className="mb-4 text-gray-700">
                You are: <span className="font-bold text-xl">{userRole || "Spectator"}</span>
            </p>

            {myDrawing ? (
                 <div className="p-8 bg-green-100 rounded text-green-800 border border-green-200">
                     Wait for others to finish...
                 </div>
            ) : (
                (userRole === "HEAD" || 
                 (userRole === "BODY" && headDrawing) || 
                 (userRole === "LEGS" && bodyDrawing)) ? (
                    <div className="animate-fade-in">
                        <DrawingCanvas onSubmit={onDrawSubmit} guideImage={guideImage} />
                    </div>
                ) : (
                    <div className="p-8 bg-yellow-100 rounded text-yellow-800 border border-yellow-200 max-w-md text-center">
                       {userRole ? "Waiting for the previous part to finish..." : "Room is full."}
                    </div>
                )
            )}
        </div>
    );
}

function StatusBadge({ label, isActive, isMe }: { label: string, isActive: boolean, isMe: boolean }) {
    return (
        <div className={`px-4 py-2 rounded-lg border-2 font-mono transition-all ${
            isActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-gray-200 text-gray-500 border-gray-300'
        } ${isMe ? 'ring-4 ring-blue-400 scale-110' : ''}`}>
            {label}
        </div>
    );
}

export default function GameRoom({ 
    roomId, 
    initialRoom, 
    userId, 
    userRole 
}: { 
    roomId: string, 
    initialRoom: Room, 
    userId: string, 
    userRole?: "HEAD" | "BODY" | "LEGS" | null
}) {
    const [client] = useState(() => new Ably.Realtime({ authUrl: '/api/ably' }));

    return (
        <AblyProvider client={client}>
            <ChannelProvider channelName={`room-${roomId}`}>
                <GameBoard 
                    room={initialRoom} 
                    userId={userId} 
                    userRole={userRole} 
                    roomId={roomId}
                />
            </ChannelProvider>
        </AblyProvider>
    );
}
