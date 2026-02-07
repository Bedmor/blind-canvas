"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";

export default function DrawingCanvas({
  onSubmit,
  guideImage,
  width = 400,
  height = 300,
}: {
  onSubmit: (data: string) => void | Promise<void>;
  guideImage?: string | null;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#000";
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clientY = "touches" in e ? (e.touches[0]?.clientY ?? 0) : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setIsDrawing(true);
      const { x, y } = getPos(e);
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.beginPath();
      ctx?.moveTo(x, y);
    },
    [getPos],
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.lineTo(x, y);
      ctx?.stroke();
    },
    [isDrawing, getPos],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsSubmitting(true);

    // Use JPEG at 0.7 quality — typically 5-10x smaller than PNG
    const data = canvas.toDataURL("image/jpeg", 0.7);
    try {
      await onSubmit(data);
    } catch {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSubmit]);

  return (
    <div className="flex flex-col items-center gap-5">
      {guideImage && (
        <div className="relative flex w-full justify-center border-b-2 border-dashed border-rose-400/50 opacity-70">
          <div
            style={{
              width: width,
              height: 40,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={guideImage}
              alt="Guide"
              style={{
                width: width,
                height: height,
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
            />
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl ring-1 shadow-black/20 ring-black/10">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block cursor-crosshair touch-none"
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
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Done
          </>
        )}
      </button>
    </div>
  );
}
