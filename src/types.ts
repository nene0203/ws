export type View = "landing" | "dashboard" | "admin";

export type JournalisticTone = "Informativo" | "Urgente" | "Analítico" | "Neutro";

export type ImageQuality = "1080p" | "4K" | "720p";

export type PublicationType = "1:1" | "1080x1440" | "1080x1920";

export interface PostState {
  url: string;
  tone: JournalisticTone;
  quality: ImageQuality;
  pubType: PublicationType;
  manchete: string;
  subtitulo: string;
  legenda: string;
  imageUrl: string;
}

export interface ServiceState {
  name: string;
  status: "Ativa" | "Desativada" | "Instável";
  use: number; // percentage
  reqs: string;
  health: string;
  logo: string;
}

export interface ActivityLog {
  title: string;
  description: string;
  time: string;
  type: "text" | "image" | "success" | "clean" | "info" | "user";
}

export interface PlatformPlan {
  name: string;
  price: string;
  users: string;
  posts: string;
  images: string;
  resources: string;
}
