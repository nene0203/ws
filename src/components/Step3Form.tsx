import React, { useState } from "react";
import { ChevronRight, Copy, Share2, Instagram, Phone, AlertCircle, RefreshCw, Unlink, CheckCircle2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Step3FormProps {
  setStep: (val: number) => void;
  postId: string;
  addActivity: (title: string, desc: string, type: any) => void;
  copyToClipboard: () => void;
  wasCopied: boolean;
  setStatusMessage?: (msg: any) => void;
}

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error";

export default function Step3Form({
  setStep,
  postId,
  addActivity,
  copyToClipboard,
  wasCopied,
  setStatusMessage
}: Step3FormProps) {

  // Load state from local storage or default to connected
  const [igStatus, setIgStatus] = useState<ConnectionStatus>(() => {
    return (localStorage.getItem("newsflow_ig_status") as ConnectionStatus) || "connected";
  });
  const [waStatus, setWaStatus] = useState<ConnectionStatus>(() => {
    return (localStorage.getItem("newsflow_wa_status") as ConnectionStatus) || "connected";
  });

  const saveIgStatus = (status: ConnectionStatus) => {
    setIgStatus(status);
    localStorage.setItem("newsflow_ig_status", status);
  };

  const saveWaStatus = (status: ConnectionStatus) => {
    setWaStatus(status);
    localStorage.setItem("newsflow_wa_status", status);
  };

  const handleBackStep = async () => {
    try {
      await supabase.from("posts").upsert({
        id: postId,
        user_id: "user_carlos_mendes",
        current_step: 2,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
    setStep(2);
  };

  const showToast = (text: string, type: "success" | "info" | "error") => {
    if (setStatusMessage) {
      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setStatusMessage({ text, type, time: nowStr });
    }
  };

  // Instagram simulated connection
  const handleConnectInstagram = (action: "connect" | "reconnect") => {
    saveIgStatus("connecting");
    addActivity("Conexão IG", "Tentando conectar conta do Instagram...", "info");
    
    setTimeout(() => {
      saveIgStatus("connected");
      addActivity("Sucesso IG", "Conta do Instagram conectada com sucesso.", "success");
      showToast("Instagram conectado com sucesso!", "success");
    }, 1200);
  };

  const handleDisconnectInstagram = () => {
    saveIgStatus("disconnected");
    addActivity("Desconexão IG", "Instagram desconectado.", "info");
    showToast("Instagram desconectado.", "info");
  };

  const handleSimulateErrorInstagram = () => {
    saveIgStatus("connecting");
    addActivity("Conexão IG", "Tentando conectar conta do Instagram...", "info");
    
    setTimeout(() => {
      saveIgStatus("error");
      addActivity("Erro IG", "Falha na autenticação do Instagram.", "error");
      showToast("Erro ao conectar com o Instagram. Tente novamente.", "error");
    }, 1200);
  };

  // WhatsApp simulated connection
  const handleConnectWhatsApp = (action: "connect" | "reconnect") => {
    saveWaStatus("connecting");
    addActivity("Conexão WA", "Validando sessão do WhatsApp Web...", "info");
    
    setTimeout(() => {
      saveWaStatus("connected");
      addActivity("Sucesso WA", "Instância de WhatsApp sincronizada.", "success");
      showToast("WhatsApp conectado com sucesso!", "success");
    }, 1200);
  };

  const handleDisconnectWhatsApp = () => {
    saveWaStatus("disconnected");
    addActivity("Desconexão WA", "WhatsApp offline.", "info");
    showToast("WhatsApp desconectado.", "info");
  };

  const handleSimulateErrorWhatsApp = () => {
    saveWaStatus("connecting");
    addActivity("Conexão WA", "Verificando conexão WhatsApp...", "info");
    
    setTimeout(() => {
      saveWaStatus("error");
      addActivity("Erro WA", "Tempo limite de conexão do WhatsApp excedido.", "error");
      showToast("Erro ao autenticar WhatsApp QR Code.", "error");
    }, 1200);
  };

  // Render Badge containing custom colors for requested state
  const renderStatusBadge = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-bold text-[10px] uppercase shadow-3xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Conectado</span>
          </div>
        );
      case "connecting":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full font-bold text-[10px] uppercase shadow-3xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 animate-ping" />
            <span>Conectando...</span>
          </div>
        );
      case "error":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full font-bold text-[10px] uppercase shadow-3xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>Erro ao conectar</span>
          </div>
        );
      case "disconnected":
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 text-slate-500 rounded-full font-bold text-[10px] uppercase shadow-3xs select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            <span>Não conectado</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-5 text-slate-800">
      
      <div className="flex flex-col items-start gap-1 text-left">
        <span className="text-xs uppercase font-mono font-bold text-indigo-600">Etapa 3 de 3</span>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-950">Conectar redes sociais e exportar</h2>
        <p className="text-xs text-slate-500">Conecte com segurança as suas contas de Instagram e WhatsApp para compartilhar ou de forma simples copiar as legendas prontas.</p>
      </div>

      {/* Connection Info */}
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs font-bold text-indigo-850 flex items-start gap-2 select-none text-left leading-relaxed">
        <span className="text-indigo-650 font-extrabold text-sm leading-none">ℹ</span>
        <span>Conecte suas contas para exportar de forma integrada, ou use as opções de cópia rápida.</span>
      </div>

      {/* NEW ORGANIZATION: Social connections stacked vertically in a column */}
      <div className="flex flex-col gap-4 text-left w-full">
        
        {/* Connection item 1: INSTAGRAM */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm font-extrabold text-[15px]">
              <Instagram size={20} />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-slate-850">
                  {igStatus === "connected" ? "@carlos.mendes.jornalista" : "Instagram Business"}
                </span>
                {renderStatusBadge(igStatus)}
              </div>
              <span className="text-[10px] text-slate-450 font-medium">
                {igStatus === "connected" 
                  ? "Sessão autorizada do perfil comercial" 
                  : "Conecte sua conta para publicar manchetes direto no feed"}
              </span>
            </div>
          </div>

          {/* Action buttons stack */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
            {igStatus === "connected" && (
              <>
                <button
                  type="button"
                  onClick={handleDisconnectInstagram}
                  className="bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold text-slate-500 hover:text-slate-750 transition-colors cursor-pointer flex items-center gap-1 shadow-3xs"
                  title="Desconectar conta comercial"
                >
                  <Unlink size={11} />
                  <span>Desconectar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectInstagram("reconnect")}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10.5px] font-black text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1"
                  title="Re-sincronizar sessão atual"
                >
                  <RefreshCw size={11} className={igStatus === "connecting" ? "animate-spin" : ""} />
                  <span>Reconectar</span>
                </button>
              </>
            )}

            {igStatus === "disconnected" && (
              <button
                type="button"
                onClick={() => handleConnectInstagram("connect")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10.5px] font-black px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1 hover:scale-[1.01]"
                title="Sincronizar com Facebook/Instagram"
              >
                <CheckCircle2 size={12} />
                <span>Conectar Instagram</span>
              </button>
            )}

            {igStatus === "error" && (
              <>
                <button
                  type="button"
                  onClick={() => handleConnectInstagram("connect")}
                  className="bg-red-600 hover:bg-red-700 text-white text-[10.5px] font-black px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1"
                  title="Tentar autenticação novamente"
                >
                  <RefreshCw size={11} />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectInstagram}
                  className="text-[10px] font-bold text-slate-450 hover:text-slate-650 cursor-pointer px-1 py-1"
                >
                  Ignorar Erro
                </button>
              </>
            )}

            {igStatus === "connecting" && (
              <span className="text-[11px] font-bold text-slate-400 select-none px-4 py-1.5">Conectando...</span>
            )}

            {igStatus !== "connecting" && igStatus !== "error" && (
              <button
                type="button"
                onClick={handleSimulateErrorInstagram}
                className="text-[10px] font-extrabold text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Ver comportamento visual do Erro de Conexão"
              >
                Simular Erro
              </button>
            )}
          </div>
        </div>

        {/* Connection item 2: WHATSAPP */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-555 flex items-center justify-center text-white shrink-0 shadow-sm font-extrabold text-[15px]">
              <Phone size={20} />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold text-slate-850">
                  {waStatus === "connected" ? "+55 (11) 98765-4321" : "WhatsApp API / Web"}
                </span>
                {renderStatusBadge(waStatus)}
              </div>
              <span className="text-[10px] text-slate-455 font-medium">
                {waStatus === "connected" 
                  ? "Sessão ativa e sincronizada" 
                  : "Conecte seu WhatsApp para disparar posts para clientes ou grupos de notícias"}
              </span>
            </div>
          </div>

          {/* Action buttons stack */}
          <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
            {waStatus === "connected" && (
              <>
                <button
                  type="button"
                  onClick={handleDisconnectWhatsApp}
                  className="bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-[10.5px] font-bold text-slate-500 hover:text-slate-750 transition-colors cursor-pointer flex items-center gap-1 shadow-3xs"
                  title="Colocar instância offline"
                >
                  <Unlink size={11} />
                  <span>Desconectar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectWhatsApp("reconnect")}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10.5px] font-black text-slate-705 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1"
                  title="Re-autenticar QR Code"
                >
                  <RefreshCw size={11} className={waStatus === "connecting" ? "animate-spin" : ""} />
                  <span>Reconectar</span>
                </button>
              </>
            )}

            {waStatus === "disconnected" && (
              <button
                type="button"
                onClick={() => handleConnectWhatsApp("connect")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-black px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1 hover:scale-[1.01]"
                title="Sincronizar QR Code do WhatsApp Web"
              >
                <CheckCircle2 size={12} />
                <span>Conectar WhatsApp</span>
              </button>
            )}

            {waStatus === "error" && (
              <>
                <button
                  type="button"
                  onClick={() => handleConnectWhatsApp("connect")}
                  className="bg-red-600 hover:bg-red-700 text-white text-[10.5px] font-black px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs flex items-center gap-1"
                  title="Tentar ler QR Code novamente"
                >
                  <RefreshCw size={11} />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectWhatsApp}
                  className="text-[10px] font-bold text-slate-450 hover:text-slate-655 cursor-pointer px-1 py-1"
                >
                  Ignorar Erro
                </button>
              </>
            )}

            {waStatus === "connecting" && (
              <span className="text-[11px] font-bold text-slate-400 select-none px-4 py-1.5 font-sans">Conectando...</span>
            )}

            {waStatus !== "connecting" && waStatus !== "error" && (
              <button
                type="button"
                onClick={handleSimulateErrorWhatsApp}
                className="text-[10px] font-extrabold text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Ver comportamento visual do Erro"
              >
                Simular Erro
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Large Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <button 
          type="button"
          onClick={copyToClipboard}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
        >
          <Copy size={13} />
          <span>{wasCopied ? "Copiado!" : "Exportar para Instagram"}</span>
        </button>
        <button 
          type="button"
          onClick={copyToClipboard}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
        >
          <Share2 size={13} />
          <span>Exportar para WhatsApp</span>
        </button>
      </div>

      {/* Nav back button */}
      <div className="flex items-center justify-start border-t border-slate-200 pt-4 mt-2">
        <button
          type="button"
          onClick={handleBackStep}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          <ChevronRight size={14} className="rotate-180" />
          <span>Voltar</span>
        </button>
      </div>

    </div>
  );
}
