// components/AudioLoader.tsx
"use client";

import { Disc3 } from "lucide-react";

interface AudioLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export default function AudioLoader({
  label = "Loading soundscape...",
  fullScreen = false,
}: AudioLoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Vinyl Spinner + Pulsing Glow */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
        <Disc3
          className="w-12 h-12 text-indigo-400 animate-spin"
          style={{ animationDuration: "3s" }}
        />
      </div>

      {/* Animated Soundwave Bars */}
      <div className="flex items-end justify-center space-x-1.5 h-6">
        <span className="w-1 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
        <span className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite_300ms] h-2/3" />
        <span className="w-1 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms] h-5/6" />
        <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms] h-1/2" />
      </div>

      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 animate-pulse">
        {label}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
