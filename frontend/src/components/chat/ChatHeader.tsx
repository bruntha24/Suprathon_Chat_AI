"use client";

import {
  Maximize2,
  Minimize2,
  X,
  Volume2,
  VolumeX,
  Bot as BotIcon,
} from "lucide-react";

interface ChatHeaderProps {
  isMaximized: boolean;
  setIsMaximized: (val: boolean) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  onClose: () => void;
}

const ChatHeader = ({
  isMaximized,
  setIsMaximized,
  isSoundEnabled,
  toggleSound,
  onClose,
}: ChatHeaderProps) => {
  return (
    <div className="relative flex items-center justify-between px-5 py-4 
      bg-gradient-to-b from-[#0f172a]/90 to-[#020617]/90 
      backdrop-blur-xl 
      rounded-t-[28px] overflow-hidden">

      {/* 🔥 SOFT BORDER SYSTEM */}

      {/* Outer subtle border */}
      <div className="absolute inset-0 rounded-t-[28px] border border-white/5 pointer-events-none" />

      {/* Inner soft highlight (top light) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Bottom soft separator */}
      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* LEFT SECTION */}
      <div className="flex items-center gap-3 z-10">

        {/* Avatar */}
        <div className="relative">

          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md scale-125" />

          {/* Back bubble */}
          <div className="absolute -left-1 -bottom-1 h-7 w-7 rounded-full bg-blue-400/20 blur-sm" />

          {/* Main */}
          <div className="relative h-10 w-10 rounded-full 
            bg-gradient-to-br from-[#111827] to-[#1f2937] 
            flex items-center justify-center 
            shadow-[0_6px_20px_rgba(0,0,0,0.4)] 
            border border-white/10">

            {/* Highlight */}
            <div className="absolute top-1 left-2 w-4 h-1.5 bg-white/10 rounded-full blur-[1px]" />

            <BotIcon size={18} className="text-blue-300" />

            {/* Badge */}
            <div className="absolute -top-1 -right-1 h-5 w-5 
              bg-blue-500 text-white text-[10px] font-semibold 
              flex items-center justify-center rounded-full 
              border border-[#020617] shadow-md">
              1
            </div>
          </div>
        </div>

        {/* TEXT */}
       {/* TEXT */}
<div className="flex flex-col leading-tight">
  <h3 className="text-sm font-semibold text-white tracking-wide">
    Suprathon Ai
  </h3>

  <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
    Helping you navigate Suprathon
  </p>

  <div className="flex items-center gap-1 mt-1">
    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
    <p className="text-[10px] text-slate-500 font-medium">
      Online
    </p>
  </div>
</div>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-2 z-10">

        {/* Maximize */}
        <button
          onClick={() => setIsMaximized(!isMaximized)}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] 
          transition-all text-slate-400 hover:text-white shadow-inner backdrop-blur-md"
        >
          {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Sound */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] 
          transition-all text-slate-400 hover:text-white shadow-inner backdrop-blur-md"
        >
          {isSoundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl 
          bg-gradient-to-br from-slate-700 to-slate-900 
          text-white hover:from-blue-500 hover:to-blue-700 
          transition-all active:scale-95 shadow-lg"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;