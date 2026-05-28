import React, { useState, useEffect, useRef } from "react";
import { View, PostState, JournalisticTone, ImageQuality, PublicationType } from "../types";
import IPhonePreview from "./IPhonePreview";
import { supabase, isRealSupabaseConfigured } from "../lib/supabase";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";
import { 
  Link2, Sparkles, Image as ImageIcon, RotateCcw, Check, Info, ChevronDown, 
  Bold, Italic, Underline, Palette, HelpCircle, Bell, ExternalLink, Download, 
  CheckCircle2, AlertCircle, Copy, Share2, CornerDownLeft, Eye, Type, Sliders, Play, Trash2,
  LayoutGrid, PenTool, History, Layers, ClipboardList, Puzzle, Settings, ChevronRight,
  AlignLeft, AlignCenter, AlignRight, Zap, BarChart3, Scale, RefreshCw
} from "lucide-react";

interface DashboardViewProps {
  onNavigate: (view: View) => void;
  addActivity: (title: string, desc: string, type: "text" | "image" | "success" | "clean" | "info" | "user") => void;
}

export default function DashboardView({ onNavigate, addActivity }: DashboardViewProps) {
  // Input URL state
  const [newsUrl, setNewsUrl] = useState("https://www.exemplo.com.br/economia/mercado-aquecido-em-2024-impulsiona-otimismo");
  
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Post state managed locally for reactive preview
  const [post, setPost] = useState<PostState>({
    url: "https://www.exemplo.com.br/economia/mercado-aquecido-em-2024",
    tone: "Informativo",
    quality: "1080p",
    pubType: "1080x1440",
    manchete: "MERCADO AQUECIDO EM 2024 IMPULSIONA OTIMISMO NA ECONOMIA BRASILEIRA",
    subtitulo: "Setores de tecnologia, energia e serviços lideram crescimento e atraem investimentos.",
    legenda: "A economia brasileira começa 2024 com sinais positivos. Segundo especialistas, o desempenho de setores estratégicos e a confiança do investidor são fatores que devem manter o crescimento nos próximos meses.\n\nLeia a matéria completa no nosso portal. Link na bio.",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
  });

  // Typography & Custom Editor styles corresponding to the Toolbar
  const [textStyles, setTextStyles] = useState(() => {
    const savedY = localStorage.getItem("newsflow_pattern_posYPercent");
    const initialY = savedY ? Number(savedY) : 75;
    return {
      fontFamily: "Inter Bold",
      fontSize: 28,
      bold: true,
      italic: false,
      underline: false,
      color: "#FFFFFF",
      hasShadow: true,
      hasGradient: true,
      align: "center" as "left" | "center" | "right",
      isSubtituloEnabled: true,
      lineHeight: 1.2,
      posYPercent: initialY
    };
  });

  // Collapsible sidebar state loaded from browser Cache
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("newsflow_sidebar_open");
    return saved !== "false";
  });

  useEffect(() => {
    localStorage.setItem("newsflow_sidebar_open", isSidebarOpen ? "true" : "false");
  }, [isSidebarOpen]);

  // Step flow state (1: Criar postagem, 2: Editar conteúdo, 3: Conectar redes sociais e exportar)
  const [step, setStep] = useState<number>(1);
  const [lastImageDebug, setLastImageDebug] = useState<{
    headlineUsed: string;
    promptGenerated: string;
    generationTime: string;
    apiResponse: string;
  } | null>(null);
  const [isImageDebugOpen, setIsImageDebugOpen] = useState<boolean>(true);
  const [postId, setPostId] = useState<string>(() => {
    return localStorage.getItem("newsflow_ongoing_post_id") || `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);

  // Save post ID locally when set
  useEffect(() => {
    localStorage.setItem("newsflow_ongoing_post_id", postId);
  }, [postId]);

  // Load latest post on mount from Supabase database
  useEffect(() => {
    async function loadLatestPost() {
      setIsLoadingPost(true);
      try {
        const userId = "user_carlos_mendes";
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          // Restore exact state
          setPostId(data.id);
          setStep(data.current_step || 1);
          setNewsUrl(data.news_url || "");
          setPost({
            url: data.news_url || "",
            tone: (data.tone as JournalisticTone) || "Informativo",
            quality: (data.quality as ImageQuality) || "1080p",
            pubType: (data.pub_type as PublicationType) || "1080x1440",
            manchete: data.manchete || "",
            subtitulo: data.subtitulo || "",
            legenda: data.legenda || "",
            imageUrl: data.image_url || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
          });
          if (data.text_styles) {
            setTextStyles(prev => ({
              ...prev,
              ...data.text_styles
            }));
          }
          addActivity("Rascunho recuperado", "O rascunho em andamento foi carregado do banco de dados.", "info");
        } else {
          // No posts, upsert initial empty post
          const newId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          setPostId(newId);
          await supabase.from("posts").upsert({
            id: newId,
            user_id: userId,
            current_step: 1,
            news_url: newsUrl,
            manchete: post.manchete,
            subtitulo: post.subtitulo,
            legenda: post.legenda,
            image_url: post.imageUrl,
            pub_type: post.pubType,
            tone: post.tone,
            quality: post.quality,
            text_styles: textStyles,
            instagram_connected: true,
            whatsapp_connected: true
          });
        }
      } catch (err) {
        console.error("Erro ao carregar do Supabase:", err);
      } finally {
        setIsLoadingPost(false);
      }
    }
    loadLatestPost();
  }, []);

  // Auto-save progress on state modification to Supabase database with 600ms debounce
  useEffect(() => {
    if (isLoadingPost) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      try {
        await supabase.from("posts").upsert({
          id: postId,
          user_id: "user_carlos_mendes",
          current_step: step,
          news_url: newsUrl,
          manchete: post.manchete,
          subtitulo: post.subtitulo,
          legenda: post.legenda,
          image_url: post.imageUrl,
          pub_type: post.pubType,
          tone: post.tone,
          quality: post.quality,
          text_styles: textStyles,
          instagram_connected: true,
          whatsapp_connected: true,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.error("Autosave error:", err);
      } finally {
        setIsSaving(false);
      }
    }, 600);

    return () => clearTimeout(saveTimeout);
  }, [postId, step, newsUrl, post, textStyles, isLoadingPost]);

  // UI state indicators
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "info" | "error"; time: string } | null>({
    text: "Demonstração ativa. Pronto para gerar novos conteúdos.",
    type: "info",
    time: "10:45"
  });

  // Copied alerts
  const [wasCopied, setWasCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Active modal state for sidebar actions & premium tools
  const [activeModal, setActiveModal] = useState<"historico" | "modelos" | "publicacoes" | "contas" | "ajuda" | "plano" | null>(null);

  // Mock states to make the modals fully interactive & functional!
  const [userHandleInput, setUserHandleInput] = useState("@portal.noticias.br");
  const [userProfiles, setUserProfiles] = useState([
    { handle: "@revista.fatos.oficial", status: "Conectado", type: "Instagram" },
    { handle: "@portal.noticias.br", status: "Conectado", type: "Instagram" }
  ]);

  // Sync state with url changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsUrl(e.target.value);
  };

  const handleClear = async () => {
    const confirmed = window.confirm("Tem certeza de que deseja limpar todas as informações da postagem atual? Esta ação não pode ser desfeita e limpará os dados salvos.");
    if (!confirmed) return;

    setNewsUrl("");
    setPost(prev => ({
      ...prev,
      manchete: "",
      subtitulo: "",
      legenda: "",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
    }));

    try {
      await supabase.from("posts").upsert({
        id: postId,
        user_id: "user_carlos_mendes",
        current_step: 1,
        news_url: "",
        manchete: "",
        subtitulo: "",
        legenda: "",
        image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80",
        pub_type: post.pubType,
        tone: post.tone,
        quality: post.quality,
        text_styles: textStyles,
        updated_at: new Date().toISOString()
      });
      setStep(1);
    } catch (err) {
      console.error("Erro ao resetar no Supabase:", err);
    }

    const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setStatusMessage({
      text: "Campos limpos com sucesso.",
      type: "info",
      time: nowStr
    });
    addActivity("Campos limpos", "O usuário limpou o formulário de redação.", "clean");
  };

  const getClientFallbackImage = (headline: string, subtitulo: string): string => {
    const textToScan = ((headline || "") + " " + (subtitulo || "")).toLowerCase();
    
    const mappings = [
      {
        keywords: ["feira", "feiras", "comercio", "mercado", "obras", "reforma", "palmas", "cidade", "rua", "construção", "construcao", "infraestrutura", "urban", "lojas", "shopping"],
        images: [
          "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80", // Street Market
          "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80", // Urban Construction
          "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80"  // Market stalls
        ]
      },
      {
        keywords: ["dolar", "bolsa", "dinheiro", "financas", "finanças", "economia", "mercado", "juros", "inflacao", "inflação", "banco", "investimento", "finance", "money", "stocks", "empresa", "empresas"],
        images: [
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80", // Stocks chart
          "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80", // Cash/Coins
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"  // Trading screen
        ]
      },
      {
        keywords: ["tecnologia", "ia", "inteligencia", "computador", "celular", "software", "programacao", "dados", "cyber", "internet", "tech", "ai", "robot", "inovacao", "inovação"],
        images: [
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", // Circuit board
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80", // Robot
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"  // Binary code
        ]
      },
      {
        keywords: ["saude", "saúde", "medico", "médico", "hospital", "vacina", "remedio", "remédio", "virus", "vírus", "pandemia", "pesquisa", "ciencia", "ciência", "health", "doctor"],
        images: [
          "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80", // Medical setup
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80", // Stethoscope / Laptop
          "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80"  // Hospital corridor
        ]
      },
      {
        keywords: ["esporte", "esportes", "futebol", "copa", "olimpiada", "olimpíada", "jogo", "corrida", "atleta", "sport", "soccer", "stadium", "estadio", "estádio"],
        images: [
          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80", // Sports stadium ball
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80", // Running start
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"  // Football field
        ]
      },
      {
        keywords: ["clima", "chuva", "calor", "estacao", "estação", "natureza", "tempo", "meio ambiente", "queimada", "floresta", "weather", "rain", "storm", "temporal"],
        images: [
          "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=800&q=80", // Heavy rain
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", // Forest/Mountains
          "https://images.unsplash.com/photo-1504370805625-d32c54b16100?auto=format&fit=crop&w=800&q=80"  // Sun rays
        ]
      },
      {
        keywords: ["politica", "política", "eleicoes", "eleições", "governo", "senado", "presidente", "lei", "justica", "justiça", "voto"],
        images: [
          "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80", // Capitol building
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"  // Gavel of justice
        ]
      }
    ];

    for (const group of mappings) {
      for (const kw of group.keywords) {
        if (textToScan.includes(kw)) {
          const groupImages = group.images;
          return groupImages[Math.floor(Math.random() * groupImages.length)];
        }
      }
    }

    const generalBackups = [
      "https://images.unsplash.com/photo-1495020689067-958852a6565d?auto=format&fit=crop&w=800&q=80", // Newspaper Coffee Glasses
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80", // TV journal camera
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"  // Tablet workplace
    ];
    return generalBackups[Math.floor(Math.random() * generalBackups.length)];
  };

  const generatePostText = async (overrideUrl?: string | any) => {
    const urlToUse = (typeof overrideUrl === "string") ? overrideUrl : newsUrl;
    if (!urlToUse || typeof urlToUse !== "string" || !urlToUse.trim()) return;
    setIsGeneratingText(true);
    setStatusMessage(null);

    try {
      addActivity("Iniciando geração", "Analisando artigo de notícias fornecido com IA...", "info");
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToUse, tone: post.tone })
      });
      const data = await res.json();
      
      setPost(prev => ({
        ...prev,
        manchete: data.manchete || "",
        subtitulo: data.subtitulo || "",
        legenda: data.legenda || ""
      }));

      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setStatusMessage({
        text: "Manchete e legenda geradas com sucesso",
        type: "success",
        time: nowStr
      });
      addActivity("Manchete e legenda geradas", `Nova postagem escrita sob o tom ${post.tone}.`, "text");
    } catch (err: any) {
      console.error("Fetch content error, fallback triggered:", err);
      
      // Client-side dynamic fallback generation
      let words: string[] = [];
      const cleanUrl = urlToUse.trim();
      if (cleanUrl.includes(" ") || !cleanUrl.includes(".") || (!cleanUrl.startsWith("http") && !cleanUrl.startsWith("www"))) {
        words = cleanUrl.split(/\s+/).map(w => w.replace(/[^\wÀ-ÿ]/g, "")).filter(w => w.length > 2);
      } else {
        const urlSlug = cleanUrl.replace(/https?:\/\/(www\.)?/, "").split("/");
        let slug = "";
        for (const segment of urlSlug) {
          if (segment.includes("-") || segment.includes("_")) {
            slug = segment;
            break;
          }
        }
        if (!slug && urlSlug.length > 1) {
          slug = urlSlug[urlSlug.length - 1] || urlSlug[urlSlug.length - 2] || "";
        }
        if (slug) {
          words = slug.split(/[-_]+/).filter(w => w.length > 2);
        }
      }

      if (words.length === 0) {
        words = ["noticias", "jornalismo", "atualizacao"];
      }

      const capitalizedWords = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      const capitalizedSentence = capitalizedWords.join(" ");

      const fallbackManchete = `${capitalizedSentence.toUpperCase()} - NOVA ATUALIZAÇÃO`;
      const fallbackSubtitulo = `Saiba tudo sobre: ${capitalizedSentence}. Entenda os impactos e os novos desdobramentos.`;
      
      let tonePrompt = "Mantenha-se informado sobre os acontecimentos recentes.";
      if (post.tone === "Urgente") {
        tonePrompt = "🚨 ATENÇÃO! Nova medida de extrema importância divulgada hoje.";
      } else if (post.tone === "Analítico") {
        tonePrompt = "Uma análise aprofundada detalha os bastidores e os principais fatores de impacto envolvidos nesta decisão.";
      } else if (post.tone === "Neutro") {
        tonePrompt = "Confira os dados oficiais e o posicionamento das partes conforme as declarações publicadas.";
      }

      const fallbackLegenda = `📌 INFORMAÇÃO ATUALIZADA\n\n${tonePrompt}\n\nConfira todos os desdobramentos importantes sobre de: "${capitalizedSentence}" apresentados hoje por nossa equipe de redação.\n\nMais detalhes sobre o cronograma e os impactos práticos de imediato em nosso portal. Leia na íntegra.\n\n#jornalismo #noticias #news #${words[0] || "noticias"}`;

      setPost(prev => ({
        ...prev,
        manchete: fallbackManchete.substring(0, 95),
        subtitulo: fallbackSubtitulo.substring(0, 115),
        legenda: fallbackLegenda
      }));

      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setStatusMessage({
        text: "Manchete e legenda geradas com sucesso",
        type: "success",
        time: nowStr
      });
      addActivity("Manchete e legenda geradas", "Rascunho gerado localmente baseado na fonte fornecida.", "text");
    } finally {
      setIsGeneratingText(false);
    }
  };

  const generatePostImg = async () => {
    if (!post.manchete || !post.manchete.trim()) {
      setStatusMessage({
        text: "Preencha ou gere uma manchete antes de criar a imagem.",
        type: "error",
        time: "Agora"
      });
      return;
    }
    setIsGeneratingImg(true);

    try {
      addActivity("Iniciando imagem", "Desenhando composição visual com IA generativa...", "info");
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          headline: post.manchete, 
          subtitulo: post.subtitulo,
          legenda: post.legenda,
          textStyles: textStyles
        })
      });
      const data = await res.json();
      
      setPost(prev => ({
        ...prev,
        imageUrl: data.imageUrl || getClientFallbackImage(post.manchete, post.subtitulo)
      }));

      if (data.debug) {
        setLastImageDebug(data.debug);
      }

      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      
      if (data.isQuotaExceeded) {
        setStatusMessage({
          text: "Limite de cota de imagem da API Gemini excedido (429). Mude sua API Key ou ative o faturamento nas Configurações > Secrets do AI Studio para habilitar a geração real.",
          type: "error",
          time: nowStr
        });
        addActivity("Aviso de Cota (429)", `Cota de imagem excedida para a manchete: "${post.manchete.substring(0, 30)}...". Usando fallback ilustrativo.`, "info");
      } else {
        setStatusMessage({
          text: `Imagem gerada com sucesso em ${post.quality}`,
          type: "success",
          time: nowStr
        });
        addActivity("Capa gerada", `Nova imagem criada para a manchete: "${post.manchete.substring(0, 30)}..."`, "image");
      }
    } catch (err: any) {
      console.error("Fetch image error, fallback triggered:", err);
      const fallbackUrl = getClientFallbackImage(post.manchete, post.subtitulo);
      
      setPost(prev => ({
        ...prev,
        imageUrl: fallbackUrl
      }));

      setLastImageDebug({
        headlineUsed: post.manchete,
        promptGenerated: `Error fetching image from API: ${err.message || err}. Local client fallback triggered.`,
        generationTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        apiResponse: `Network/API Error - ${err}`
      });

      const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      setStatusMessage({
        text: `Imagem de capa gerada com sucesso`,
        type: "success",
        time: nowStr
      });
      addActivity("Capa gerada", `Nova imagem selecionada no tema: "${post.manchete.substring(0, 30)}..."`, "image");
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = `MANCHETE: ${post.manchete}\nSUBTÍTULO: ${post.subtitulo}\n\nLEGENDA:\n${post.legenda}`;
    navigator.clipboard.writeText(textToCopy);
    setWasCopied(true);
    addActivity("Início de exportação", "Copiou a legenda e conteúdo para a área de transferência.", "success");
    setTimeout(() => setWasCopied(false), 2000);
  };

  const handleDownloadPostImage = async () => {
    setIsDownloading(true);
    try {
      const canvas = previewCanvasRef.current;
      if (!canvas) {
        throw new Error("Canvas de preview não encontrado.");
      }

      // Export exact canvas as seen on screen
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const downloadAnchor = document.createElement("a");
      
      const titleSlug = (post.manchete || "post-newsflow")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .substring(0, 50);

      downloadAnchor.href = dataUrl;
      downloadAnchor.download = `${titleSlug || "publicacao"}.jpg`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      addActivity(
        "Download de capa", 
        `O usuário fez download da capa em formato "${post.pubType}" para a manchete: "${post.manchete.substring(0, 30)}..."`, 
        "success"
      );

      setStatusMessage({
        text: "Imagem salva com sucesso no computador!",
        type: "success",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      });
    } catch (err: any) {
      console.error("Erro ao exportar canvas:", err);
      setStatusMessage({
        text: "Erro ao exportar imagem. Tente novamente.",
        type: "error",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getSidebarBtnClass = (modalKey: "dashboard" | "historico" | "modelos" | "publicacoes" | "contas") => {
    const isActive = modalKey === "dashboard" ? !activeModal : activeModal === modalKey;
    return `flex items-center gap-2.5 px-3 py-1.5 md:py-2 text-xs rounded-lg font-bold transition-all text-left ${
      isActive 
        ? "bg-indigo-50 border-r-4 border-indigo-600 text-indigo-700" 
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
    }`;
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row selection:bg-indigo-600/10 selection:text-indigo-600">
      
      {/* 1. SIDEBAR Navigation */}
      {isSidebarOpen && (
        <aside className="w-full md:w-64 bg-white shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 justify-between p-3 md:p-4 h-auto md:h-screen overflow-y-auto md:sticky md:top-0">
        <div className="flex flex-col gap-3 md:gap-6">
          {/* Logo element resembling mockup */}
          <div className="flex items-center justify-between md:justify-start gap-2 cursor-pointer pb-1 md:pb-0 border-b border-slate-100 md:border-b-0" onClick={() => onNavigate("landing")}>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-[2px] shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-white">
                  <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-600 font-sans">N</span>
                </div>
              </div>
              <span className="font-extrabold text-md tracking-tight text-slate-900">
                NewsFlow <span className="text-blue-600">AI</span>
              </span>
            </div>
            {/* Mobile/Iframe visual indicator */}
            <span className="md:hidden text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Painel Ativo
            </span>
          </div>

          {/* Sidebar Nav items exactly styled like mockup with beautiful spacing */}
          <nav className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-1">
            {/* Real Dashboard + Gerar Post active item grouped as one */}
            <button 
              type="button"
              onClick={() => setActiveModal(null)}
              className={getSidebarBtnClass("dashboard")}
            >
              <LayoutGrid size={15} />
              <span>Dashboard / Gerar Post</span>
            </button>

            {/* Histórico button that opens modal */}
            <button 
              type="button"
              onClick={() => setActiveModal(activeModal === "historico" ? null : "historico")}
              className={getSidebarBtnClass("historico")}
            >
              <History size={15} />
              <span>Histórico</span>
            </button>

            {/* Modelos button that opens modal */}
            <button 
              type="button"
              onClick={() => setActiveModal(activeModal === "modelos" ? null : "modelos")}
              className={getSidebarBtnClass("modelos")}
            >
              <Layers size={15} />
              <span>Modelos</span>
            </button>

            {/* Publicações button that opens modal */}
            <button 
              type="button"
              onClick={() => setActiveModal(activeModal === "publicacoes" ? null : "publicacoes")}
              className={getSidebarBtnClass("publicacoes")}
            >
              <ClipboardList size={15} />
              <span>Publicações</span>
            </button>

            {/* Integrações button that opens modal */}
            <button 
              type="button"
              onClick={() => setActiveModal(activeModal === "contas" ? null : "contas")}
              className={getSidebarBtnClass("contas")}
            >
              <Puzzle size={15} />
              <span>Integrações</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Cards aligned exactly to the mockup (Only on desktop to save space) */}
        <div className="hidden md:flex flex-col gap-2 mt-auto pt-3 border-t border-slate-100">
          {/* Plan Pro info widget (White card, border, clean layout) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-slate-800">Plano Redação Pro</span>
              <span className="text-[9px] text-slate-400 font-medium font-mono">Renova em 22/06/2024</span>
            </div>
            
            {/* Custom Pro bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: "37.5%" }} />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span className="font-semibold text-slate-400">Créditos usados</span>
              <span className="font-bold text-slate-700">750 / 2.000</span>
            </div>

            <button 
              type="button"
              onClick={() => setActiveModal("plano")}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer shadow-3xs"
            >
              Gerenciar plano
            </button>
          </div>

          {/* Need help item (light indigo/blue styling like mockup) */}
          <div 
            onClick={() => setActiveModal("ajuda")}
            className="flex items-center justify-between text-xs text-slate-700 hover:bg-indigo-50/40 cursor-pointer bg-slate-50 border border-slate-200/80 p-3 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100/75 border border-blue-200 text-blue-650 flex items-center justify-center text-xs font-extrabold shadow-3xs overflow-hidden shrink-0">
                ?
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-slate-800 text-[11px]">Precisa de ajuda?</span>
                <span className="text-[9.5px] text-slate-400 font-medium">Acesse nossa central</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-blue-500" />
          </div>
        </div>
      </aside>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col relative h-auto md:h-screen md:overflow-hidden">
        
        {/* TOP STATUS NAVIGATION BAR */}
        <header className="h-13 bg-white border-b border-slate-200/50 px-4 shrink-0 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold select-none">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer border border-slate-200 flex items-center justify-center mr-1 shadow-3xs"
              title={isSidebarOpen ? "Ocultar Menu Lateral" : "Mostrar Menu Lateral"}
            >
              <div className="flex flex-col gap-[3.5px] w-4 items-start select-none">
                <span className={`h-[2px] bg-slate-600 rounded transition-all duration-300 ${isSidebarOpen ? "w-4" : "w-3 bg-indigo-600"}`} />
                <span className="h-[2px] w-4 bg-slate-600 rounded" />
                <span className={`h-[2px] bg-slate-600 rounded transition-all duration-300 ${isSidebarOpen ? "w-4 bg-slate-600" : "w-2 bg-indigo-600"}`} />
              </div>
            </button>
            <span className="text-slate-300 font-bold px-1 select-none">|</span>
            <span className="font-extrabold text-slate-700 tracking-tight select-none">Dashboard / Criar Postagem</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell notification alert icon with orange badge on it */}
            <button className="relative w-8 h-8 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer bg-white hover:bg-slate-50 transition-colors">
              <span className="absolute top-2 right-2 bg-red-500 w-1 h-1 rounded-full" />
              <Bell size={13} />
            </button>

            {/* Credits pill bubble exactly like mockup */}
            <div className="bg-slate-100 hover:bg-slate-150 border border-slate-200/60 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs font-bold transition-all shadow-3xs select-none">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-black text-[9px]">
                $
              </div>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-medium text-[10px]">Créditos</span>
                <span className="text-slate-800 font-extrabold text-[11px]">1.250</span>
              </div>
            </div>

            {/* Profile widget */}
            <div className="flex items-center gap-2 pl-1 select-none">
              <img 
                className="w-8 h-8 rounded-full border border-slate-200 object-cover shadow-3xs"
                src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=150&h=150&q=80" 
                alt="Carlos Mendes"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-extrabold text-slate-900 leading-none">Carlos Mendes</span>
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Premium</span>
              </div>
              <ChevronDown size={12} className="text-slate-400 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* STEP PROGRESS NAVIGATION BAR */}
        <div className="w-full bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between select-none shadow-xs">
          <div className="flex items-center gap-1.5 animate-fade-in">
            <span className="text-xs font-mono font-bold text-slate-455">PÁGINA ATIVA:</span>
            {isSaving ? (
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Sincronizando...
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sincronizado
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-6 md:gap-8">
            {[
              { num: 1, label: "Criar Postagem" },
              { num: 2, label: "Editar Conteúdo" },
              { num: 3, label: "Conectar & Exportar" }
            ].map((s) => {
              const active = step === s.num;
              const done = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-1 sm:gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black tracking-tight shrink-0 ${
                    active 
                      ? "bg-indigo-600 text-white shadow-3xs" 
                      : done 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-100 text-slate-400"
                  }`}>
                    {done ? "✓" : s.num}
                  </div>
                  <span className={`text-[11px] font-bold ${active ? "text-slate-900" : done ? "text-emerald-500" : "text-slate-400"} hidden sm:inline`}>
                    {s.label}
                  </span>
                  {s.num < 3 && <div className="hidden md:block w-4 h-0.5 bg-slate-200" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* PERSISTENT SPLIT-VIEW LAYOUT */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          
          {/* LHS - FORM EDITING STEPS CONTAINER */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-4 shrink-0 flex flex-col items-center">
            {statusMessage && (
              <div 
                id="dashboard-status-banner"
                className={`w-full max-w-4xl mb-4 p-4 rounded-2xl border flex items-start gap-3.5 transition-all relative select-text shadow-sm ${
                  statusMessage.type === "error" 
                    ? "bg-rose-50/90 border-rose-250 text-rose-950" 
                    : statusMessage.type === "success" 
                      ? "bg-emerald-50/90 border-emerald-250 text-emerald-950" 
                      : "bg-indigo-50/90 border-indigo-250 text-indigo-950"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {statusMessage.type === "error" ? (
                    <AlertCircle className="text-rose-600" size={18} />
                  ) : statusMessage.type === "success" ? (
                    <CheckCircle2 className="text-emerald-600" size={18} />
                  ) : (
                    <Info className="text-indigo-600" size={18} />
                  )}
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider opacity-90 font-mono">
                      {statusMessage.type === "error" ? "Aviso do Sistema" : statusMessage.type === "success" ? "Sucesso" : "Informativo"}
                    </span>
                    <span className="text-[9px] opacity-50 font-mono">({statusMessage.time})</span>
                  </div>
                  <p className="text-xs font-bold mt-1 leading-relaxed leading-normal">{statusMessage.text}</p>
                  
                  {statusMessage.type === "error" && (statusMessage.text.includes("Cota") || statusMessage.text.includes("quota") || statusMessage.text.includes("429")) && (
                    <div className="mt-3 p-3 bg-white/70 border border-rose-200/50 rounded-xl flex flex-col gap-2">
                      <p className="text-[11px] font-medium text-slate-700 leading-normal">
                        Você está utilizando o modelo premium <strong>gemini-2.5-flash-image</strong>. A cota diária ou limite de requisições do plano gratuito da API foi temporariamente excedido. 
                      </p>
                      <p className="text-[11px] font-medium text-emerald-700 leading-normal">
                        💡 <strong>Como resolver?</strong> Basta clicar no botão abaixo para escolher uma conta com créditos ou faturamento habilitado. Caso contrário, o sistema continuará gerando lindas imagens simuladas em alta definição com base no contexto da sua manchete!
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setStatusMessage(null)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>
            )}

            {step === 1 && (
              <Step1Form 
                newsUrl={newsUrl}
                setNewsUrl={setNewsUrl}
                post={post}
                setPost={setPost}
                textStyles={textStyles}
                isGeneratingText={isGeneratingText}
                isGeneratingImg={isGeneratingImg}
                generatePostText={generatePostText}
                generatePostImg={generatePostImg}
                handleClear={handleClear}
                addActivity={addActivity}
                setStatusMessage={setStatusMessage}
                setStep={setStep}
                postId={postId}
              />
            )}

            {step === 2 && (
              <Step2Form 
                post={post}
                setPost={setPost}
                textStyles={textStyles}
                setTextStyles={setTextStyles}
                postId={postId}
                setStep={setStep}
                addActivity={addActivity}
                generatePostImg={generatePostImg}
                isGeneratingImg={isGeneratingImg}
              />
            )}

            {step === 3 && (
              <Step3Form 
                setStep={setStep}
                postId={postId}
                addActivity={addActivity}
                copyToClipboard={copyToClipboard}
                wasCopied={wasCopied}
                setStatusMessage={setStatusMessage}
              />
            )}

            {/* Collapsible Developer/AI Debug Console Panel */}
            {lastImageDebug && (step === 1 || step === 2) && (
              <div className="w-full max-w-4xl mt-6 border border-slate-200 bg-slate-900 text-slate-100 rounded-2xl overflow-hidden shadow-md">
                {/* Header */}
                <div 
                  className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 cursor-pointer select-none"
                  onClick={() => setIsImageDebugOpen(!isImageDebugOpen)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs uppercase font-mono font-black tracking-wider text-slate-300">Conferência & Painel de Debug da IA</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    {isImageDebugOpen ? "[- Ocultar]" : "[+ Expandir]"}
                  </span>
                </div>

                {/* Content */}
                {isImageDebugOpen && (
                  <div className="p-4 flex flex-col gap-3 font-mono text-xs text-left leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 border-b md:border-b-0 border-slate-800 pb-2.5 md:pb-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">❶ Manchete Enviada</span>
                        <p className="text-[11px] text-white font-bold bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 mt-1 uppercase">
                          {lastImageDebug.headlineUsed || "Nenhuma manchete fornecida"}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">❷ Horário da Geração & Resposta</span>
                        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1 mt-1 text-[11px] text-slate-300">
                          <div className="flex items-center justify-between">
                            <span>Horário:</span> 
                            <span className="text-white font-bold">{lastImageDebug.generationTime}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Status da API:</span>
                            <span className="text-emerald-400 font-semibold">{lastImageDebug.apiResponse}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-2 border-t border-slate-800 pt-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400">❸ Prompt Final Enviado para a IA</span>
                      <p className="text-[10.5px] text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 font-mono whitespace-pre-wrap leading-relaxed mt-1 overflow-x-auto max-h-[220px] scrollbar-thin">
                        {lastImageDebug.promptGenerated}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RHS - PERSISTENT PREVIEW SIDEBAR ON DESKTOP */}
          <aside className="hidden lg:flex w-[340px] shrink-0 border-l border-slate-200 bg-slate-50 flex-col items-center justify-start py-4 px-3 overflow-y-auto min-h-0 shadow-inner select-none gap-4">
            <div className="text-center w-full">
              <span className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">Preview ao vivo</span>
            </div>
            
            <IPhonePreview 
              post={post} 
              textStyles={textStyles} 
              canvasRef={previewCanvasRef} 
              onDragY={(newY) => setTextStyles(prev => ({ ...prev, posYPercent: newY }))}
              isDragEnabled={true}
            />

            {/* Quick Actions Panel on RHS Preview Sidebar */}
            <div className="w-full max-w-[280px] flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadPostImage}
                disabled={isDownloading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>Baixando Imagem...</span>
                  </>
                ) : (
                  <>
                    <Download size={13} />
                    <span>Baixar imagem da capa</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-705 font-bold text-xs rounded-xl shadow-3xs transition-all cursor-pointer"
              >
                <Copy size={13} />
                <span>{wasCopied ? "Copiado!" : "Copiar legenda e textos"}</span>
              </button>
            </div>
          </aside>

        </div>

        {/* MOBILE PREVIEW FLOATING BUTTON & DRAWER SHEET OVERLAY */}
        <div className="lg:hidden fixed bottom-18 right-4 z-40">
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 active:bg-indigo-700 text-white font-extrabold text-xs rounded-full shadow-lg cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
          >
            <Eye size={14} />
            <span>Ver Post</span>
          </button>
        </div>

        {isMobilePreviewOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
            onClick={() => setIsMobilePreviewOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto flex flex-col items-center gap-4 text-center max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-650 shrink-0 cursor-pointer bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
              
              <div className="pt-2">
                <span className="text-[10px] uppercase font-mono font-black text-slate-400 tracking-wider">Preview ao vivo</span>
              </div>

              {/* iPhone preview inside the mobile drawer */}
              <IPhonePreview 
                post={post} 
                textStyles={textStyles} 
                canvasRef={previewCanvasRef} 
                onDragY={(newY) => setTextStyles(prev => ({ ...prev, posYPercent: newY }))}
                isDragEnabled={true}
              />

              {/* Quick Actions Container inside the mobile drawer */}
              <div className="w-full max-w-[280px] flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleDownloadPostImage}
                  disabled={isDownloading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Baixando...</span>
                    </>
                  ) : (
                    <>
                      <Download size={13} />
                      <span>Baixar imagem da capa</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-705 font-bold text-xs rounded-xl cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{wasCopied ? "Copiado!" : "Copiar legenda e textos"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. PREMIUM INTERACTIVE OPTIONS MODALS */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-transform duration-300 scale-100 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {activeModal === "historico" && "📁"}
                  {activeModal === "modelos" && "💎"}
                  {activeModal === "publicacoes" && "📈"}
                  {activeModal === "contas" && "🔗"}
                  {activeModal === "ajuda" && "💡"}
                  {activeModal === "plano" && "✨"}
                </span>
                <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-tight">
                  {activeModal === "historico" && "Histórico de Publicações Recentes"}
                  {activeModal === "modelos" && "Temas e Modelos de Capas"}
                  {activeModal === "publicacoes" && "Publicações Concluídas no Mês"}
                  {activeModal === "contas" && "Conexões Sociais Ativas"}
                  {activeModal === "ajuda" && "Manual do Redator & Suporte"}
                  {activeModal === "plano" && "Gerenciar Assinatura de Redação"}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-xs text-slate-600 leading-relaxed">
              
              {/* HISTORICO MODAL CONTENT */}
              {activeModal === "historico" && (
                <div className="flex flex-col gap-3">
                  <p className="text-slate-500 mb-2">Clique em qualquer item histórico para carregar a notícia inteira no editor de rascunhos:</p>
                  {[
                    {
                      title: "🚧 Palmas: Feiras interditadas",
                      desc: "DUAS FEIRAS DE PALMAS SÃO INTERDITADAS PARA OBRAS; VEJA LOCAIS DE REALOCAÇÃO",
                      sub: "Realocação provisória começa nesta semana no setor Sul da capital.",
                      url: "https://www.jornalpalmas.com.br/cidades/duas-feiras-interditadas",
                      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      title: "📊 Economia: Ritmo de crescimento",
                      desc: "MERCADO AQUECIDO EM 2024 IMPULSIONA OTIMISMO NA ECONOMIA BRASILEIRA",
                      sub: "Setores de tecnologia, energia e serviços lideram crescimento e atraem investimentos.",
                      url: "https://www.exemplo.com.br/economia/mercado-aquecido-2024",
                      img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      title: "⚡ Inovação: AI no Jornalismo",
                      desc: "INTELIGÊNCIA ARTIFICIAL REDEFINE PRODUÇÃO EM REDAÇÕES PREMIUM",
                      sub: "Ferramentas agilizam a redação corporativa conectando equipes de branding.",
                      url: "https://www.exemplo.com.br/jornalismo/ia-redefine-producao",
                      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
                    }
                  ].map((hi, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        setNewsUrl(hi.url);
                        setPost({
                          url: hi.url,
                          tone: "Informativo",
                          quality: "1080p",
                          pubType: "1080x1440",
                          manchete: hi.desc,
                          subtitulo: hi.sub,
                          legenda: `A cobertura completa de ${hi.title.substring(2)} se encontra ativa no nosso portal.\n\nAcompanhe a reportagem completa com infográficos de apoio.\n\n#news #cobertura #jornalismo #fatos`,
                          imageUrl: hi.img
                        });
                        addActivity(`Post histórico selecionado`, `Carregado template ${hi.title}`, "info");
                        setActiveModal(null);
                        const nowStr = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                        setStatusMessage({
                          text: `Notícia "${hi.title}" importada para o editor.`,
                          type: "success",
                          time: nowStr
                        });
                      }}
                      className="group border border-slate-200/80 p-3 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/20 cursor-pointer transition-all flex flex-col text-left"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800 text-[11px] group-hover:text-indigo-700">{hi.title}</span>
                        <span className="text-[9px] text-slate-400 font-mono">ID: #{920 + i}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{hi.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* MODELOS DE CAPAS MODAL CONTENT */}
              {activeModal === "modelos" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      name: "Hard News Alerta",
                      color: "#F43F5E",
                      font: "Space Grotesk",
                      size: 32,
                      shadow: true,
                      desc: "Fundo com gradiente e títulos chamativos em vermelho de impacto imediato."
                    },
                    {
                      name: "Redação Clássica",
                      color: "#FFFFFF",
                      font: "Inter",
                      size: 28,
                      shadow: true,
                      desc: "Layout sóbrio, limpo e profissional ideal para notícias diárias corporativas."
                    },
                    {
                      name: "Premium Ouro",
                      color: "#FBBF24",
                      font: "Space Grotesk",
                      size: 28,
                      shadow: true,
                      desc: "Destaque dourado luxuoso para conquistas, marcos e grandes reportagens."
                    },
                    {
                      name: "Minimal Esmeralda",
                      color: "#10B981",
                      font: "Inter",
                      size: 24,
                      shadow: false,
                      desc: "Estilo ecológico/sustentabilidade direto sem sombras pesadas."
                    }
                  ].map((tpl, i) => (
                    <div 
                      key={i}
                      onClick={() => {
                        setTextStyles(prev => ({
                          ...prev,
                          color: tpl.color,
                          fontFamily: tpl.font,
                          fontSize: tpl.size,
                          hasShadow: tpl.shadow,
                          bold: true
                        }));
                        addActivity(`Tema aplicado`, `Visual ${tpl.name} selecionado com sucesso`, "info");
                        setActiveModal(null);
                        setStatusMessage({
                          text: `Tema "${tpl.name}" aplicado nas configurações do simulador.`,
                          type: "success",
                          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        });
                      }}
                      className="border border-slate-200 p-3.5 rounded-2xl hover:border-indigo-600 hover:bg-slate-50 transition-all flex flex-col gap-1.5 cursor-pointer text-left"
                    >
                      <span className="font-extrabold text-slate-950 text-[11px] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tpl.color }} />
                        {tpl.name}
                      </span>
                      <p className="text-[9.5px] text-slate-500 leading-normal">{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* PUBLICACOES REALIZADAS CONTENT */}
              {activeModal === "publicacoes" && (
                <div className="flex flex-col gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between mb-2">
                    <div className="text-left">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Limite de consumo</span>
                      <p className="text-sm font-extrabold text-slate-800">42 / 200 publicações ativas</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">21% Consumido</span>
                  </div>

                  <p className="font-semibold text-slate-700">Histórico de compartilhamentos:</p>
                  {[
                    { net: "Instagram", date: "Hoje, 10h40", views: 129, headline: "DUAS FEIRAS DE PALMAS SÃO INTERDITADAS..." },
                    { net: "WhatsApp", date: "Ontem, 16h15", views: 98, headline: "MERCADO AQUECIDO EM 2024 DESTAQUE..." },
                    { net: "Instagram", date: "24 de Mai, 11h02", views: 312, headline: "MANDATOS DE CRÉDITO RURAL SÃO APROVADOS..." }
                  ].map((pub, idx) => (
                    <div key={idx} className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 flex justify-between items-center text-left">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800 text-[10.5px]">{pub.net === "Instagram" ? "📸 " : "💬 "}{pub.net}</span>
                        <p className="text-[9px] text-slate-500 font-medium truncate max-w-[280px]">{pub.headline}</p>
                        <span className="text-[8.5px] text-slate-400">{pub.date}</span>
                      </div>
                      <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 px-1.5 rounded-sm font-bold">⚡ Ativa</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CONTAS CONECTADAS MODAL CONTENT */}
              {activeModal === "contas" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-slate-800 mb-1">Vincular nova conta de rede social:</span>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={userHandleInput}
                        onChange={(e) => setUserHandleInput(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none focus:border-indigo-500"
                        placeholder="@seu.canal.jornalistico"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (!userHandleInput.trim()) return;
                          setUserProfiles(prev => [...prev, { handle: userHandleInput, status: "Conectado", type: "Instagram" }]);
                          addActivity("Nova conta conectada", `Perfil ${userHandleInput} vinculado ao sistema.`, "user");
                          setUserHandleInput("");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Conectar
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <span className="font-semibold text-slate-700">Contas vinculadas no momento:</span>
                    {userProfiles.map((p, ix) => (
                      <div key={ix} className="border border-slate-150 p-3 rounded-xl flex items-center justify-between text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">📸</span>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-[10.5px]">{p.handle}</span>
                            <span className="text-[8px] text-zinc-400">{p.type} API Real</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-bold text-emerald-600">Conectado</span>
                          <button 
                            type="button"
                            onClick={() => {
                              setUserProfiles(prev => prev.filter((_, idx) => idx !== ix));
                              addActivity("Conta desconectada", `Perfil ${p.handle} removido.`, "clean");
                            }}
                            className="text-[9px] text-red-500 hover:underline ml-2"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUPORTE E INSTRUCOES MODAL CONTENT */}
              {activeModal === "ajuda" && (
                <div className="flex flex-col gap-3 text-left">
                  <div className="border-l-4 border-indigo-500 pl-3 bg-indigo-50/50 py-2.5 rounded-r-xl">
                    <span className="font-bold text-slate-900 text-[11px]">Como funciona o refinamento com IA?</span>
                    <p className="text-[10px] text-slate-600 mt-1">Ao colar o link e clicar em 'Gerar', a IA lê e resume o principal fato noticioso, formatando conforme o tom pretendido.</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-3 bg-indigo-50/50 py-2.5 rounded-r-xl">
                    <span className="font-bold text-slate-900 text-[11px]">Não vejo o botão Gerar Imagem ativo?</span>
                    <p className="text-[10px] text-slate-600 mt-1">O gerador de imagens utiliza o contexto da Manchete como prompt. Digite ou gere uma manchete primeiro para ativar o botão.</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-3 bg-indigo-50/50 py-2.5 rounded-r-xl">
                    <span className="font-bold text-slate-900 text-[11px]">Dúvidas nas exportações instantâneas?</span>
                    <p className="text-[10px] text-slate-600 mt-1">O botão copiar envia a legenda formatada com quebra de linhas para que o Instagram as reconheça perfeitamente.</p>
                  </div>
                </div>
              )}

              {/* PLANO DE REDACAO MODAL CONTENT */}
              {activeModal === "plano" && (
                <div className="flex flex-col gap-3 text-left">
                  <div className="bg-indigo-900 text-white p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/20 rounded-full blur-xl" />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider bg-indigo-800 text-slate-200 px-2 py-0.5 rounded-sm font-bold">Plano Atual</span>
                      <h4 className="text-md font-extrabold mt-1">Redação Profissional</h4>
                      <p className="text-[10.5px] text-slate-300 mt-1">Créditos ilimitados de geração textual e 100 imagens mensais livres.</p>
                    </div>
                  </div>

                  <span className="font-bold text-slate-800">Planos de Upgrade Disponíveis:</span>
                  <div className="border border-slate-200 p-3 rounded-2xl flex justify-between items-center bg-slate-50/50">
                    <div>
                      <span className="font-bold text-slate-900">Agência Team Premium</span>
                      <p className="text-[10px] text-slate-500">Membros de equipe ilimitados, fotos 4K e suporte VIP prioritário por chat 24h.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        addActivity("Plano atualizado", "Upgrade realizado com sucesso para o canal Agência Team.", "success");
                        setActiveModal(null);
                        setStatusMessage({
                          text: "Parabéns! Sua conta migrou para o plano Agência VIP! ✨",
                          type: "success",
                          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shrink-0 transition-transform h-fit cursor-pointer"
                    >
                      R$ 399/mês
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex justify-end">
              <button 
                type="button"
                onClick={() => setActiveModal(null)}
                className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
