import React, { useState, useEffect } from "react";
import { View, ActivityLog, PlatformPlan } from "./types";
import LandingView from "./components/LandingView";
import DashboardView from "./components/DashboardView";
import AdminView from "./components/AdminView";
import { ShieldAlert, ArrowLeft, RefreshCw, Lock, ShieldCheck, User } from "lucide-react";

export default function App() {
  // Current view of the application
  const [view, setView] = useState<View>("landing");

  // Simulated User Role to test access protection: "admin" (can see all), "user" (restricted only to dashboard/landing)
  const [userRole, setUserRole] = useState<"admin" | "user">(() => {
    return (localStorage.getItem("newsflow_user_role") as "admin" | "user") || "admin";
  });

  // Track the role locally
  useEffect(() => {
    localStorage.setItem("newsflow_user_role", userRole);
  }, [userRole]);

  // Lifted Plans state shared to Landing and Administration
  const [plans, setPlans] = useState<PlatformPlan[]>([
    { name: "Gratuito", price: "R$ 0", users: "1", posts: "5", images: "10", resources: "Básicos" },
    { name: "Básico", price: "R$ 49", users: "1", posts: "50", images: "100", resources: "Padrão" },
    { name: "Profissional", price: "R$ 129", users: "3", posts: "200", images: "500", resources: "Avançados" },
    { name: "Enterprise", price: "R$ 399", users: "10", posts: "Ilimitado", images: "Ilimitado", resources: "Todos" }
  ]);

  // Server activities simulated logs state
  const [activities, setActivities] = useState<ActivityLog[]>([
    { 
      title: "Título gerado", 
      description: "Nova manchete de mercado criada sob tom Informativo.", 
      time: "Há 1 min", 
      type: "text" 
    },
    { 
      title: "Imagem gerada", 
      description: "Capa do Instagram criada com sucesso em resolução 1080p.", 
      time: "Há 2 min", 
      type: "image" 
    },
    { 
      title: "Exportação concluída", 
      description: "Postagem automatizada enviada para fila de exportação do Instagram.", 
      time: "Há 4 min", 
      type: "success" 
    },
    { 
      title: "Campos limpos", 
      description: "Formulário de redação limpo para novos conteúdos pelo usuário.", 
      time: "Há 5 min", 
      type: "clean" 
    },
    { 
      title: "Usuário conectado", 
      description: "Ana Silva conectou nova conta comercial ativa do Instagram.", 
      time: "Há 8 min", 
      type: "user" 
    }
  ]);

  // Method to reactively append activities
  const addActivity = (title: string, desc: string, type: "text" | "image" | "success" | "clean" | "info" | "user") => {
    const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newLog: ActivityLog = {
      title,
      description: desc,
      time: `Hoje às ${nowStr}`,
      type
    };
    setActivities(prev => [newLog, ...prev]);
  };

  // Check if current view is admin and user is guest/user
  const isAccessDenied = view === "admin" && userRole !== "admin";

  return (
    <div className="w-full min-h-screen bg-slate-50 transition-colors duration-200 relative pb-16 md:pb-0">
      
      {/* Dynamic Screen Gating or Core Dashboard Render */}
      {isAccessDenied ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100 select-none">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-red-200 p-8 shadow-xl text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-650 shadow-xs">
              <ShieldAlert size={36} className="text-red-600 animate-bounce" />
            </div>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Acesso Restrito / Negado</h2>
              <p className="text-xs font-mono text-red-600 font-bold uppercase tracking-wider">Erro de Autorização HTTP 403 Forbidden</p>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                Você está logado atualmente como o perfil **Usuário Comum**. O painel de administração é reservado exclusivamente para perfis de nível **Administrador**.
              </p>
            </div>

            {/* Quick Helper to aid testing */}
            <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-left flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Simulador de Credenciais</span>
              <p className="text-[11px] text-slate-600 leading-normal">
                Como este é um ambiente de demonstração e teste do SaaS, você pode clicar no botão verde abaixo para <strong>se autopromover a Administrador</strong> imediatamente e desbloquear todos os menus administrativos!
              </p>
              <button 
                onClick={() => {
                  setUserRole("admin");
                  addActivity("Login Administrativo", "Usuário trocou de papel para Administrador no hub de desenvolvimento", "success");
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck size={14} /> Ativar Modo Administrador
              </button>
            </div>

            {/* Redirect safety actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={() => setView("landing")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft size={14} /> Voltar para Home
              </button>
              <button 
                onClick={() => setView("dashboard")}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Ir para o Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {view === "landing" && <LandingView onNavigate={setView} plans={plans} userRole={userRole} />}
          {view === "dashboard" && <DashboardView onNavigate={setView} addActivity={addActivity} />}
          {view === "admin" && (
            <AdminView 
              onNavigate={setView} 
              activities={activities} 
              onAddActivity={addActivity} 
              plans={plans}
              setPlans={setPlans}
            />
          )}
        </>
      )}

      {/* FLOATING SaaS SIMULATION TOOLBAR - Allows seamless swapping of user roles in the application */}
      <div 
        id="saas-development-hub"
        className="fixed bottom-4 right-4 z-[9999] bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl p-3 flex items-center gap-3 select-none max-w-sm animate-fade-in"
      >
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase font-mono font-black text-slate-500 tracking-wider">Ambiente SaaS</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${userRole === "admin" ? "bg-red-500 animate-pulse" : "bg-indigo-500"}`} />
            <span className="text-xs font-black tracking-tight font-sans">
              Cargo: {userRole === "admin" ? "Administrador (Liberado)" : "Usuário Comum (Restrito)"}
            </span>
          </div>
        </div>

        <button 
          onClick={() => {
            const next = userRole === "admin" ? "user" : "admin";
            setUserRole(next);
            addActivity("Alteração de Permissões", `Simulando o sistema com o perfil "${next === "admin" ? "Administrador" : "Usuário Comum"}"`, "info");
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl font-bold text-[10px] tracking-tight uppercase cursor-pointer transition-all"
          title="Alternar entre Administrador e Usuário Comum para testar restrição de rotas"
        >
          <RefreshCw size={11} className="animate-spin-slow text-indigo-400" />
          Alternar
        </button>
      </div>

    </div>
  );
}

