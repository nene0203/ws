import React, { useEffect, useRef } from "react";
import { PostState } from "../types";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ShieldCheck } from "lucide-react";
import { drawPostOnCanvas } from "../lib/canvasRenderer";

interface IPhonePreviewProps {
  post: PostState;
  textStyles: {
    fontFamily: string;
    fontSize: number;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    color: string;
    hasShadow: boolean;
    hasGradient: boolean;
    align: "left" | "center" | "right";
    isSubtituloEnabled: boolean;
    lineHeight: number;
    posYPercent?: number;
  };
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  onDragY?: (newYPercent: number) => void;
  isDragEnabled?: boolean;
}

export default function IPhonePreview({ 
  post, 
  textStyles, 
  canvasRef,
  onDragY,
  isDragEnabled = true
}: IPhonePreviewProps) {
  const localRef = useRef<HTMLCanvasElement>(null);
  const activeCanvasRef = canvasRef || localRef;

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isDragEnabled || !onDragY || !containerRef.current) return;
    isDragging.current = true;
    updatePosition(clientY);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    updatePosition(clientY);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const updatePosition = (clientY: number) => {
    if (!containerRef.current || !onDragY) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percent = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
    onDragY(Number(percent.toFixed(1)));
  };

  // Render on mount and state modifications
  useEffect(() => {
    const canvas = activeCanvasRef.current;
    if (canvas) {
      drawPostOnCanvas(canvas, post, textStyles, () => {
        // Redraw on complete image fetch inside cache
        if (activeCanvasRef.current) {
          drawPostOnCanvas(activeCanvasRef.current, post, textStyles, () => {});
        }
      });
    }
  }, [post, textStyles, activeCanvasRef]);

  const isStories = post.pubType === "1080x1920";

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Real-time Status Indicators */}
      <div className="w-full max-w-[280px] bg-indigo-50 border border-indigo-100 rounded-xl p-2.5 mb-2.5 flex flex-col gap-1 text-[11px] text-indigo-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span><b>Preview real-time</b></span>
          </div>
          <span className="text-[9px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded-full font-bold">Ativo</span>
        </div>
        <span className="text-[10px] text-indigo-700 leading-tight">💡 O visual exibido abaixo é renderizado via Canvas de alta qualidade.</span>
      </div>

      {/* iPhone Frame Container */}
      <div className="relative w-[280px] h-[560px] bg-slate-950 rounded-[38px] shadow-2xl border-[9px] border-slate-900 ring-4 ring-slate-800/10 flex flex-col overflow-hidden">
        {/* Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5.5 bg-black rounded-3xl z-40 flex items-center justify-between px-3">
          <div className="w-2 h-2 rounded-full bg-slate-900" />
          <div className="w-3 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* Custom iOS Status Bar */}
        <div className="h-8 bg-black flex justify-between items-end px-5 pb-1 text-[9.5px] text-white font-medium z-30">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16"><path d="M2 11.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" /></svg>
            <span className="text-[8px]">5G</span>
            <div className="w-3.5 h-1.5 border border-white rounded-sm p-0.5 flex items-center"><div className="w-2 h-full bg-white rounded-2xs" /></div>
          </div>
        </div>

        {/* IG App Area */}
        <div className="flex-1 bg-black text-white flex flex-col relative overflow-hidden">
          
          {/* Header Row */}
          {!isStories ? (
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-900 bg-black shrink-0">
              <div className="flex items-center gap-2">
                <img 
                  className="w-8 h-8 rounded-full border border-pink-500 p-0.5 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Carlos Mendes"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold flex items-center gap-1 text-slate-100">
                    carlos.mendes.jornalista
                    <span className="inline-block w-3 h-3 text-sky-400 bg-sky-400/10 rounded-full flex items-center justify-center text-[8px] p-[2px]">✓</span>
                  </span>
                  <span className="text-[9px] text-slate-400">São Paulo, SP</span>
                </div>
              </div>
              <MoreHorizontal size={16} className="text-slate-400 cursor-pointer" />
            </div>
          ) : (
            /* Stories Header Overlay */
            <div className="absolute top-2 left-0 right-0 px-3 py-2 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent z-20">
              <div className="flex items-center gap-2">
                <img 
                  className="w-8 h-8 rounded-full border-2 border-slate-300 p-0.5 object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Carlos Mendes"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100">carlos.mendes.jornalista</span>
                  <span className="text-[9px] text-slate-300">Redação Premium · 1h</span>
                </div>
              </div>
              <div className="flex gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <MoreHorizontal size={16} className="text-white" />
              </div>
            </div>
          )}

          {/* Core Post Display (Feed or Stories height) */}
          {isStories ? (
            /* STORIES FULL VIEW */
            <div 
              ref={containerRef}
              onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => {
                if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handleEnd}
              className={`flex-1 relative flex flex-col justify-between overflow-hidden ${isDragEnabled && onDragY ? "cursor-ns-resize" : ""}`}
            >
              <div className="absolute inset-0 bg-slate-950 flex items-center justify-center pointer-events-none">
                <canvas 
                  ref={activeCanvasRef} 
                  className="w-full h-full object-contain pointer-events-none" 
                  style={{ aspectRatio: "1080/1920" }}
                />
              </div>
            </div>
          ) : (
            /* FEED CROP VIEW (1:1 Ratio or 1080x1440 portrait + Feed Footer UI) */
            <div className="flex-1 h-0 flex flex-col bg-black overflow-y-auto select-text custom-scrollbar">
              
              {/* Creative Cover Image Container with dynamic proportions */}
              <div 
                ref={containerRef}
                onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => {
                  if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={(e) => {
                  if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={handleEnd}
                className={`relative w-full bg-slate-900 border-y border-slate-950 flex flex-col items-center justify-center overflow-hidden shrink-0 transition-all duration-300 ${isDragEnabled && onDragY ? "cursor-ns-resize" : ""}`}
                style={{ 
                  aspectRatio: post.pubType === "1080x1440" ? "3/4" : "1/1"
                }}
              >
                <canvas 
                  ref={activeCanvasRef} 
                  className="w-full h-full object-cover pointer-events-none" 
                />
              </div>

              {/* Feed Actions Bar */}
              <div className="px-3 py-2.5 flex items-center justify-between bg-black shrink-0">
                <div className="flex items-center gap-4">
                  <Heart size={19} className="hover:scale-115 text-slate-200 hover:text-red-500 transition-all cursor-pointer" />
                  <MessageCircle size={19} className="hover:scale-115 text-slate-200 transition-all cursor-pointer" />
                  <Send size={19} className="hover:scale-115 text-slate-200 transition-all cursor-pointer" />
                </div>
                <Bookmark size={19} className="hover:scale-115 text-slate-200 transition-all cursor-pointer" />
              </div>

              {/* Likes Area */}
              <div className="px-3 py-0.5 text-xs font-semibold text-slate-200 bg-black shrink-0">
                Curtido por economia.blog e outras 324 pessoas
              </div>

              {/* Real-time styled caption space */}
              <div className="px-3 pt-1.5 pb-28 text-[11px] leading-relaxed text-slate-300 bg-black shrink-0">
                <span className="font-semibold text-slate-100 mr-1.5">carlos.mendes.jornalista</span>
                <span className="whitespace-pre-wrap">{post.legenda || "Legenda gerada pela inteligência artificial aparecerá aqui."}</span>
                <div className="mt-1.5 text-[9px] text-slate-500 uppercase tracking-wide">
                  Há 1 minuto • <span className="text-indigo-400 hover:underline cursor-pointer">Ver tradução</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Home Indicator Line */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full z-45" />

      </div>
    </div>
  );
}
