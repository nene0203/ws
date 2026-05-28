import React from "react";
import { View, PlatformPlan } from "../types";
import { 
  Link2, Sparkles, Feather, Image, Eye, Share2, Sliders, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Laptop, Users, MessageSquareCode, Globe
} from "lucide-react";

interface LandingViewProps {
  onNavigate: (view: View) => void;
  plans: PlatformPlan[];
  userRole?: string;
}

export default function LandingView({ onNavigate, plans, userRole }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans selection:bg-indigo-600/10 selection:text-indigo-600">
      
      {/* 1. Header Banner */}
      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex h-16 items-center justify-between border-b border-slate-200/50 bg-white/70 backdrop-blur-md px-6 rounded-2xl shadow-xs">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("landing")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-pink-500 to-indigo-600 p-[2.5px] shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-white">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-pink-500 font-mono">N</span>
              </div>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-950">NewsFlow <span className="text-indigo-600">AI</span></span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Recursos</a>
            <button onClick={() => onNavigate("dashboard")} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</button>
            <a href="#planos" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Planos</a>
            <button onClick={() => onNavigate("admin")} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Admin</button>
          </div>

          {/* Sign In & CTA */}
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("dashboard")} className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Entrar</button>
            <button 
              onClick={() => onNavigate("dashboard")} 
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-bold shadow-md shadow-indigo-600/10 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Começar agora <ArrowRight size={14} />
            </button>
          </div>
        </nav>
      </header>

      {/* 2. Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start gap-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1 text-xs font-semibold text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              FEITO PARA JORNALISTAS
            </div>

            {/* Main Typographic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-sans leading-[1.1]">
              Transforme qualquer notícia em um post pronto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600">Instagram</span> e <span className="text-emerald-500 border-b-4 border-emerald-500/15">WhatsApp</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-md sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Cole o link da notícia, gere manchete, legenda e imagem com IA e visualize tudo em um mockup real de smartphone antes de publicar de forma instantânea.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={() => onNavigate("dashboard")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 text-md font-bold shadow-lg shadow-indigo-600/10 transition-all active:scale-95 cursor-pointer"
              >
                Começar agora <ArrowRight size={16} />
              </button>
              <a 
                href="#planos"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 px-6 py-3.5 text-md font-bold text-slate-700 transition-all cursor-pointer"
              >
                Ver planos
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-6 border-t border-slate-200 w-full mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>IA treinada para jornalismo</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>Conteúdo original seguro</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                <span>Agilidade na redação</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Column - Layout Mockup preview */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="absolute -inset-4 rounded-3xl bg-indigo-500/5 blur-3xl" />
            
            {/* Overlap Graphics representation of Dashboard and iPhone */}
            <div className="relative w-full max-w-[500px] aspect-[4/3] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80 p-4 shrink-0 flex gap-4 bg-gradient-to-br from-white to-slate-50/50">
              
              {/* Dummy sidebar representation */}
              <div className="w-[100px] border-r border-slate-100 flex flex-col gap-3 pr-3">
                <div className="h-5 w-full bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-4 w-5/6 bg-indigo-50 rounded text-indigo-700 text-[8px] font-bold p-1 flex items-center">● Dashboard</div>
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
              </div>

              {/* Dummy main content representation */}
              <div className="flex-1 flex flex-col gap-3 justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Post Generator</span>
                  <div className="h-6 w-full bg-slate-100 rounded-lg flex items-center px-1.5 text-[8px] text-slate-400 font-mono truncate">
                    https://www.exemplo.com.br/economia/mercado...
                  </div>
                </div>

                {/* Simulated action content result */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-1.5">
                  <div className="text-[8px] font-bold text-slate-700">MERCADO AQUECIDO EM 2024 DESTAQUE...</div>
                  <div className="text-[7px] text-slate-500 line-clamp-2 leading-relaxed">
                    Setores de tecnologia lideram o desenvolvimento econômico do país no período recente com fortes investimentos.
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate("dashboard")} 
                  className="bg-indigo-600 text-white rounded-lg py-2 text-[9px] font-bold hover:bg-indigo-700 transition-colors"
                >
                  Ver no editor interativo
                </button>
              </div>

              {/* Side Floating iPhone Miniature Graphic */}
              <div className="absolute right-3 -bottom-4 w-[125px] h-[230px] bg-slate-900 rounded-[24px] border-[4px] border-slate-950 shadow-2xl overflow-hidden flex flex-col">
                <div className="h-2 w-12 bg-black rounded-full mx-auto mt-1" />
                <div className="flex-1 bg-black p-1.5 flex flex-col justify-between">
                  <div className="aspect-[4/3] bg-slate-800 rounded-md relative overflow-hidden flex items-end p-1">
                    <img 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.5]" 
                      src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=150&q=80" 
                      alt="News Preview"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[5px] font-bold text-white relative leading-tight">MERCADO AQUECIDO EM 2024...</span>
                  </div>
                  <div className="h-10 bg-slate-900 rounded p-1 text-[4px] text-slate-400 leading-normal line-clamp-3">
                    A economia começa com ritmos crescentes, conforme explicam especialistas.
                  </div>
                  <div className="h-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded flex items-center justify-center text-[5px] font-bold text-white uppercase">
                    Exportado
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. Features Cards Grid */}
      <section id="recursos" className="bg-white border-y border-slate-200/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Recursos Poderosos para Agência e Mídia</h2>
            <p className="text-md text-slate-600 mt-3 leading-relaxed">
              O NewsFlow AI oferece as melhores ferramentas baseadas nos modelos de ponta do Google Gemini para transformar links simples em posts envolventes em segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Link2 size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Cole o link da notícia</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Basta colar o link de qualquer artigo ou portal de notícias de forma simples.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Nova manchete em segundos</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                A IA cria manchetes impactantes, sob medida para mídia social e engajamento rápido.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Feather size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Escreva legendas épicas</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Geração inteligente de descrições bem formatadas, emojis ideais e hashtags precisas.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Image size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Visual sob medida com IA</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Cria imagens exclusivas integradas perfeitamente ao tema da postagem com um clique.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Eye size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Insta & Whats Preview</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Veja o resultado final em tempo real antes de postar, por meio de um smartphone simulado.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Share2 size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Exportação fácil de 1 clique</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Copia de forma limpa a legenda estruturada, hashtags e faz download direto do mockup visual.
              </p>
            </div>

            {/* Card 7 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Sliders size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Controle total do tom</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Adequação de tom: urgente, informativo, analítico ou neutro, de acordo com o público.
              </p>
            </div>

            {/* Card 8 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 transition-colors">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-950">Qualidade de post 1080p</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Garantia de saída otimizada em redes sociais de forma limpa e em alta definição.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Steps Workflow section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-indigo-900 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-pink-500/20 to-indigo-500/30 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <span className="text-pink-400 text-xs font-bold uppercase tracking-wider">Como funciona na prática</span>
            <h2 className="text-3xl font-extrabold mt-2">Duas etapas simples para a publicação</h2>
            <p className="text-slate-300 text-sm mt-2">
              Basta seguir o fluxo natural de geração rápida, ajustando o texto e a composição final em tempo real.
            </p>
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            
            {/* Step 1 button item */}
            <div className="flex flex-col items-center text-center max-w-[260px]">
              <div className="flex w-12 h-12 items-center justify-center bg-indigo-800 rounded-full border border-indigo-700 text-md font-bold mb-3 shadow-md">
                1
              </div>
              <button 
                onClick={() => onNavigate("dashboard")}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 font-bold text-xs shadow-md shadow-indigo-950 cursor-pointer"
              >
                <Sparkles size={14} /> Gerar manchete e legenda
              </button>
              <p className="text-xs text-slate-300 mt-2.5">
                A IA analisa o link fornecido e escreve os posts ideais.
              </p>
            </div>

            {/* Transition indicator */}
            <div className="hidden md:block text-slate-400 rotate-90 md:rotate-0 text-xl font-bold">
              ➔
            </div>

            {/* Step 2 button item */}
            <div className="flex flex-col items-center text-center max-w-[260px]">
              <div className="flex w-12 h-12 items-center justify-center bg-emerald-950 rounded-full border border-emerald-900 text-md font-bold mb-3 shadow-md text-emerald-300">
                2
              </div>
              <button 
                onClick={() => onNavigate("dashboard")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-bold text-xs shadow-md shadow-emerald-950 cursor-pointer"
              >
                <Image size={14} /> Gerar imagem ilustrativa
              </button>
              <p className="text-xs text-slate-300 mt-2.5">
                A IA cria uma imagem de cobertura moderna para o plano.
              </p>
            </div>

          </div>
        </div>
      </section>

           {/* 5. Plans section */}
      <section id="planos" className="bg-slate-100/50 py-20 border-t border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Nossos Planos</span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-1">Preços simples para qualquer equipe</h2>
            <p className="text-slate-600 text-sm mt-3">
              Seja você um jornalista independente ou membro de uma grande agência de mídia, temos o plano perfeito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((pl, idx) => {
              const isPopular = pl.name === "Profissional" || pl.name === "Pró";
              return (
                <div 
                  key={pl.name}
                  className={`bg-white p-6 rounded-3xl border transition-all flex flex-col justify-between shadow-2xs hover:shadow-md relative ${
                    isPopular ? "border-indigo-600 ring-2 ring-indigo-600/10" : "border-slate-200"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                      Mais Popular
                    </span>
                  )}
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${
                      isPopular ? "text-indigo-600" : "text-slate-500"
                    }`}>
                      {pl.name}
                    </span>
                    <div className="text-3xl font-extrabold text-slate-950 mt-2">
                      {pl.price}
                      <span className="text-[11px] font-normal text-slate-500">/mês</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Acesso completo para sua redação.</p>
                    
                    <ul className="mt-5 space-y-2.5 text-slate-700 text-xs">
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600">✓</span> <strong>{pl.users}</strong> {Number(pl.users) === 1 ? "Usuário cadastrado" : "Usuários ativos"}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600">✓</span> <strong>{pl.posts}</strong> posts gerados/mês
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-emerald-600">✓</span> <strong>{pl.images}</strong> capa(s) com IA/mês
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={`${pl.resources === "Básicos" ? "text-slate-400" : "text-emerald-600"}`}>
                          {pl.resources === "Básicos" ? "✗" : "✓"}
                        </span> 
                        <span>Recursos {pl.resources}</span>
                      </li>
                      <li className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="text-indigo-500">✔</span> Mockup integrado & copy
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => onNavigate("dashboard")} 
                    className={`mt-6 py-2.5 rounded-xl text-center text-xs font-bold transition-all w-full cursor-pointer ${
                      isPopular 
                        ? "bg-indigo-600 hover:bg-slate-900 text-white shadow-md shadow-indigo-605/10" 
                        : "bg-slate-900 hover:bg-black text-white"
                    }`}
                  >
                    {pl.name === "Gratuito" ? "Começar Grátis" : `Assinar ${pl.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 text-slate-600 text-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 p-[2px]">
                <span className="font-extrabold text-white text-xs font-mono">N</span>
              </div>
              <span className="font-bold text-lg text-slate-950">NewsFlow AI</span>
            </div>
            <p className="text-xs text-slate-500 pr-12 leading-relaxed">
              A plataforma definitiva baseada em IA generativa sob medida para jornalistas e produtores de conteúdo de alta agilidade e rigor corporativo.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Produto</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate("dashboard")} className="hover:text-indigo-600 transition-colors">Recursos</button></li>
              <li><a href="#planos" className="hover:text-indigo-600 transition-colors">Planos</a></li>
              <li><button onClick={() => onNavigate("dashboard")} className="hover:text-indigo-600 transition-colors">Atualizações</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Sobre nós</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog oficial</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Política de privacidade</a></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} NewsFlow AI. Todos os direitos reservados.
          </p>
          
          <div className="flex gap-4">
            <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Twitter (X)</span>
            <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">LinkedIn</span>
            <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">Instagram</span>
            <span className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer">YouTube</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
