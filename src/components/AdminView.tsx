import React, { useState } from "react";
import { View, ServiceState, ActivityLog, PlatformPlan } from "../types";
import { 
  Users, Sparkles, Image, Share2, Activity, Settings, Plus, Bell, Eye, Edit2, 
  Trash2, ArrowRight, CornerDownLeft, Shield, Sliders, CheckCircle, Smartphone, 
  Flame, RefreshCw, Key, Database, FileText, Search, AlertTriangle, CheckCircle2, 
  XSquare, Lock, Unlock, Check, X
} from "lucide-react";

interface AdminViewProps {
  onNavigate: (view: View) => void;
  activities: ActivityLog[];
  onAddActivity: (title: string, desc: string, type: "text" | "image" | "success" | "clean" | "info" | "user") => void;
  plans: PlatformPlan[];
  setPlans: React.Dispatch<React.SetStateAction<PlatformPlan[]>>;
}

interface UserRec {
  id: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  quota: string;
  use: number;
  status: "Ativo" | "Bloqueado";
}

interface ApiSetting {
  id: string;
  name: string;
  type: "Texto" | "Imagem" | "Ambos";
  status: "Ativa" | "Inativa" | "Erro" | "Testando" | "Desativada";
  key: string;
  lastTest: string;
  latency: number;
  message: string;
  calls: number;
  limit: string;
  logo: string;
  errorLog?: string;
}

export default function AdminView({ onNavigate, activities, onAddActivity, plans, setPlans }: AdminViewProps) {
  
  // 1. STATE FOR TABS
  // Allowed tabs: "visao" (Visão Geral), "usuarios" (Gestão), "planos" (Planos), "apis" (APIs), "logs" (Server Logs)
  const [activeTab, setActiveTab] = useState<"visao" | "usuarios" | "planos" | "apis" | "logs">("visao");

  // Mobile navigation sidebar drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Success/Info feedback banner state
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showFeedback = (text: string, type: "success" | "error" | "info" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  // AI behavior settings toggles
  const [aiSettings, setAiSettings] = useState({
    suggestHashtags: true,
    suggestCta: true,
    includeSuggestions: false,
    tone: "Neutro e informativo",
    quality: "1080p (Full HD)"
  });

  const handleToggleSettings = (field: keyof typeof aiSettings) => {
    setAiSettings(prev => ({
      ...prev,
      [field]: !prev[field] as any
    }));
    onAddActivity("AI Config alterada", `O parâmetro ${String(field)} foi atualizado nas configurações gerais.`, "info");
  };

  // 2. USERS GESTION STATE
  const [usersList, setUsersList] = useState<UserRec[]>([
    { id: "USR001", name: "Ana Silva", email: "ana.silva@agenciamidia.com", plan: "Profissional", joined: "12/04/2025", quota: "148/200", use: 74, status: "Ativo" },
    { id: "USR002", name: "Bruno Souza", email: "bruno.souza@newspress.com.br", plan: "Básico", joined: "18/05/2025", quota: "42/50", use: 84, status: "Ativo" },
    { id: "USR003", name: "Carlos Eduardo", email: "cadu.editor@diariopopular.info", plan: "Enterprise", joined: "02/01/2025", quota: "312/Ilimitado", use: 31, status: "Ativo" },
    { id: "USR004", name: "Diana Prince", email: "diana@justiceherald.org", plan: "Profissional", joined: "29/03/2025", quota: "189/200", use: 94, status: "Ativo" },
    { id: "USR005", name: "Eduardo Santos", email: "edu.santos@freelance.jor.br", plan: "Gratuito", joined: "24/05/2026", quota: "5/5", use: 100, status: "Bloqueado" },
    { id: "USR006", name: "Fernanda Lima", email: "fernanda.lima@grupofoco.com.br", plan: "Profissional", joined: "10/02/2025", quota: "52/200", use: 26, status: "Ativo" }
  ]);

  // Search & Filter state for users
  const [userSearch, setUserSearch] = useState("");
  const [userPlanFilter, setUserPlanFilter] = useState("todos");
  const [userStatusFilter, setUserStatusFilter] = useState("todos");

  // User quick creation form state
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPlan, setNewUserPlan] = useState("Profissional");

  // User inline edit helper state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserPlan, setEditUserPlan] = useState("");

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showFeedback("Favor preencher nome e e-mail corretos.", "error");
      return;
    }
    const newId = `USR00${usersList.length + 1}`;
    const newUser: UserRec = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      plan: newUserPlan,
      joined: new Date().toLocaleDateString("pt-BR"),
      quota: newUserPlan === "Enterprise" ? "0/Ilimitado" : newUserPlan === "Profissional" ? "0/200" : newUserPlan === "Básico" ? "0/50" : "0/5",
      use: 0,
      status: "Ativo"
    };

    setUsersList(prev => [newUser, ...prev]);
    onAddActivity("Usuário cadastrado", `Conta criada para o e-mail: ${newUserEmail}`, "user");
    showFeedback(`Usuário ${newUserName} criado com sucesso no plano ${newUserPlan}!`);
    
    // Clear form
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserForm(false);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === "Ativo" ? "Bloqueado" : "Ativo";
        onAddActivity("Status atualizado", `Status de ${u.name} alterado para: ${nextStatus}`, "info");
        showFeedback(`Usuário ${u.name} foi ${nextStatus === "Ativo" ? "ativado" : "bloqueado"} com sucesso.`, "info");
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Tem certeza de que deseja remover permanentemente o usuário "${name}"?`)) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
      onAddActivity("Usuário removido", `Conta de ${name} excluída do servidor.`, "clean");
      showFeedback(`O usuário ${name} foi removido do sistema.`);
    }
  };

  const startEditUser = (u: UserRec) => {
    setEditingUserId(u.id);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserPlan(u.plan);
  };

  const saveEditUser = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, name: editUserName, email: editUserEmail, plan: editUserPlan };
        // adjust quota displays based on newly chosen plans
        if (editUserPlan !== u.plan) {
          updated.quota = editUserPlan === "Enterprise" ? "0/Ilimitado" : editUserPlan === "Profissional" ? "0/200" : editUserPlan === "Básico" ? "0/50" : "0/5";
          updated.use = 0;
        }
        showFeedback(`Cadastro de ${editUserName} reajustado.`);
        onAddActivity("Configuração de usuário", `Dados cadastrais de ${editUserName} alterados pelo Admin.`, "info");
        return updated;
      }
      return u;
    }));
    setEditingUserId(null);
  };


  // 3. PLANS MANAGEMENT STATE
  const [editingPlanIdx, setEditingPlanIdx] = useState<number | null>(null);
  const [formPrice, setFormPrice] = useState("");
  const [formUsers, setFormUsers] = useState("");
  const [formPosts, setFormPosts] = useState("");
  const [formImages, setFormImages] = useState("");
  const [formResources, setFormResources] = useState("");

  const startEditPlan = (idx: number, pl: PlatformPlan) => {
    setEditingPlanIdx(idx);
    setFormPrice(pl.price);
    setFormUsers(pl.users);
    setFormPosts(pl.posts);
    setFormImages(pl.images);
    setFormResources(pl.resources);
  };

  const commitPlanEdit = (idx: number) => {
    setPlans(prev => prev.map((pl, i) => {
      if (i === idx) {
        const updated = {
          ...pl,
          price: formPrice,
          users: formUsers,
          posts: formPosts,
          images: formImages,
          resources: formResources
        };
        showFeedback(`Plano ${pl.name} reconfigurado! Alterações refletidas na Landing Page.`);
        onAddActivity("Alterações em Planos", `Limites do plano ${pl.name} ajustados para: ${formPrice}, Posts: ${formPosts}`, "success");
        return updated;
      }
      return pl;
    }));
    setEditingPlanIdx(null);
  };


  // 4. APIs AND ACCESS KEYS STATE
  const [apiList, setApiList] = useState<ApiSetting[]>([
    { id: "API01", name: "Gemini Pro (Google GenAI)", type: "Ambos", status: "Ativa", key: "AIzaSyAz1Bw2Cx3Dy4E5F6G7H8I9...", lastTest: "Nunca realizado", latency: 0, message: "Pronto para diagnóstico", calls: 2190, limit: "2.500 req/dia", logo: "♊" },
    { id: "API02", name: "OpenAI GPT-4 / DALL-E", type: "Ambos", status: "Ativa", key: "sk-proj-4zXyWvUtSrQpOnMlKj...", lastTest: "Nunca realizado", latency: 0, message: "Pronto para diagnóstico", calls: 12450, limit: "100.000 reqs/mês", logo: "🧠" },
    { id: "API03", name: "Groq Cloud (Llama 3)", type: "Texto", status: "Ativa", key: "gsk_yJ8b7a6f5eDw2Cx3Dy4E5...", lastTest: "Nunca realizado", latency: 0, message: "Pronto para diagnóstico", calls: 8110, limit: "15.000 reqs/dia", logo: "⚡" },
    { id: "API04", name: "Pollinations AI (Gratuito)", type: "Ambos", status: "Ativa", key: "Acesso Livre - Sem Necessidade de Key", lastTest: "Nunca realizado", latency: 0, message: "Pronto para diagnóstico", calls: 4192, limit: "Ilimitado", logo: "🌸" },
    { id: "API05", name: "Stability AI (SDXL)", type: "Imagem", status: "Inativa", key: "st-access-key-8b7a6f5e2...", lastTest: "Nunca realizado", latency: 0, message: "Inativa pelo Administrador", calls: 312, limit: "5.000 créditos", logo: "🎨" },
    { id: "API06", name: "ElevenLabs Voice TTS", type: "Texto", status: "Inativa", key: "el-key-9z8y7x6w5v4u3t2s1...", lastTest: "Nunca realizado", latency: 0, message: "Inativa pelo Administrador", calls: 54, limit: "1.000 reqs/dia", logo: "🗣️" }
  ]);

  // Keys visibility state & operational testing tracking
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testingApiId, setTestingApiId] = useState<string | null>(null);
  
  // Custom testing outputs persisted on the front per API
  const [generatedTexts, setGeneratedTexts] = useState<Record<string, string>>({});
  const [testingTextId, setTestingTextId] = useState<string | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [testingImageId, setTestingImageId] = useState<string | null>(null);

  // Dedicated API log modal viewer state
  const [selectedApiLogViewer, setSelectedApiLogViewer] = useState<{ id: string; name: string } | null>(null);
  const [backendRawLogs, setBackendRawLogs] = useState<any[]>([]);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Synchronizers calling the backend
  const fetchApisAndLogs = async () => {
    try {
      const apisRes = await fetch("/api/admin/apis/status");
      const apisData = await apisRes.json();
      if (apisData && apisData.apis) {
        setApiList(apisData.apis);
      }

      const logsRes = await fetch("/api/admin/apis/logs");
      const logsData = await logsRes.json();
      if (logsData && logsData.logs) {
        setBackendRawLogs(logsData.logs);
        // Map logs directly to standard Linux Terminal console feed
        const mappedLogs = logsData.logs.map((l: any) => {
          const lvl = l.status === "Sucesso" ? "SUCCESS" : "ERROR";
          return `[${l.time}] [${lvl}] [${l.type}] ${l.apiName}: ${l.message} (${l.latency}ms) - Solicitante: ${l.user}`;
        });
        setLogsFeed(prev => {
          const sysLogs = prev.filter(line => line.includes("[BOOT]") || line.includes("Docker") || line.includes("redis") || line.includes("Nginx"));
          return [...mappedLogs, ...sysLogs];
        });
      }
    } catch (err) {
      console.error("Falha ao sincronizar painel APIs com o servidor de dados:", err);
    }
  };

  // Automated pull when entering APIs tab
  React.useEffect(() => {
    fetchApisAndLogs();
  }, [activeTab]);

  const handleUpdateApiKey = async (id: string, newKeyValue: string) => {
    try {
      const res = await fetch("/api/admin/apis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, key: newKeyValue })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Chave de ${data.api.name} salva com segurança no backend!`, "success");
        onAddActivity("Chave de API salva", `Mapeamento de segredo criptografado salvo para: ${data.api.name}`, "success");
        fetchApisAndLogs();
      } else {
        showFeedback("Erro ao salvar chave da API.", "error");
      }
    } catch (err) {
      showFeedback("Falha crítica de comunicação com o backend.", "error");
    }
  };

  const handleToggleApiStatus = async (id: string, currentStatus: string) => {
    const isActivating = currentStatus === "Inativa" || currentStatus === "Desativada";
    const route = isActivating ? "/api/admin/apis/activate" : "/api/admin/apis/deactivate";
    
    try {
      const res = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        const nextStateStr = isActivating ? "habilitada" : "suspensa";
        showFeedback(`API ${data.api.name} foi ${nextStateStr} com sucesso!`, isActivating ? "success" : "info");
        onAddActivity("Status atualizado", `Integração de ${data.api.name} configurada como ${isActivating ? "Ativa" : "Inativa"}.`, "info");
        fetchApisAndLogs();
      }
    } catch (err) {
      showFeedback("Erro ao alternar status da API no backend.", "error");
    }
  };

  const handleTestConnection = async (id: string, name: string) => {
    setTestingApiId(id);
    showFeedback("Testando conexão...", "info");
    onAddActivity("Verificação operacional", `Efetuando ping de latência e conexão segura para ${name}`, "info");

    try {
      const res = await fetch("/api/admin/apis/test-ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Conexão com ${name} ok! Latência: ${data.api.latency}ms.`, "success");
        onAddActivity("Teste de Conexão", `Check de ping para ${name} resolvido em ${data.api.latency}ms com sucesso.`, "success");
      } else {
        showFeedback(`Falha na conexão — verifique a chave, endpoint ou limite da API.`, "error");
        onAddActivity("Falha diagnóstica", `Monitor de conectividade acusou erro crítico de autenticação para: ${name}.`, "clean");
      }
      fetchApisAndLogs();
    } catch (err) {
      showFeedback(`Erro ao testar ping: Timeout de conexão física ou rede indisponível.`, "error");
    } finally {
      setTestingApiId(null);
    }
  };

  const handleTestText = async (id: string, name: string) => {
    setTestingTextId(id);
    showFeedback("Testando geração de texto...", "info");
    try {
      const res = await fetch("/api/admin/apis/test-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedTexts(prev => ({ ...prev, [id]: data.text }));
        showFeedback("Texto gerado com sucesso pelo modelo!", "success");
        onAddActivity("Geração diagnóstica", `Texto de teste criado com sucesso no painel via ${name}`, "success");
      } else {
        showFeedback(`Erro: chave inválida ou limite da API atingido.`, "error");
        onAddActivity("Falha de redação", `Geração de texto para ${name} recusada pelo portal parceiro.`, "clean");
      }
      fetchApisAndLogs();
    } catch (err) {
      showFeedback("Erro ao processar chamada de teste de texto.", "error");
    } finally {
      setTestingTextId(null);
    }
  };

  const handleTestImage = async (id: string, name: string) => {
    setTestingImageId(id);
    showFeedback("Testando geração de imagem...", "info");
    try {
      const res = await fetch("/api/admin/apis/test-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedImages(prev => ({ ...prev, [id]: data.imageUrl }));
        showFeedback("Imagem gerada com sucesso pela IA!", "success");
        onAddActivity("Geração visual", `Imagem institucional renderizada com êxito sob a API ${name}`, "success");
      } else {
        showFeedback(`Erro: chave inválida ou limite da API atingido.`, "error");
        onAddActivity("Falha visual", `A API de imagens ${name} recusou a montagem do grid conceitual.`, "clean");
      }
      fetchApisAndLogs();
    } catch (err) {
      showFeedback("Erro ao processar chamada de teste de imagem.", "error");
    } finally {
      setTestingImageId(null);
    }
  };


  // 5. SERVER LOGS SYSTEM STATE
  const [logsFeed, setLogsFeed] = useState<string[]>([
    `[2026-05-27 23:51:02] [BOOT] Inicializando contêiner Docker Cloud Run no endereço 0.0.0.0:3000`,
    `[2026-05-27 23:51:05] [INFO] Conexão estabelecida com sucesso na porta 3000. Nginx reverso escutando.`,
    `[2026-05-27 23:51:12] [SUCCESS] Variável de ambiente GEMINI_API_KEY carregada com sucesso do AI Studio Secrets.`,
    `[2026-05-27 23:52:45] [INFO] Chamada à API dac-model gemini-2.5-flash enviada pelo usuário USR001. Latência: 612ms.`,
    `[2026-05-27 23:53:01] [SUCCESS] Legenda gerada pelo motor de IA com 4 hashtags e sugestão clara de Call-To-Action.`,
    `[2026-05-27 23:53:15] [WARNING] API gemini-2.5-flash-image retornou limite de plano estrito (429 Quota Exceeded) para prompt visual. Iniciado fallback estético em alta definição.`,
    `[2026-05-27 23:54:30] [INFO] Usuário Ana Silva exportou com sucesso post tipo 1:1 para arquivo mockup local.`,
    `[2026-05-27 23:55:02] [SECURITY] Nova sessão administrativa aberta para Carlos Mendes sob IP de faturamento público.`,
    `[2026-05-27 23:55:58] [INFO] Limpeza periódica de buffers temporários executada no cache redis. 14mb liberados.`
  ]);

  const [logsSearch, setLogsSearch] = useState("");
  const [logsLevelFilter, setLogsLevelFilter] = useState("todos");

  const handleSimulateServerError = () => {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    const mockErrs = [
      `[${timestamp}] [ERROR] falha de requisição 503 na API ElevenLabs. O endpoint de conversão de voz não respondeu dentro de 2000ms.`,
      `[${timestamp}] [WARNING] Tentativa de login maliciosa bloqueada sob IP temporário de testes automatizados do SaaS.`,
      `[${timestamp}] [ERROR] 429 Rate Limit Exceeded na API de Imagens do Google. Ative faturamento para escalonamento contínuo.`,
      `[${timestamp}] [SUCCESS] Sincronização automática das tabelas dinâmicas de planos e faturamento realizada com sucesso.`
    ];
    const picked = mockErrs[Math.floor(Math.random() * mockErrs.length)];
    setLogsFeed(prev => [picked, ...prev]);
    onAddActivity("Log registrado", "Novo registro gerado automaticamente pelo simulador operacional", "info");
    showFeedback("Novo log operacional registrado no console!", "info");
  };

  const handleClearLogs = () => {
    setLogsFeed([]);
    showFeedback("Consola de registros limpo.");
    onAddActivity("Logs apagados", "O administrador realizou purga manual no centro de registros do sistema.", "clean");
  };


  // 6. DYNAMIC SUMMARY STATS CARDS FOR VISÃO GERAL
  // Filtered values depending on state
  const totalUsersCount = usersList.length;
  const blockedUsersCount = usersList.filter(u => u.status === "Bloqueado").length;
  const activeApisCount = apiList.filter(a => a.status === "Ativa").length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row select-text">
      
      {/* 1. SIDEBAR - RESPONSIVE */}
      {/* Mobile Top Navbar with Title and hamburger */}
      <div className="md:hidden w-full bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-2" onClick={() => onNavigate("landing")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <span className="font-extrabold text-sm text-white font-mono">N</span>
          </div>
          <span className="font-bold text-md tracking-tight text-white">NewsFlow <span className="text-indigo-400">AI</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white hover:text-indigo-400 focus:outline-none p-1 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Sliders size={22} />}
        </button>
      </div>

      {/* Actual Sidebar layout */}
      <aside className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        fixed md:static top-[57px] md:top-0 left-0 w-64 bg-slate-950 text-white shrink-0 flex flex-col border-r border-slate-900 justify-between p-5 h-[calc(100vh-57px)] md:h-screen shadow-lg transition-transform duration-300 ease-in-out z-40
      `}>
        <div className="flex flex-col gap-8 overflow-y-auto no-scrollbar">
          {/* Logo with admin identifier (hidden on mobile header already) */}
          <div className="hidden md:flex items-center justify-between pb-3 border-b border-slate-900">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("landing")}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
                  <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-pink-500 font-mono">N</span>
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight text-white">NewsFlow <span className="text-indigo-400">AI</span></span>
            </div>
            <span className="text-[9px] bg-red-600/30 text-rose-400 border border-red-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">ADMIN</span>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest px-3 mb-1">Menus Principais</div>
            
            <button onClick={() => { onNavigate("landing"); setIsMobileMenuOpen(false); }} className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-all text-left">
              <span>🏠</span> Home Landing
            </button>
            <button onClick={() => { onNavigate("dashboard"); setIsMobileMenuOpen(false); }} className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-all text-left">
              <span>📊</span> Dashboard / Gerar Post
            </button>
            <button 
              onClick={() => { setActiveTab("visao"); setIsMobileMenuOpen(false); }} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeTab === "visao" 
                  ? "bg-rose-600/20 border-l-4 border-rose-600 text-rose-200 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>⚙️</span> Painel Admin (Visão Geral)
            </button>

            <div className="h-[1px] bg-slate-900 my-4" />
            
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest px-3">Gestão de Sistema</span>
            <button 
              onClick={() => { setActiveTab("usuarios"); setIsMobileMenuOpen(false); }} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeTab === "usuarios" 
                  ? "bg-rose-600/20 border-l-4 border-rose-600 text-rose-200 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              👥 Gestão de Usuários
            </button>
            <button 
              onClick={() => { setActiveTab("planos"); setIsMobileMenuOpen(false); }} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeTab === "planos" 
                  ? "bg-rose-600/20 border-l-4 border-rose-600 text-rose-200 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              💳 Planos & Faturamento
            </button>
            <button 
              onClick={() => { setActiveTab("apis"); setIsMobileMenuOpen(false); }} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeTab === "apis" 
                  ? "bg-rose-600/20 border-l-4 border-rose-600 text-rose-200 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔌 APIs & Chaves de Acesso
            </button>
            <button 
              onClick={() => { setActiveTab("logs"); setIsMobileMenuOpen(false); }} 
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                activeTab === "logs" 
                  ? "bg-rose-600/20 border-l-4 border-rose-600 text-rose-200 font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🗒️ Logs do Servidor
            </button>
          </nav>
        </div>

        {/* Admin profile card */}
        <div className="flex flex-col gap-3 mt-8">
          <div className="flex items-center gap-2 px-1">
            <img 
              className="w-8 h-8 rounded-full border border-rose-500/35 object-cover"
              src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=150&q=80" 
              alt="Admin pic"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-white leading-tight">Carlos Mendes</span>
              <span className="text-[10px] text-rose-450 font-semibold text-rose-400">Admin Geral</span>
            </div>
          </div>
          
          <div className="text-[10.5px] text-slate-500 text-center border-t border-slate-900 pt-3">
            v1.4.2 · Cloud Run Core OK
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 h-screen select-text bg-slate-50">
        
        {/* TOP STATUS NOTICES & FEEDBACK BANNERS */}
        {feedback && (
          <div className={`p-4 mb-4 rounded-xl border flex items-center justify-between text-xs font-bold shadow-sm transition-all animate-fade-in ${
            feedback.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
              : feedback.type === "error" 
                ? "bg-rose-50 border-rose-200 text-rose-900" 
                : "bg-indigo-50 border-indigo-200 text-indigo-900"
          }`}>
            <span className="flex items-center gap-2">
              {feedback.type === "success" ? <CheckCircle size={15} className="text-emerald-600" /> : <AlertTriangle size={15} className="text-orange-500" />}
              {feedback.text}
            </span>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer text-sm">✖</button>
          </div>
        )}

        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-slate-200 text-slate-800 font-black px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">Painel Executivo</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 font-black px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Menu: {activeTab === "visao" ? "Visão Geral" : activeTab === "usuarios" ? "Gestão de Usuários" : activeTab === "planos" ? "Faturamento & Planos" : activeTab === "apis" ? "Conectores de API" : "Logs do Servidor"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 mt-1 flex items-center gap-2">
              NewsFlow AI Admin
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Visão unificada das conexões, métricas de publicidade, usuários ativos e controle de APIs em tempo real.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => {
                onAddActivity("Análise geral manual", "Forçou-se a varredura e reset diagnóstico total do SaaS.", "info");
                showFeedback("Diagnóstico operacional concluído com sucesso. Todos os sistemas respondendo OK.");
              }}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-3xs"
            >
              <RefreshCw size={13} className="text-slate-500" /> Diagnóstico Rápido
            </button>
            <button 
              onClick={() => onNavigate("dashboard")}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 font-bold text-xs rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all"
            >
              Ir para o Editor ➔
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------- 
            TAB VIEW: 1. VISÃO GERAL (visao) 
           ------------------------------------------------------------- */}
        {activeTab === "visao" && (
          <div className="flex flex-col gap-6 animate-fade-in animate-once">
            
            {/* Stat Row */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 py-6">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Usuários cadastrados</span>
                  <Users size={15} className="text-indigo-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-950">{totalUsersCount}</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded-sm">+14,2%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2">({blockedUsersCount} bloqueados ou retidos)</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Posts criados</span>
                  <Sparkles size={15} className="text-indigo-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-950">3.842</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded-sm">+18,4%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2">Uso mensal histórico</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Cozinhas IA Ativas</span>
                  <Image size={15} className="text-indigo-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-950">{activeApisCount} / 6</span>
                  <span className="text-[9px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-sm">Conectadas</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2">Integrações robustas</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Exportações ativas</span>
                  <Share2 size={15} className="text-indigo-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-950">2.376</span>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded-sm">+15,3%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2">Via WhatsApp e Instagram</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs flex flex-col justify-between col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Servidor Status</span>
                  <Activity size={15} className="text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-emerald-600">100%</span>
                  <span className="text-[9px] text-emerald-800 font-mono uppercase bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Instabilidade 0%</span>
                </div>
                <span className="text-[9px] text-slate-400 mt-2">Todos os microsserviços OK</span>
              </div>
            </div>

            {/* Quick API Health table + Toggles on vision screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* L: Active APIs simplified list */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      🔌 Conectores Ativos de API do SaaS
                    </span>
                    <button 
                      onClick={() => setActiveTab("apis")}
                      className="text-[10.5px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Gerenciar chaves e limites ➔
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-150">
                          <th className="p-3">Serviço de IA</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Mapeado</th>
                          <th className="p-3">Cotas Limite</th>
                          <th className="p-3 text-right">Diagnóstico</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {apiList.map((srv) => (
                          <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-semibold text-slate-800 flex items-center gap-2">
                              <span className="text-base">{srv.logo}</span> {srv.name}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                                srv.status === "Ativa" 
                                  ? "bg-emerald-50 text-emerald-800" 
                                  : srv.status === "Desativada" 
                                    ? "bg-rose-50 text-rose-800"
                                    : "bg-amber-50 text-amber-800"
                              }`}>
                                {srv.status === "Ativa" ? "● ATIVA" : srv.status === "Desativada" ? "○ DESATIVADA" : "▲ INSTÁVEL"}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-400 select-text">
                              <code>{srv.key.substring(0, 8)}...</code>
                            </td>
                            <td className="p-3 text-slate-500 font-mono font-bold">{srv.limit}</td>
                            <td className="p-3 text-right">
                              <button 
                                onClick={() => handleTestConnection(srv.id, srv.name)}
                                disabled={testingApiId === srv.id}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer hover:border-slate-300 border border-transparent transition-all disabled:opacity-50"
                              >
                                {testingApiId === srv.id ? "Testando..." : "Testar conexão"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Behaviors Config and Settings Area */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-left flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                    ⚙️ Configurações Gerais de Geração de IA
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tone select default */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Tom jornalístico padrão</label>
                      <select 
                        value={aiSettings.tone}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, tone: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="Neutro e informativo">Neutro e informativo</option>
                        <option value="Urgente / Alerta">Urgente / Alerta</option>
                        <option value="Analítico / Econômico">Analítico / Econômico</option>
                      </select>
                    </div>

                    {/* Cover quality select */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Qualidade da imagem padrão</label>
                      <select 
                        value={aiSettings.quality}
                        onChange={(e) => setAiSettings(prev => ({ ...prev, quality: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      >
                        <option value="1080p (Full HD)">1080p (Full HD)</option>
                        <option value="4K (Max Ultra High)">4K (Max Ultra High)</option>
                        <option value="720p (Normal)">720p (Normal)</option>
                      </select>
                    </div>

                    {/* Behavioral AI Switches */}
                    <div className="flex flex-col gap-2 border-l border-slate-150 pl-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase mb-1">Filtros e Comportamentos</span>
                      <div className="flex flex-col gap-2.5 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-705">
                          <input 
                            type="checkbox" 
                            checked={aiSettings.suggestHashtags}
                            onChange={() => handleToggleSettings("suggestHashtags")}
                            className="rounded accent-indigo-600 w-3.5 h-3.5"
                          />
                          <span>Incluir hashtags relevantes</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-705">
                          <input 
                            type="checkbox" 
                            checked={aiSettings.suggestCta}
                            onChange={() => handleToggleSettings("suggestCta")}
                            className="rounded accent-indigo-600 w-3.5 h-3.5"
                          />
                          <span>Sugerir Call-to-Action</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* R: CENTER ACTIVITY NOTICES */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between h-full">
                
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center text-left">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    🔔 Centro de Atividades
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono tracking-wider font-extrabold uppercase">Ativo</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[380px] no-scrollbar">
                  {activities.length === 0 ? (
                    <div className="text-slate-400 text-xs text-center py-12">Nenhuma atividade recente registrada neste ciclo.</div>
                  ) : (
                    activities.map((act, index) => (
                      <div key={index} className="flex gap-2.5 pb-2.5 border-b border-slate-100 last:border-0 text-left">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs">
                          {act.type === "text" ? "📝" : act.type === "image" ? "🎨" : act.type === "success" ? "✅" : act.type === "user" ? "👥" : "⚙️"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900 leading-normal">{act.title}</span>
                          <span className="text-[10.5px] text-slate-500 leading-normal">{act.description}</span>
                          <span className="text-[9px] text-slate-400 mt-1">{act.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button 
                  onClick={() => setActiveTab("logs")}
                  className="w-full text-left p-3 border-t border-slate-150 bg-slate-50 flex justify-between items-center text-[10px] text-indigo-600 font-black hover:underline cursor-pointer uppercase tracking-widest"
                >
                  <span>Ver registro logs detalhado</span>
                  <span>➔</span>
                </button>
              </div>
            </div>

            {/* Quick Channel Statistics */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs text-left">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                📱 Canais de Publicidade Sincronizados no SaaS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5">
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instagram</span>
                    <span className="text-lg font-black text-pink-600">412 contas</span>
                  </div>
                  <span className="text-2xl">💟</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversas WhatsApp</span>
                    <span className="text-lg font-black text-emerald-600">287 telefones</span>
                  </div>
                  <span className="text-2xl">💬</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Publicações diárias</span>
                    <span className="text-lg font-black text-indigo-600">148 / dia (média)</span>
                  </div>
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB VIEW: 2. GESTÃO DE USUÁRIOS (usuarios) 
           ------------------------------------------------------------- */}
        {activeTab === "usuarios" && (
          <div className="flex flex-col gap-6 animate-fade-in animate-once">
            
            {/* Gated Controls Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search inputs */}
              <div className="flex flex-1 items-center gap-3 flex-wrap">
                <div className="relative min-w-[240px] flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Buscar usuário por nome ou email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-350 hover:border-slate-400 text-slate-900 pl-9 pr-4 py-2 text-xs rounded-xl outline-none focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Plan filters */}
                <select 
                  value={userPlanFilter}
                  onChange={(e) => setUserPlanFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-350 text-xs font-semibold p-2 rounded-xl outline-none focus:border-indigo-550"
                >
                  <option value="todos">Filtrar por Plano: Todos</option>
                  <option value="Gratuito">Plano: Gratuito</option>
                  <option value="Básico">Plano: Básico</option>
                  <option value="Profissional">Plano: Profissional</option>
                  <option value="Enterprise">Plano: Enterprise</option>
                </select>

                {/* Status filters */}
                <select 
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-350 text-xs font-semibold p-2 rounded-xl outline-none focus:border-indigo-550"
                >
                  <option value="todos">Filtrar por Status: Todos</option>
                  <option value="Ativo">Status: Ativo</option>
                  <option value="Bloqueado">Status: Bloqueado</option>
                </select>
              </div>

              {/* Add user action toggler */}
              <button 
                onClick={() => setShowAddUserForm(!showAddUserForm)}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm select-none shrink-0"
              >
                {showAddUserForm ? "Cancelar cadastro" : "Novo Usuário"} <Plus size={14} />
              </button>
            </div>

            {/* User Quick Add Form block */}
            {showAddUserForm && (
              <form onSubmit={handleCreateUser} className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm text-left flex flex-col gap-4 animate-fade-in">
                <div className="pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">Simulador</span>
                  <h3 className="font-extrabold text-slate-900 text-xs">Incluir Novo Usuário de Teste</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Carlos Eduardo" 
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      placeholder="cadu@agencia.com.br" 
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Escolher Plano de Destino</label>
                    <select 
                      value={newUserPlan}
                      onChange={(e) => setNewUserPlan(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl outline-none focus:border-indigo-500"
                    >
                      <option value="Gratuito">Planos: Gratuito (R$ 0)</option>
                      <option value="Básico">Planos: Básico (R$ 49)</option>
                      <option value="Profissional">Planos: Profissional (R$ 129)</option>
                      <option value="Enterprise">Planos: Enterprise (R$ 399)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3.5 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddUserForm(false)}
                    className="p-2 py-2 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    className="bg-indigo-650 hover:bg-indigo-750 bg-indigo-600 text-white font-bold text-xs p-2.5 px-6 rounded-xl cursor-pointer transition-all shadow-xs"
                  >
                    Efetivar Cadastro
                  </button>
                </div>
              </form>
            )}

            {/* Interactive Users grid table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto text-left">
                <table className="w-full text-xs font-sans border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-450 border-b border-slate-200 font-extrabold text-[10px] uppercase tracking-wider">
                      <th className="p-3.5">Ficha do Usuário</th>
                      <th className="p-3.5">Plano Contratado</th>
                      <th className="p-3.5">Data de Ingresso</th>
                      <th className="p-3.5">Uso de Créditos de Geração</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações Administrativas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList
                      .filter(u => {
                        // Search filter
                        const inNameOrEmail = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                                              u.email.toLowerCase().includes(userSearch.toLowerCase());
                        // Plan filter
                        const matchesPlan = userPlanFilter === "todos" || u.plan === userPlanFilter;
                        // Status filter
                        const matchesStatus = userStatusFilter === "todos" || u.status === userStatusFilter;
                        
                        return inNameOrEmail && matchesPlan && matchesStatus;
                      })
                      .map((u) => {
                        const isEditing = editingUserId === u.id;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Avatar & Identifiers */}
                            <td className="p-3.5 h-[64px]">
                              {isEditing ? (
                                <div className="flex flex-col gap-1.5 max-w-[170px]">
                                  <input 
                                    type="text" 
                                    value={editUserName}
                                    onChange={(e) => setEditUserName(e.target.value)}
                                    className="p-1 px-2 border border-slate-305 text-xs font-bold rounded-lg outline-none"
                                    placeholder="Nome"
                                  />
                                  <input 
                                    type="email" 
                                    value={editUserEmail}
                                    onChange={(e) => setEditUserEmail(e.target.value)}
                                    className="p-0.5 px-2 border border-slate-305 text-[11px] rounded bg-slate-50 outline-none"
                                    placeholder="E-mail"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-500 font-mono text-xs">
                                    {u.name.charAt(0)}{u.name.split(" ")[1]?.charAt(0) || ""}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-extrabold text-slate-900">{u.name}</span>
                                    <span className="text-[11px] text-slate-400 select-all font-mono leading-normal">{u.email}</span>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Plan with Select options */}
                            <td className="p-3.5">
                              {isEditing ? (
                                <select 
                                  value={editUserPlan}
                                  onChange={(e) => setEditUserPlan(e.target.value)}
                                  className="p-1 border border-slate-300 rounded font-semibold text-xs outline-none"
                                >
                                  <option value="Gratuito">Gratuito</option>
                                  <option value="Básico">Básico</option>
                                  <option value="Profissional">Profissional</option>
                                  <option value="Enterprise">Enterprise</option>
                                </select>
                              ) : (
                                <span className={`inline-flex px-2 py-0.5 rounded font-black text-[9.5px] uppercase ${
                                  u.plan === "Enterprise" 
                                    ? "bg-purple-100 text-purple-800" 
                                    : u.plan === "Profissional" 
                                      ? "bg-indigo-100 text-indigo-800" 
                                      : u.plan === "Básico" 
                                        ? "bg-blue-105 bg-blue-50 text-blue-800" 
                                        : "bg-slate-100 text-slate-600"
                                }`}>
                                  {u.plan}
                                </span>
                              )}
                            </td>

                            {/* Date registry */}
                            <td className="p-3.5 font-mono text-slate-500 font-medium">
                              {u.joined}
                            </td>

                            {/* Quota consumption */}
                            <td className="p-3.5 font-mono text-slate-800">
                              <div className="flex flex-col gap-1 max-w-[130px]">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                  <span>{u.quota}</span>
                                  <span className="text-slate-420 text-[9px] opacity-70">({u.use}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      u.use > 90 ? "bg-rose-500" : u.use > 70 ? "bg-amber-500" : "bg-indigo-600"
                                    }`} 
                                    style={{ width: `${u.use}%` }} 
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Account Status active/blocked */}
                            <td className="p-3.5">
                              <span className={`inline-flex items-center gap-1 font-bold text-[10px] ${
                                u.status === "Ativo" ? "text-emerald-600" : "text-rose-600"
                              }`}>
                                {u.status === "Ativo" ? "● ATIVO" : "■ BLOQUEADO"}
                              </span>
                            </td>

                            {/* Operation keys */}
                            <td className="p-3.5 text-right flex items-center justify-end gap-1.5 h-[64px]">
                              {isEditing ? (
                                <>
                                  <button 
                                    onClick={() => saveEditUser(u.id)}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                    title="Salvar"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => setEditingUserId(null)}
                                    className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                    title="Dispensar"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => startEditUser(u)}
                                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                    title="Modificar Dados"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button 
                                    onClick={() => handleToggleUserStatus(u.id)}
                                    className={`p-1.5 rounded-lg border text-[10px] font-extrabold cursor-pointer transition-all ${
                                      u.status === "Ativo" 
                                        ? "text-rose-650 text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-850" 
                                        : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-850"
                                    }`}
                                    title={u.status === "Ativo" ? "Suspender e Segurar usuário" : "Promover à ativação"}
                                  >
                                    {u.status === "Ativo" ? <Lock size={12} /> : <Unlock size={12} />}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="p-1.5 text-slate-405 hover:text-red-650 text-rose-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Deletar permanentemente"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Table empty warning */}
              {usersList.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">Nenhum cadastro de usuário encontrado para a busca especificada.</div>
              )}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB VIEW: 3. PLANOS & FATURAMENTO (planos) 
           ------------------------------------------------------------- */}
        {activeTab === "planos" && (
          <div className="flex flex-col gap-6 animate-fade-in animate-once">
            
            {/* Warning block */}
            <div className="bg-amber-50 border border-amber-250 text-amber-950 p-4 rounded-2xl flex items-start gap-3.5 text-left text-xs leading-normal">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5 animate-pulse" size={18} />
              <div>
                <strong>💡 Sincronismo Automático Ativo:</strong> As alterações de limites, preços e vantagens configuradas nesta tela são salvas imediatamente na memória coletiva global do SaaS. Elas aparecerão automaticamente para os visitantes no formulário de faturamento da <strong>Home Landing Page</strong>.
              </div>
            </div>

            {/* Plans Management Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((pl, idx) => {
                const isEditing = editingPlanIdx === idx;
                return (
                  <div 
                    key={pl.name}
                    className="bg-white p-6 rounded-3xl border border-slate-205 shadow-2xs hover:shadow-sm flex flex-col justify-between text-left relative"
                  >
                    <div>
                      {/* Name Header and badge indicator */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 font-mono">
                          {pl.name}
                        </span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-black">
                          SaaS Plan
                        </span>
                      </div>

                      {/* Editing fields vs display parameters */}
                      {isEditing ? (
                        <div className="flex flex-col gap-3 mt-4 text-xs">
                          {/* Price */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mensalidade (Preço)</label>
                            <input 
                              type="text" 
                              value={formPrice} 
                              onChange={(e) => setFormPrice(e.target.value)} 
                              className="p-1.5 border border-slate-300 rounded font-bold outline-none font-mono"
                            />
                          </div>

                          {/* Users */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Max Usuários</label>
                            <input 
                              type="text" 
                              value={formUsers} 
                              onChange={(e) => setFormUsers(e.target.value)} 
                              className="p-1.5 border border-slate-300 rounded outline-none"
                            />
                          </div>

                          {/* Posts */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Posts Mensais</label>
                            <input 
                              type="text" 
                              value={formPosts} 
                              onChange={(e) => setFormPosts(e.target.value)} 
                              className="p-1.5 border border-slate-300 rounded outline-none"
                            />
                          </div>

                          {/* IA Images */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Imagens com IA</label>
                            <input 
                              type="text" 
                              value={formImages} 
                              onChange={(e) => setFormImages(e.target.value)} 
                              className="p-1.5 border border-slate-300 rounded outline-none"
                            />
                          </div>

                          {/* Resources list detail */}
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acesso a Recursos</label>
                            <select 
                              value={formResources} 
                              onChange={(e) => setFormResources(e.target.value)} 
                              className="p-1.5 border border-slate-300 rounded outline-none"
                            >
                              <option value="Básicos">Básicos</option>
                              <option value="Padrão">Padrão</option>
                              <option value="Avançados">Avançados</option>
                              <option value="Todos">Todos</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <div className="text-3xl font-black text-slate-900 font-sans tracking-tight">
                            {pl.price}
                            <span className="text-[11px] font-normal text-slate-500 font-mono">/mês</span>
                          </div>

                          {/* Benefits list */}
                          <ul className="mt-6 space-y-3.5 text-slate-700 text-xs">
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-600">✔</span> Max Usuários: <strong>{pl.users}</strong>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-600">✔</span> Geração de Posts: <strong>{pl.posts} /mês</strong>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-600">✔</span> Capas de Imagem IA: <strong>{pl.images} /mês</strong>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="text-emerald-600">✔</span> Recursos inclusos: <span className="p-0.5 bg-slate-100 rounded text-[10px] font-extrabold">{pl.resources}</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Commit/Actions panel */}
                    <div className="mt-8 border-t border-slate-100 pt-4 flex gap-2">
                      {isEditing ? (
                        <>
                          <button 
                            type="button" 
                            onClick={() => setEditingPlanIdx(null)}
                            className="flex-1 text-center py-2 text-xs border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => commitPlanEdit(idx)}
                            className="flex-1 text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                          >
                            Salvar
                          </button>
                        </>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => startEditPlan(idx, pl)}
                          className="w-full text-center py-2 border border-indigo-600/30 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-650 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Configurar Limites
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Pricing Note */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 text-left flex flex-col gap-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Faturamento do SaaS</span>
              <h3 className="font-extrabold text-slate-900 text-xs text-sm">Controle de Cobrança Recorrente (Stripe Integration Status)</h3>
              <p className="text-xs text-slate-500 leading-normal">
                As cobranças do NewsFlow AI ocorrem de maneira automatizada através do webhook integrado ao Stripe no dia da assinatura dos usuários. Alterações de limites efetuadas acima afetam apenas novas assinaturas ou modificações manuais de faturamento.
              </p>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB VIEW: 4. APLICAÇÕES & CHAVES DE ACESSO (apis) 
           ------------------------------------------------------------- */}
        {activeTab === "apis" && (
          <div className="flex flex-col gap-6 animate-fade-in animate-once">
            
            {/* Context Box */}
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-lg text-left flex items-start gap-4 flex-col md:flex-row justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                  <Key size={22} />
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <h4 className="font-extrabold text-base text-white tracking-tight">APIs & Chaves de Acesso</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Painel operacional seguro para gerenciar conexões com os principais geradores de Inteligência Artificial e canais de mídia do SaaS. 
                    Insira suas chaves, realize diagnósticos de ping em tempo real, teste redações e renderizações, monitore a latência de integridade e analise os registros de auditoria com proteção de chaves no backend.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 text-slate-350">Gateway Sync: Ativo (Porta 3000)</span>
              </div>
            </div>

            {/* Interactive APIs Details Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {apiList.map((api) => {
                const isKeyVisible = !!visibleKeys[api.id];
                const textOutput = generatedTexts[api.id];
                const imgOutput = generatedImages[api.id];
                
                // Track typing key values per card
                return (
                  <div 
                    key={api.id}
                    className="p-6 bg-white border border-slate-205 border-slate-200 rounded-3xl text-left flex flex-col justify-between hover:border-indigo-150 transition-all shadow-sm hover:shadow"
                  >
                    <div>
                      {/* Name of API, Type, and status badge */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-100" role="img" aria-label={api.name}>
                            {api.logo}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 leading-tight tracking-tight">{api.name}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-2 py-0.5 bg-slate-105 bg-slate-100 border border-slate-200 text-slate-500 rounded font-mono text-[9px] font-bold">
                                TIPO: {api.type.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {api.calls} chamadas gratuitas
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status chip */}
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex px-2.5 py-1 text-[9.5px] font-black rounded-lg ${
                            api.status === "Ativa" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : api.status === "Inativa" || api.status === "Desativada"
                                ? "bg-slate-100 text-slate-600 border border-slate-205"
                                : api.status === "Erro"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {api.status === "Ativa" && "● ATIVA"}
                            {(api.status === "Inativa" || api.status === "Desativada") && "○ INATIVA"}
                            {api.status === "Erro" && "⚡ ERRO"}
                            {api.status === "Testando" && "☕ DIAL UP..."}
                          </span>
                        </div>
                      </div>

                      {/* Credential editing state */}
                      <div className="flex flex-col gap-4 py-4 text-xs">
                        
                        {/* API Key Input and Manual Save */}
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider font-mono">Chave Secreta do Provedor</label>
                            <button 
                              onClick={() => toggleKeyVisibility(api.id)}
                              className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer select-none flex items-center gap-1"
                            >
                              {isKeyVisible ? <Unlock size={11} /> : <Lock size={11} />}
                              {isKeyVisible ? "Mascarar chave" : "Mostrar chave"}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input 
                              type={isKeyVisible ? "text" : "password"} 
                              id={`input-key-${api.id}`}
                              defaultValue={api.key} 
                              className="bg-slate-50 border border-slate-200 focus:bg-white w-full p-2.5 py-2 text-xs rounded-xl outline-none focus:border-indigo-500 font-mono transition-all text-slate-850"
                              placeholder="Digite ou cole sua chave secreta protegida..."
                            />
                            <button 
                              onClick={() => {
                                const val = (document.getElementById(`input-key-${api.id}`) as HTMLInputElement)?.value;
                                if (val) handleUpdateApiKey(api.id, val);
                              }}
                              className="px-4 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-3xs cursor-pointer select-none shrink-0"
                            >
                              Salvar Chave
                            </button>
                          </div>
                        </div>

                        {/* Quota limit progression meter */}
                        <div className="grid grid-cols-2 gap-4 py-2.5 px-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-mono text-left">
                          <div>
                            <span className="text-slate-400 block font-medium">Limite do Provedor:</span>
                            <p className="font-extrabold text-slate-800 mt-0.5 text-xs">{api.limit}</p>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-medium">Última latência medida:</span>
                            <p className="font-extrabold text-slate-800 mt-0.5 text-xs">
                              {api.latency > 0 ? `${api.latency} ms` : "Não mensurada"}
                            </p>
                          </div>
                        </div>

                        {/* Dynamic Message Box - Connection state or API status feedback */}
                        <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[11.5px] border border-slate-200 leading-normal flex flex-col gap-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                            <span>Último diagnóstico</span>
                            <span>{api.lastTest || "Nunca realizado"}</span>
                          </div>
                          <p className={`font-semibold mt-1 ${
                            api.status === "Ativa" 
                              ? "text-slate-700" 
                              : api.status === "Erro" 
                                ? "text-rose-650 text-rose-600" 
                                : "text-slate-500"
                          }`}>
                            {api.message || "Aguardando inicialização dos testes de conectividade."}
                          </p>
                        </div>

                        {/* Interactive testing output panels (Inline results generated) */}
                        {textOutput && (
                          <div className="p-3.5 bg-indigo-50/60 border border-indigo-150 rounded-2xl text-indigo-950 font-mono text-[11px] leading-relaxed relative animate-fade-in">
                            <div className="flex items-center justify-between absolute right-3.5 top-3">
                              <span className="bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 text-[8.5px] uppercase tracking-wide rounded">Geração Real</span>
                            </div>
                            <strong className="text-xs text-indigo-900 block mb-1">📝 Resposta de Texto Simulada/Real:</strong>
                            <p className="bg-white/80 border border-indigo-100 p-2.5 rounded-lg text-slate-850 select-all max-h-[140px] overflow-y-auto font-sans text-xs">
                              {textOutput}
                            </p>
                          </div>
                        )}

                        {imgOutput && (
                          <div className="p-3.5 bg-purple-50 border border-purple-150 rounded-2xl text-purple-950 font-mono text-[11px] leading-relaxed relative animate-fade-in flex flex-col gap-2">
                            <strong className="text-xs text-purple-900 block">🎨 Canvas de Rendering (Visualização):</strong>
                            <div className="bg-white rounded-xl border border-purple-150 overflow-hidden relative shadow-3xs group flex items-center justify-center">
                              <img 
                                src={imgOutput} 
                                alt="Visual mockup" 
                                className="w-full aspect-video object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a 
                                  href={imgOutput} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="px-3.5 py-1.5 bg-white text-slate-800 font-extrabold text-[10px] rounded-lg tracking-tight hover:bg-slate-100"
                                >
                                  Abrir em Nova Aba ↗
                                </a>
                              </div>
                            </div>
                            <span className="text-[10px] text-purple-600 font-medium font-sans">
                              * Imagem renderizada no formato 1:1. Resolução adaptativa.
                            </span>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Operational testing trigger & Activator buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row flex-wrap gap-2 text-xs">
                      
                      {/* Left: action testings */}
                      <div className="flex flex-wrap gap-1.5 flex-1 select-none">
                        <button 
                          onClick={() => handleTestConnection(api.id, api.name)}
                          disabled={testingApiId === api.id || testingTextId === api.id || testingImageId === api.id}
                          className="flex-1 min-w-[80px] p-2 bg-slate-100 border border-slate-205 hover:bg-slate-200 text-slate-800 font-extrabold text-[10.5px] rounded-xl transition-all select-none disabled:opacity-50 cursor-pointer text-center"
                          title="Verify if server API endpoint is responding."
                        >
                          {testingApiId === api.id ? "Ping..." : "Testar Ping"}
                        </button>
                        
                        {(api.type === "Texto" || api.type === "Ambos") && (
                          <button 
                            onClick={() => handleTestText(api.id, api.name)}
                            disabled={testingApiId === api.id || testingTextId === api.id || testingImageId === api.id}
                            className="flex-1 min-w-[80px] p-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 font-extrabold text-[10.5px] rounded-xl transition-all select-none disabled:opacity-50 cursor-pointer text-center"
                            title="Generate a sample caption."
                          >
                            {testingTextId === api.id ? "Lendo..." : "Testar Texto"}
                          </button>
                        )}

                        {(api.type === "Imagem" || api.type === "Ambos") && (
                          <button 
                            onClick={() => handleTestImage(api.id, api.name)}
                            disabled={testingApiId === api.id || testingTextId === api.id || testingImageId === api.id}
                            className="flex-1 min-w-[85px] p-2 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-800 font-extrabold text-[10.5px] rounded-xl transition-all select-none disabled:opacity-50 cursor-pointer text-center"
                            title="Generate a sample mock card."
                          >
                            {testingImageId === api.id ? "Render..." : "Testar Img"}
                          </button>
                        )}
                      </div>

                      {/* Right: Toggle active and audit logs */}
                      <div className="flex gap-1.5 shrink-0 justify-end">
                        <button 
                          onClick={() => handleToggleApiStatus(api.id, api.status)}
                          className={`px-3 p-2 font-bold text-[10.5px] rounded-xl transition-colors shrink-0 cursor-pointer select-none ${
                            api.status === "Ativa"
                              ? "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {api.status === "Ativa" ? "Desativar API" : "Ativar API"}
                        </button>

                        <button 
                          onClick={() => setSelectedApiLogViewer({ id: api.id, name: api.name })}
                          className="px-3 p-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-[10.5px] rounded-xl cursor-pointer select-none shadow-3xs"
                        >
                          Ver Logs
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Custom Modal for Specific API Transaction audited logs */}
            {selectedApiLogViewer && (
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in animate-duration-150">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl animate-scale-up">
                  
                  {/* Modal Header */}
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-lg shrink-0">
                        📁
                      </div>
                      <div className="text-left flex flex-col">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Auditoria Transacional</span>
                        <h4 className="text-sm font-black text-slate-900 tracking-tight leading-tight">Logs de Canal — {selectedApiLogViewer.name}</h4>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedApiLogViewer(null)}
                      className="p-1.5 hover:bg-slate-105 bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Modal Logs Feed Content */}
                  <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                    <p className="text-left text-xs text-slate-500 leading-normal mb-1">
                      Visualizando todos os pings, gerações e alterações registradas para este canal de serviço. Estes metadados simulam e medem a estabilidade física real dos servidores remotos.
                    </p>
                    
                    {backendRawLogs.filter(log => log.apiId === selectedApiLogViewer.id).length === 0 ? (
                      <div className="py-12 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-4 gap-2 text-slate-400 font-medium">
                        <span className="text-3xl">📭</span>
                        <p className="text-xs">Nenhum registro operacional cadastrado para esta API ainda.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {backendRawLogs
                          .filter(log => log.apiId === selectedApiLogViewer.id)
                          .map((log) => {
                            const isErr = log.status !== "Sucesso";
                            return (
                              <div 
                                key={log.id} 
                                className={`p-4 border rounded-2xl text-left flex flex-col gap-1 text-xs transition-shadow ${
                                  isErr 
                                    ? "bg-rose-50/65 border-rose-150 rounded shadow-3xs" 
                                    : "bg-slate-50 border-slate-150 hover:shadow-3xs"
                                }`}
                              >
                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                  <span className="text-xs font-bold text-slate-650 text-indigo-650 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase tracking-wide">
                                    {log.type.toUpperCase()}
                                  </span>
                                  <span>{log.time}</span>
                                </div>
                                <div className="flex items-center justify-between font-mono text-[11.5px] mt-1.5">
                                  <span className={`font-black ${isErr ? "text-rose-750 text-rose-700" : "text-emerald-700"}`}>
                                    {isErr ? "● FALHA OPERACIONAL" : "✓ INTEGRAL (OK)"}
                                  </span>
                                  <span className="text-slate-500">Latência: <strong>{log.latency} ms</strong></span>
                                </div>
                                <p className="text-slate-700 font-sans leading-relaxed text-xs mt-1 text-md">
                                  {log.message}
                                </p>
                                <p className="text-[10px] text-slate-400 text-right mt-1 font-mono">
                                  Admin: {log.user}
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl shrink-0 flex justify-end">
                    <button 
                      onClick={() => setSelectedApiLogViewer(null)}
                      className="px-5 py-2.5 bg-slate-900 py-1.5 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer select-none shadow-3xs"
                    >
                      Fechar Auditoria
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- 
            TAB VIEW: 5. LOGS DO SERVIDOR (logs) 
           ------------------------------------------------------------- */}
        {activeTab === "logs" && (
          <div className="flex flex-col gap-6 animate-fade-in animate-once">
            
            {/* Header filters for console logs */}
            <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 flex-wrap flex-1">
                {/* Search Term logs */}
                <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Filtrar logs por texto..."
                    value={logsSearch}
                    onChange={(e) => setLogsSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-350 hover:border-slate-400 text-slate-900 pl-9 pr-4 py-2 text-xs rounded-xl outline-none focus:border-indigo-500 font-medium font-mono"
                  />
                </div>

                {/* Level selection filter */}
                <select 
                  value={logsLevelFilter}
                  onChange={(e) => setLogsLevelFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-xs font-bold p-2 rounded-xl outline-none"
                >
                  <option value="todos">Nível de Erro: Todos os registros</option>
                  <option value="INFO">Nível: [INFO] Informações</option>
                  <option value="SUCCESS">Nível: [SUCCESS] Sucessos</option>
                  <option value="ERROR">Nível: [ERROR] Falhas críticas</option>
                </select>
              </div>

              {/* Simulation buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={handleSimulateServerError}
                  className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  ⚡ Simular Novo Registro
                </button>
                <button 
                  onClick={handleClearLogs}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-105 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  🧹 Limpar Consola
                </button>
              </div>

            </div>

            {/* Simulated Linux Terminal CLI visual for logs */}
            <div className="bg-slate-950 text-slate-200 rounded-3xl border border-slate-900 shadow-xl overflow-hidden font-mono flex flex-col">
              
              {/* Terminal Title Bar */}
              <div className="bg-slate-900 p-3 px-4 flex items-center justify-between border-b border-slate-950">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full" />
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-[11px] font-bold text-slate-400 ml-2">server_logs@newsflow-ai-core: ~ (Port 3000)</span>
                </div>
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase bg-indigo-950/40 border border-indigo-900 px-2 py-0.5 rounded-sm">Vite Express LIVE</span>
              </div>

              {/* Logs line display with syntax coloring */}
              <div className="p-5 text-left text-xs leading-normal leading-relaxed h-[420px] overflow-y-auto no-scrollbar flex flex-col gap-1.5 select-text">
                {logsFeed
                  .filter(log => {
                    const matchesSearch = log.toLowerCase().includes(logsSearch.toLowerCase());
                    const matchesLevel = logsLevelFilter === "todos" || log.includes(`[${logsLevelFilter}]`);
                    return matchesSearch && matchesLevel;
                  })
                  .map((log, index) => {
                    // Decide log category coloring inside terminal
                    const isErr = log.includes("[ERROR]");
                    const isSucc = log.includes("[SUCCESS]");
                    const isWarn = log.includes("[WARNING]");
                    
                    let colorCls = "text-slate-200";
                    if (isErr) colorCls = "text-rose-455 text-rose-400 font-bold";
                    else if (isSucc) colorCls = "text-emerald-455 text-emerald-400";
                    else if (isWarn) colorCls = "text-amber-455 text-amber-400";

                    return (
                      <div key={index} className={`pb-1 border-b border-white/5 last:border-0 hover:bg-slate-900 py-0.5 rounded px-2 transition-colors ${colorCls}`}>
                        <code>{log}</code>
                      </div>
                    );
                  })
                }

                {/* Feed blank indicator */}
                {logsFeed.length === 0 && (
                  <div className="text-slate-500 text-xs text-center py-24 select-none">[vazio] Consola limpo. O servidor aguarda novas ações operacionais.</div>
                )}
              </div>

              {/* Terminal input bar indicator */}
              <div className="bg-slate-900/60 p-3 px-4 flex items-center justify-between border-t border-slate-950 text-[10px] text-slate-450 text-slate-500 text-left select-none">
                <span>Registrador Ativo · Node.js v20.12.0 · Executing no Cloud Run</span>
                <span>CTRL + C para desalocar buffers</span>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
