"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function DrawingCanvas({ 
    onSubmit, 
    guideImage, 
    width = 400,
    height = 300 // Increased height for better drawing area
}: { 
    onSubmit: (data: string) => void,
    guideImage?: string | null,
    width?: number,
    height?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000';
    }, []);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const { x, y } = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
        ctx?.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.lineTo(x, y);
        ctx?.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const data = canvas.toDataURL("image/png");
        onSubmit(data);
    };

    return (
        <div className="flex flex-col items-center gap-4">
             {guideImage && (
                <div className="relative border-b-2 border-dashed border-red-400 opacity-70 w-full flex justify-center">
                    <div style={{
                        width: width,
                        height: 40,
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <img 
                            src={guideImage} 
                            alt="Guide"
                            style={{
                                width: width,
                                height: height,
                                position: 'absolute',
                                bottom: 0, 
                                left: 0,
                            }}
                        />
                    </div>
                </div>
            )}
            
            <div className="relative shadow-lg border-2 border-gray-300 bg-white">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    className="cursor-crosshair touch-none block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>

            <button 
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition font-bold"
            >
                Bitirdim (Done)
            </button>
        </div>
    );
}
