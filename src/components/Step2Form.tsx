import React from "react";
import { 
  ChevronDown, Bold, Italic, Underline, Layers, Sparkles, 
  AlignLeft, AlignCenter, AlignRight, ChevronRight 
} from "lucide-react";
import { PostState } from "../types";
import { supabase } from "../lib/supabase";

interface Step2FormProps {
  post: PostState;
  setPost: React.Dispatch<React.SetStateAction<PostState>>;
  textStyles: any;
  setTextStyles: React.Dispatch<React.SetStateAction<any>>;
  postId: string;
  setStep: (val: number) => void;
  addActivity: (title: string, desc: string, type: any) => void;
  generatePostImg?: () => Promise<void>;
  isGeneratingImg?: boolean;
}

export default function Step2Form({
  post,
  setPost,
  textStyles,
  setTextStyles,
  postId,
  setStep,
  addActivity,
  generatePostImg,
  isGeneratingImg = false
}: Step2FormProps) {

  const handleBackStep = async () => {
    try {
      await supabase.from("posts").upsert({
        id: postId,
        user_id: "user_carlos_mendes",
        current_step: 1,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
    setStep(1);
  };

  const handleNextStep = async () => {
    try {
      await supabase.from("posts").upsert({
        id: postId,
        user_id: "user_carlos_mendes",
        current_step: 3,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
    setStep(3);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4 text-slate-800">
      
      <div className="flex flex-col items-start gap-0.5 text-left select-none">
        <span className="text-xs uppercase font-mono font-bold text-indigo-650">Etapa 2 de 3</span>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950 font-sans">Editar conteúdo</h2>
        <p className="text-[11px] text-slate-500">Personalize o estilo da fonte, cores e os textos exibidos na capa do post.</p>
      </div>

      {/* WYSIWYG EDITOR CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
        
        {/* Premium WYSIWYG Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-3 flex flex-wrap items-center justify-between gap-y-3 gap-x-2 select-none text-left">
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Font dropdown */}
            <div className="relative">
              <select 
                value={textStyles.fontFamily}
                onChange={(e) => setTextStyles(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-705 pl-3 pr-8 py-1.5 rounded-lg outline-none cursor-pointer hover:border-slate-300 transition-colors appearance-none min-w-[130px]"
              >
                <option value="Inter Bold">Inter Bold</option>
                <option value="Inter ExtraBold">Inter ExtraBold</option>
                <option value="Montserrat Bold">Montserrat Bold</option>
                <option value="Poppins Bold">Poppins Bold</option>
                <option value="Roboto Slab">Roboto Slab</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Oswald">Oswald</option>
                <option value="Lora">Lora</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Dancing Script">Dancing Script</option>
                <option value="Great Vibes">Great Vibes</option>
                <option value="Satisfy">Satisfy</option>
                <option value="Space Grotesk">Space Grotesk</option>
                <option value="Inter">Inter Regular</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <ChevronDown size={12} />
              </div>
            </div>

            {/* Size dropdown */}
            <div className="relative">
              <select 
                value={textStyles.fontSize}
                onChange={(e) => setTextStyles(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-705 pl-3 pr-7 py-1.5 rounded-lg outline-none cursor-pointer hover:border-slate-350 transition-colors appearance-none"
              >
                {[16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44].map(sz => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDown size={12} />
              </div>
            </div>

            {/* Formatting Buttons B, I, U */}
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-3xs">
              <button 
                type="button"
                onClick={() => setTextStyles(prev => ({ ...prev, bold: !prev.bold }))}
                className={`w-7 h-7 flex items-center justify-center rounded-md font-bold text-xs transition-colors cursor-pointer ${textStyles.bold ? "bg-slate-100 text-slate-900 font-extrabold" : "text-slate-400 hover:text-slate-600"}`}
                title="Negrito"
              >
                <Bold size={13} />
              </button>
              <button 
                type="button"
                onClick={() => setTextStyles(prev => ({ ...prev, italic: !prev.italic }))}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${textStyles.italic ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                title="Itálico"
              >
                <Italic size={13} />
              </button>
              <button 
                type="button"
                onClick={() => setTextStyles(prev => ({ ...prev, underline: !prev.underline }))}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors cursor-pointer ${textStyles.underline ? "bg-slate-100 text-slate-905" : "text-slate-400 hover:text-slate-600"}`}
                title="Sublinhado"
              >
                <Underline size={13} />
              </button>
            </div>

            {/* Color picker */}
            <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg shadow-3xs relative items-center gap-1">
              <button
                type="button"
                onClick={() => document.getElementById("native-color-picker-s2")?.click()}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-slate-100 transition-all text-xs font-bold text-slate-705 cursor-pointer"
                title="Escolher Cor"
              >
                <span className="font-extrabold text-xs">A</span>
              </button>
              <div 
                className="w-4 h-4 rounded-full border border-slate-300 shadow-3xs cursor-pointer flex items-center justify-center shrink-0 pr-0.5" 
                onClick={() => document.getElementById("native-color-picker-s2")?.click()} 
                style={{ backgroundColor: textStyles.color }}
              >
                <ChevronDown size={8} className="text-white drop-shadow-2xs" />
              </div>
              <input 
                id="native-color-picker-s2"
                type="color"
                value={textStyles.color}
                onChange={(e) => setTextStyles(prev => ({ ...prev, color: e.target.value }))}
                className="sr-only"
              />
            </div>

            {/* Shadow toggle */}
            <button 
              type="button"
              onClick={() => setTextStyles(p => ({ ...p, hasShadow: !p.hasShadow }))}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                textStyles.hasShadow 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Layers size={11} className={textStyles.hasShadow ? "text-indigo-600" : "text-slate-400"} />
              <span>Sombra</span>
            </button>

            {/* Gradient toggle */}
            <button 
              type="button"
              onClick={() => setTextStyles(p => ({ ...p, hasGradient: !p.hasGradient }))}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                textStyles.hasGradient 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold" 
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
              }`}
            >
              <Sparkles size={11} className={textStyles.hasGradient ? "text-indigo-600" : "text-slate-400"} />
              <span>Gradiente</span>
            </button>

            {/* Text Alignments */}
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-3xs">
              {(["left", "center", "right"] as const).map(dir => {
                const active = textStyles.align === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setTextStyles(p => ({ ...p, align: dir }))}
                    className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${
                      active 
                        ? "bg-indigo-50 text-indigo-600 shadow-3xs font-extrabold" 
                        : "text-slate-400 hover:text-slate-650"
                    }`}
                    title={`Alinhar à ${dir === "left" ? "Esquerda" : dir === "center" ? "Centro" : "Direita"}`}
                  >
                    {dir === "left" && <AlignLeft size={13} />}
                    {dir === "center" && <AlignCenter size={13} />}
                    {dir === "right" && <AlignRight size={13} />}
                  </button>
                );
              })}
            </div>

          </div>

          <div className="flex items-center gap-4">
            {/* IOS Switch labeled Subtítulo */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-655">Subtítulo</span>
              <button 
                type="button" 
                onClick={() => setTextStyles(p => ({ ...p, isSubtituloEnabled: !p.isSubtituloEnabled }))}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${textStyles.isSubtituloEnabled ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-3xs ring-0 transition duration-200 ease-in-out ${textStyles.isSubtituloEnabled ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Line height selector */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="text-xs font-bold text-slate-655">Espaçamento</span>
              <div className="relative">
                <select 
                  value={textStyles.lineHeight}
                  onChange={(e) => setTextStyles(prev => ({ ...prev, lineHeight: Number(e.target.value) }))}
                  className="bg-white border border-slate-200 text-xs font-bold text-slate-705 pl-2 pr-6 py-1 rounded-lg outline-none cursor-pointer appearance-none"
                >
                  <option value={1.0}>1.0</option>
                  <option value={1.1}>1.1</option>
                  <option value={1.2}>1.2</option>
                  <option value={1.3}>1.3</option>
                  <option value={1.4}>1.4</option>
                  <option value={1.5}>1.5</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-450">
                  <ChevronDown size={11} />
                </div>
              </div>
            </div>

            {/* Reset text style formatting button */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const defaultY = post.pubType === "1080x1920" ? 50 : 75;
                  setTextStyles({
                    fontFamily: "Inter Bold",
                    fontSize: 28,
                    bold: true,
                    italic: false,
                    underline: false,
                    color: "#FFFFFF",
                    hasShadow: true,
                    hasGradient: true,
                    align: "center",
                    isSubtituloEnabled: true,
                    lineHeight: 1.2,
                    posYPercent: defaultY
                  });
                  addActivity("Texto Resetado", "Estilos do texto resetados para o padrão do sistema", "info");
                }}
                className="bg-slate-150 hover:bg-red-50 border border-slate-300 hover:border-red-200 text-slate-700 hover:text-red-700 px-2.5 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all active:scale-[0.97]"
                title="Resetar texto ao padrão"
              >
                Voltar ao padrão
              </button>
            </div>
          </div>

        </div>

        {/* Form fields */}
        <div className="p-4 flex flex-col gap-3">
          
          {/* Manchete */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[11px] font-bold text-slate-500 font-semibold">Manchete</span>
            <div className="relative flex items-center w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <input 
                type="text" 
                value={post.manchete}
                onChange={(e) => setPost(prev => ({ ...prev, manchete: e.target.value.substring(0, 100) }))}
                className="w-full bg-transparent font-extrabold text-slate-850 text-xs outline-none uppercase tracking-wide placeholder-slate-400 pr-16"
                placeholder="DIGITE A MANCHETE DA CAPA DA NOTÍCIA"
              />
              <span className="absolute right-3.5 text-[10px] font-mono font-bold text-slate-400 select-none">
                {(post.manchete || '').length} / 100
              </span>
            </div>
          </div>

          {/* Subtítulo (opcional) */}
          <div className={`flex flex-col gap-1 text-left transition-all ${textStyles.isSubtituloEnabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
            <span className="text-[11px] font-bold text-slate-500 font-semibold">Subtítulo (opcional)</span>
            <div className="relative flex items-center w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <input 
                type="text" 
                value={post.subtitulo}
                onChange={(e) => setPost(prev => ({ ...prev, subtitulo: e.target.value.substring(0, 120) }))}
                className="w-full bg-transparent text-slate-705 text-xs outline-none placeholder-slate-400 pr-16"
                placeholder="Subtítulo complementar da capa"
                disabled={!textStyles.isSubtituloEnabled}
              />
              <span className="absolute right-3.5 text-[10px] font-mono font-bold text-slate-400 select-none">
                {(post.subtitulo || '').length} / 120
              </span>
            </div>
          </div>

          {/* Vertical spacing and positions controller */}
          <div className="flex flex-col gap-1 text-left bg-slate-50 border border-slate-200/70 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Posição Vertical no Preview</span>
              <span className="text-[10px] font-mono font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md">
                {typeof textStyles.posYPercent === 'number' ? textStyles.posYPercent : (post.pubType === '1080x1920' ? 50 : 75)}%
              </span>
            </div>
            <p className="text-[10px] text-slate-450 leading-relaxed mb-1.5">
              💡 Você também pode <strong>arrastar a manchete e o subtítulo juntos</strong> diretamente para cima ou para baixo clicando em cima da foto do celular!
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              {/* Slider and number field row */}
              <div className="flex items-center gap-3 w-full">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="0.5"
                  value={typeof textStyles.posYPercent === "number" ? textStyles.posYPercent : (post.pubType === "1080x1920" ? 50 : 75)}
                  onChange={(e) => setTextStyles(p => ({ ...p, posYPercent: Number(e.target.value) }))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shrink-0 h-8 shadow-3xs">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={typeof textStyles.posYPercent === "number" ? textStyles.posYPercent : (post.pubType === "1080x1920" ? 50 : 75)}
                    onChange={(e) => {
                      let val = e.target.value === "" ? 0 : Number(e.target.value);
                      if (val < 0) val = 0;
                      if (val > 100) val = 100;
                      setTextStyles(p => ({ ...p, posYPercent: val }));
                    }}
                    onBlur={(e) => {
                      let val = Number(e.target.value);
                      if (isNaN(val) || val < 0) val = 0;
                      if (val > 100) val = 100;
                      setTextStyles(p => ({ ...p, posYPercent: val }));
                    }}
                    className="w-12 text-center font-bold text-slate-800 text-xs bg-transparent border-0 p-0 outline-none focus:ring-0 select-all"
                  />
                  <span className="text-xs font-black text-slate-450 select-none">%</span>
                </div>
              </div>

              {/* Action buttons (Salvar, Restaurar) */}
              <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    const currentY = typeof textStyles.posYPercent === "number" ? textStyles.posYPercent : (post.pubType === "1080x1920" ? 50 : 75);
                    localStorage.setItem("newsflow_pattern_posYPercent", currentY.toString());
                    addActivity("Posição Salva", "Ajuste vertical de texto salvo como padrão", "editor");
                  }}
                  className="px-3 py-1.5 text-[10.5px] font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition-colors cursor-pointer shadow-3xs"
                  title="Salvar posição atual como novo padrão para futuras postagens"
                >
                  Salvar Posição Padrão
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("newsflow_pattern_posYPercent");
                    const factoryDefault = post.pubType === "1080x1920" ? 50 : 75;
                    setTextStyles(p => ({ ...p, posYPercent: factoryDefault }));
                    addActivity("Posição Restaurada", "Ajuste vertical de texto restaurado ao padrão original", "editor");
                  }}
                  className="px-3 py-1.5 text-[10.5px] font-bold bg-white border border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer shadow-3xs"
                  title="Restaurar posição original"
                >
                  Restaurar Padrão
                </button>
              </div>
            </div>
          </div>

          {/* Legenda com scrollable */}
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[11px] font-bold text-slate-500 font-semibold">Legenda completa da publicação</span>
            <div className="relative w-full bg-white border border-slate-200 rounded-xl p-2.5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all flex flex-col">
              <textarea 
                rows={6}
                value={post.legenda}
                onChange={(e) => setPost(prev => ({ ...prev, legenda: e.target.value.substring(0, 2200) }))}
                className="w-full bg-transparent text-slate-750 text-xs outline-none min-h-[140px] max-h-[300px] overflow-y-auto leading-relaxed resize-none pb-7 outline-none scrollbar-thin"
                placeholder="Legenda completa que acompanhará o post nas redes sociais..."
              />
              
              <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 select-none pointer-events-none">
                <span className="text-xs font-mono font-bold text-slate-455">
                  {(post.legenda || '').length} / 2.200
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Gerar imagem com IA baseado nos dados do passo 2 */}
          {generatePostImg && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mt-2">
              <div className="flex-1 text-left">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 leading-none">
                  <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                  Atualizar imagem com IA
                </span>
                <p className="text-[10.5px] text-slate-500 mt-1">
                  Gere uma nova imagem de capa baseada exclusivamente na manchete e legenda atualizadas do seu post.
                </p>
              </div>
              <button
                type="button"
                onClick={generatePostImg}
                disabled={isGeneratingImg}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-slate-900 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-3xs cursor-pointer transition-all"
              >
                {isGeneratingImg ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Gerando Imagem...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    <span>Gerar imagem com IA</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Navigation bottom row */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-auto">
        <button
          type="button"
          onClick={handleBackStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-705 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-3xs"
        >
          <ChevronRight size={14} className="rotate-180" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>Próximo Passo</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
