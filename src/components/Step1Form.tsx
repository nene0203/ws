import React from "react";
import { Link2, Sparkles, Image as ImageIcon, RotateCcw, HelpCircle, ChevronDown, Zap, BarChart3, Scale, ChevronRight } from "lucide-react";
import { PostState, JournalisticTone, ImageQuality, PublicationType } from "../types";
import { supabase } from "../lib/supabase";

interface Step1FormProps {
  newsUrl: string;
  setNewsUrl: (val: string) => void;
  post: PostState;
  setPost: React.Dispatch<React.SetStateAction<PostState>>;
  textStyles: any;
  isGeneratingText: boolean;
  isGeneratingImg: boolean;
  generatePostText: () => void;
  generatePostImg: () => void;
  handleClear: () => void;
  addActivity: (title: string, desc: string, type: any) => void;
  setStatusMessage: (msg: any) => void;
  setStep: (val: number) => void;
  postId: string;
}

export default function Step1Form({
  newsUrl,
  setNewsUrl,
  post,
  setPost,
  textStyles,
  isGeneratingText,
  isGeneratingImg,
  generatePostText,
  generatePostImg,
  handleClear,
  addActivity,
  setStatusMessage,
  setStep,
  postId
}: Step1FormProps) {
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsUrl(e.target.value);
  };

  const handleNextStep = async () => {
    try {
      await supabase.from("posts").upsert({
        id: postId,
        user_id: "user_carlos_mendes",
        current_step: 2,
        news_url: newsUrl,
        manchete: post.manchete,
        subtitulo: post.subtitulo,
        legenda: post.legenda,
        image_url: post.imageUrl,
        pub_type: post.pubType,
        tone: post.tone,
        quality: post.quality,
        text_styles: textStyles,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Erro ao salvar etapa no Supabase:", err);
    }
    setStep(2);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 text-slate-800">
      
      {/* Header Description */}
      <div className="flex flex-col items-start gap-1">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950">Etapa 1 — Criar postagem</h2>
        <p className="text-xs text-slate-500">Cole o link da notícia para formatar posts prontos com IA ou escolha de nossa lista rápida.</p>
      </div>

      {/* COHESIVE MAIN CARD FOR IA CREATION FLOW */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5 text-left">
        
        {/* 1. Campo de LINK da notícia ou conteúdo de origem */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Link2 size={14} className="text-indigo-600" />
            <span>Link da notícia ou conteúdo de origem</span>
          </div>
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={newsUrl}
              onChange={handleUrlChange}
              placeholder="https://exemplo.com.br/sua-noticia-aqui"
              className="w-full pr-10 pl-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-xs font-medium text-slate-800 transition-all outline-none"
            />
            {newsUrl && (
              <button 
                type="button"
                onClick={() => setNewsUrl("")} 
                className="absolute right-3 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
                title="Limpar link"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2. Opções e Controles (Tom, Qualidade, Formato) diretamente abaixo do Link */}
        <div className="border border-slate-200 bg-slate-50/50 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center divide-y md:divide-y-0 md:divide-x divide-slate-200 p-0.5">
          
          {/* Column 1: Tom Jornalistico Selector */}
          <div className="md:col-span-6 p-3 flex flex-col gap-2 text-left h-full justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none">
              <span>Tom jornalístico</span>
              <HelpCircle size={12} className="text-slate-400 cursor-help" />
            </div>
            
            <div className="flex flex-row flex-wrap sm:flex-nowrap gap-1 w-full">
              {[
                { val: "Informativo", label: "Informativo" },
                { val: "Urgente", label: "Urgente", icon: <Zap size={10} /> },
                { val: "Analítico", label: "Analítico", icon: <BarChart3 size={10} /> },
                { val: "Neutro", label: "Neutro", icon: <Scale size={10} /> }
              ].map((item) => {
                const active = post.tone === item.val;
                return (
                  <button
                    type="button"
                    key={item.val}
                    onClick={() => {
                      setPost(prev => ({ ...prev, tone: item.val as JournalisticTone }));
                      addActivity("Tom alterado", `Tom jornalístico alterado para ${item.val}.`, "info");
                    }}
                    className={`flex items-center justify-center gap-1 px-2.5 py-1.5 text-[10.5px] rounded-lg font-bold transition-all border shrink-0 ${
                      active 
                        ? "bg-blue-50 border-blue-600/60 text-blue-700 font-extrabold shadow-3xs" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {item.val === "Informativo" ? (
                      <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${active ? "border-blue-500" : "border-slate-300"}`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      </div>
                    ) : (
                      <span className={active ? "text-blue-500" : "text-slate-400"}>
                        {item.icon}
                      </span>
                    )}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Qualidade da imagem */}
          <div className="md:col-span-3 p-3 flex flex-col gap-2 text-left h-full justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none">
              <span>Qualidade da imagem</span>
              <HelpCircle size={12} className="text-slate-400 cursor-help" />
            </div>
            <div className="relative">
              <select 
                value={post.quality}
                onChange={(e) => {
                  setPost(prev => ({ ...prev, quality: e.target.value as ImageQuality }));
                  addActivity("Qualidade alterada", `Qualidade de renderização alterada para ${e.target.value}.`, "info");
                }}
                className="w-full bg-white border border-slate-200 text-[10.5px] font-bold text-slate-700 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer hover:border-slate-300 transition-colors appearance-none pr-8 shadow-3xs text-left"
              >
                <option value="1080p">1080p (Full HD)</option>
                <option value="4K">4K (Ultra HD)</option>
                <option value="720p">720p (Padrão)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>

          {/* Column 3: Formato de publicação */}
          <div className="md:col-span-3 p-3 flex flex-col gap-2 text-left h-full justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none">
              <span>Formato de publicação</span>
              <HelpCircle size={12} className="text-slate-400 cursor-help" />
            </div>
            <div className="relative select-none">
              <select 
                value={post.pubType}
                onChange={(e) => {
                  const val = e.target.value as PublicationType;
                  setPost(prev => ({ ...prev, pubType: val }));
                  addActivity("Formato alterado", `Formato de publicação alterado para ${val}.`, "info");
                }}
                className="w-full bg-white border border-slate-200 text-[10.5px] font-bold text-slate-700 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer hover:border-slate-300 transition-colors appearance-none pr-8 shadow-3xs text-left"
              >
                <option value="1:1">Quadrado — 1:1</option>
                <option value="1080x1440">Retrato — 1080x1440</option>
                <option value="1080x1920">Stories/Reels — 1080x1920</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Botões de ação principais colocados após as opções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            type="button"
            onClick={generatePostText}
            disabled={isGeneratingText || !newsUrl.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 text-xs shadow-sm cursor-pointer"
          >
            <Sparkles size={14} className={isGeneratingText ? "animate-spin" : ""} />
            {isGeneratingText ? "Gerando textos com IA..." : "Gerar manchete e legenda"}
          </button>
          <button 
            type="button"
            onClick={generatePostImg}
            disabled={isGeneratingImg || !post.manchete}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 text-xs shadow-sm cursor-pointer"
          >
            <ImageIcon size={14} className={isGeneratingImg ? "animate-pulse" : ""} />
            {isGeneratingImg ? "Gerando imagem..." : "Gerar imagem com IA"}
          </button>
          <button 
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-750 font-semibold py-3 text-xs cursor-pointer"
          >
            <RotateCcw size={14} />
            Limpar informações
          </button>
        </div>

        {/* 4. Barra de status / sincronização */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-100 pt-1.5">
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 text-emerald-855 rounded-xl px-3.5 py-2.5 shadow-3xs">
            <div className="flex items-center gap-2 text-[10.5px] font-bold text-emerald-800">
              <span className="text-emerald-555 font-extrabold font-mono text-xs">✓</span>
              <span>Manchete e legenda geradas</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 text-emerald-855 rounded-xl px-3.5 py-2.5 shadow-3xs">
            <div className="flex items-center gap-2 text-[10.5px] font-bold text-emerald-800">
              <span className="text-emerald-555 font-extrabold font-mono text-xs">✓</span>
              <span>Imagem gerada em 1080p</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 text-indigo-855 rounded-xl px-3.5 py-2.5 shadow-3xs">
            <div className="flex items-center gap-2 text-[10.5px] font-bold text-indigo-700">
              <span className="text-indigo-555 font-extrabold font-mono text-[10px]">ℹ</span>
              <span>Sincronizado Supabase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer next step button */}
      <div className="flex justify-end pt-4 border-t border-slate-200 mt-2">
        <button
          type="button"
          onClick={handleNextStep}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
        >
          <span>Próximo Passo</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
