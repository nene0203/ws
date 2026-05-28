import { PostState } from "../types";

const imageCache = new Map<string, HTMLImageElement>();
const loadingPromises = new Map<string, Promise<HTMLImageElement>>();

// Helper to pre-load and cache images seamlessly to avoid visual flicker during state updates
export function getOrLoadImage(url: string, onReady: () => void): HTMLImageElement | null {
  const finalUrl = url || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80";
  
  if (imageCache.has(finalUrl)) {
    const img = imageCache.get(finalUrl)!;
    if (img.complete) return img;
  }

  if (loadingPromises.has(finalUrl)) {
    return null; // Already in loading phase
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  
  let srcToLoad = finalUrl;
  // Bypasses certain cached-CORS blockages from image servers like Unsplash
  if (srcToLoad.includes("unsplash.com") && !srcToLoad.includes("crossorigin")) {
    srcToLoad += srcToLoad.includes("?") ? "&crossorigin=anonymous" : "?crossorigin=anonymous";
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    img.onload = () => {
      imageCache.set(finalUrl, img);
      resolve(img);
      onReady();
    };
    img.onerror = () => {
      console.warn("CORS/Image load warning, using internal styles fallback for: ", finalUrl);
      reject(new Error("Failed to load"));
    };
  });

  loadingPromises.set(finalUrl, promise);
  img.src = srcToLoad;

  return null;
}

function getFontDetails(fontFamilyParam: string, defaultBold: boolean) {
  let fontName = "Inter, sans-serif";
  let weight = defaultBold ? "bold" : "normal";

  switch (fontFamilyParam) {
    case "Interbold":
    case "Inter Bold":
      fontName = "Inter, sans-serif";
      weight = "bold";
      break;
    case "Inter ExtraBold":
      fontName = "Inter, sans-serif";
      weight = "800";
      break;
    case "Montserrat Bold":
      fontName = "Montserrat, sans-serif";
      weight = "bold";
      break;
    case "Poppins Bold":
      fontName = "Poppins, sans-serif";
      weight = "bold";
      break;
    case "Roboto Slab":
      fontName = "Roboto Slab, serif";
      weight = "700";
      break;
    case "Playfair Display":
      fontName = "Playfair Display, serif";
      weight = "700";
      break;
    case "Merriweather":
      fontName = "Merriweather, serif";
      weight = "700";
      break;
    case "Bebas Neue":
      fontName = "Bebas Neue, sans-serif";
      weight = "normal";
      break;
    case "Oswald":
      fontName = "Oswald, sans-serif";
      weight = "bold";
      break;
    case "Lora":
      fontName = "Lora, serif";
      weight = "bold";
      break;
    case "Pacifico":
      fontName = "Pacifico, cursive";
      weight = "normal";
      break;
    case "Dancing Script":
      fontName = "Dancing Script, cursive";
      weight = "bold";
      break;
    case "Great Vibes":
      fontName = "Great Vibes, cursive";
      weight = "normal";
      break;
    case "Satisfy":
      fontName = "Satisfy, cursive";
      weight = "normal";
      break;
    case "Space Grotesk":
      fontName = "Space Grotesk, sans-serif";
      break;
    case "Inter":
      fontName = "Inter, sans-serif";
      break;
    default:
      fontName = fontFamilyParam + ", sans-serif";
  }

  return { fontName, weight };
}

export function drawPostOnCanvas(
  canvas: HTMLCanvasElement,
  post: PostState,
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
  },
  onImageLoaded: () => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = 1080;
  let h = 1080;
  if (post.pubType === "1080x1440") h = 1440;
  if (post.pubType === "1080x1920") h = 1920;

  // Set high-res canvas coordinates
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  // Draw smooth dark premium base canvas
  ctx.fillStyle = "#0c111d"; // Slate-950 base
  ctx.fillRect(0, 0, w, h);

  // Load backend graphic or photo
  const bgImg = getOrLoadImage(post.imageUrl, onImageLoaded);
  if (bgImg && bgImg.complete) {
    // Math logic for cover fitting without stretching
    const imgW = bgImg.naturalWidth || bgImg.width;
    const imgH = bgImg.naturalHeight || bgImg.height;
    const imgRatio = imgW / imgH;
    const canvasRatio = w / h;

    let sX = 0, sY = 0, sW = imgW, sH = imgH;
    if (imgRatio > canvasRatio) {
      sW = imgH * canvasRatio;
      sX = (imgW - sW) / 2;
    } else {
      sH = imgW / canvasRatio;
      sY = (imgH - sH) / 2;
    }
    ctx.drawImage(bgImg, sX, sY, sW, sH, 0, 0, w, h);
  } else {
    // Premium radial background gradient whilst fetching assets
    const fallbackGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w);
    fallbackGrad.addColorStop(0, "#111827");
    fallbackGrad.addColorStop(1, "#030712");
    ctx.fillStyle = fallbackGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // Resolve custom font styles
  const { fontName: fontFamily, weight: textWeight } = getFontDetails(textStyles.fontFamily, textStyles.bold);
  const textItalic = textStyles.italic ? "italic" : "";

  // Draw responsive aesthetic gradients & texts based on design dimensions
  if (post.pubType === "1080x1920") {
    // ----------------------------------------------------
    // FORMAT 1080x1920 (Instagram Stories / TikTok)
    // ----------------------------------------------------
    
    // Top vignette for Stories info visibility
    const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.18);
    topGrad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
    topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, w, h * 0.18);

    // Bottom vignette
    const bottomGrad = ctx.createLinearGradient(0, h * 0.76, 0, h);
    bottomGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    bottomGrad.addColorStop(1, "rgba(0, 0, 0, 0.9)");
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, h * 0.76, w, h * 0.24);

    // Centered Content Card Y calculate based on posYPercent (default 50)
    const cardW = 910;
    const cardH = 760;
    const cardX = (w - cardW) / 2;
    const posYPercent = typeof textStyles.posYPercent === "number" ? textStyles.posYPercent : 50;
    const minY = 100;
    const maxY = h - cardH - 120;
    const finalMinY = Math.min(minY, maxY);
    const cardY = finalMinY + (maxY - finalMinY) * (posYPercent / 100);

    // Semi-transparent glassmorphism overlay inside card
    ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(cardX, cardY, cardW, cardH, 36);
    } else {
      ctx.rect(cardX, cardY, cardW, cardH);
    }
    ctx.fill();

    // Subtle edge boundary line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw card ornament branding (Circle code badge)
    const badgeX = w / 2;
    const badgeY = cardY + 80;
    const badgeRadius = 38;

    ctx.fillStyle = "rgba(79, 70, 229, 0.2)";
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgb(129, 140, 248)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw little list lines inside
    ctx.fillStyle = "rgb(165, 180, 252)";
    ctx.fillRect(badgeX - 16, badgeY - 10, 32, 4.5);
    ctx.fillRect(badgeX - 16, badgeY - 1.5, 22, 4);
    ctx.fillRect(badgeX - 16, badgeY + 7, 28, 4);

    // Text configuration
    const headlineFontSize = Math.floor(Math.min(textStyles.fontSize, 32) * 2.3);
    ctx.font = `${textItalic} ${textWeight} ${headlineFontSize}px ${fontFamily}`;
    ctx.fillStyle = textStyles.color || "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    if (textStyles.hasShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    const wrapLimitWidth = cardW - 120;
    const rawHeadline = (post.manchete || "").toUpperCase();
    const headLines = wrapText(ctx, rawHeadline, wrapLimitWidth);
    const headLineHeight = headlineFontSize * textStyles.lineHeight;
    let currentY = badgeY + 85;

    for (let i = 0; i < headLines.length; i++) {
      ctx.fillText(headLines[i], w / 2, currentY);
      currentY += headLineHeight;
    }

    // Reset shadow for next steps
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    // Divider line if subtitle holds text
    if (textStyles.isSubtituloEnabled && post.subtitulo) {
      currentY += 30;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cardX + 80, currentY);
      ctx.lineTo(cardX + cardW - 80, currentY);
      ctx.stroke();

      currentY += 30;

      const subFontSize = 26;
      ctx.font = `normal 500 ${subFontSize}px Inter, sans-serif`;
      ctx.fillStyle = "#cbd5e1"; // Slate-300
      ctx.textAlign = "center";

      const subLines = wrapText(ctx, post.subtitulo, wrapLimitWidth);
      const subLineHeight = subFontSize * 1.45;

      for (let j = 0; j < subLines.length; j++) {
        ctx.fillText(subLines[j], w / 2, currentY);
        currentY += subLineHeight;
      }
    }

    // Centered swipe footer button at the bottom
    const swipeBtnW = 340;
    const swipeBtnH = 64;
    const swipeBtnX = (w - swipeBtnW) / 2;
    const swipeBtnY = h - 200;

    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(swipeBtnX, swipeBtnY, swipeBtnW, swipeBtnH, 32);
    } else {
      ctx.rect(swipeBtnX, swipeBtnY, swipeBtnW, swipeBtnH);
    }
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 21px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LER NOTÍCIA COMPLETA", w / 2, swipeBtnY + (swipeBtnH / 2));

  } else {
    // ----------------------------------------------------
    // FORMATS 1:1 OR 1080x1440 (Square Card or Feed Portrait)
    // ----------------------------------------------------
    const gradY0 = h * 0.45;
    const gradY1 = h;
    const overlayGrad = ctx.createLinearGradient(0, gradY0, 0, gradY1);
    overlayGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    overlayGrad.addColorStop(0.3, "rgba(0, 0, 0, 0.65)");
    overlayGrad.addColorStop(0.75, "rgba(0, 0, 0, 0.92)");
    overlayGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, gradY0, w, h - gradY0);

    // Apply color multiply blend overlay on demand
    if (textStyles.hasGradient) {
      const indGrad = ctx.createLinearGradient(0, gradY0, 0, gradY1);
      indGrad.addColorStop(0, "rgba(49, 46, 129, 0)");
      indGrad.addColorStop(1, "rgba(49, 46, 129, 0.35)");
      ctx.fillStyle = indGrad;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, gradY0, w, h - gradY0);
      ctx.globalCompositeOperation = "source-over"; // Reset compositing modes
    }

    // Proportional high-res scaling factor
    const headlineFontSize = Math.floor(textStyles.fontSize * 2.3); 
    ctx.font = `${textItalic} ${textWeight} ${headlineFontSize}px ${fontFamily}`;
    ctx.fillStyle = textStyles.color || "#FFFFFF";
    ctx.textAlign = textStyles.align;
    ctx.textBaseline = "top";

    if (textStyles.hasShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }

    const wrapLimitWidth = w - 160; // 80px left and right padding margin
    const rawHeadline = (post.manchete || "").toUpperCase();
    const headLines = wrapText(ctx, rawHeadline, wrapLimitWidth);
    const headLineHeight = headlineFontSize * textStyles.lineHeight;
    const subFontSize = 28;
    const subLineHeight = subFontSize * 1.4;

    let totalContentHeight = headLines.length * headLineHeight;
    let subLines: string[] = [];

    if (textStyles.isSubtituloEnabled && post.subtitulo) {
      ctx.font = `normal 500 ${subFontSize}px Inter, sans-serif`;
      // Left aligned has room for left border bar indicator
      const activeTextWidth = (textStyles.align === "left") ? wrapLimitWidth - 50 : wrapLimitWidth;
      subLines = wrapText(ctx, post.subtitulo, activeTextWidth);
      totalContentHeight += (subLines.length * subLineHeight) + 30; // 30px label gap
    }

    // Dynamic vertical positioning Y based on posYPercent (default 75 for feed)
    const posYPercent = typeof textStyles.posYPercent === "number" ? textStyles.posYPercent : 75;
    const minY = 130;
    const maxY = h - totalContentHeight - 50;
    const finalMinY = Math.min(minY, maxY);
    const currentYStart = finalMinY + (maxY - finalMinY) * (posYPercent / 100);
    let currentY = currentYStart;

    // Draw Headline Text
    ctx.font = `${textItalic} ${textWeight} ${headlineFontSize}px ${fontFamily}`;
    ctx.fillStyle = textStyles.color || "#FFFFFF";
    ctx.textAlign = textStyles.align;

    const textX = textStyles.align === "left" 
      ? 80 
      : textStyles.align === "right" ? w - 80 : w / 2;

    for (let i = 0; i < headLines.length; i++) {
      ctx.fillText(headLines[i], textX, currentY);
      currentY += headLineHeight;
    }

    // Draw Subtitle Text
    if (textStyles.isSubtituloEnabled && post.subtitulo && subLines.length > 0) {
      currentY += 24; // gap spacing
      ctx.font = `normal 500 ${subFontSize}px Inter, sans-serif`;
      ctx.fillStyle = "#cbd5e1"; // slate-300

      if (textStyles.align === "left") {
        ctx.shadowColor = "transparent";
        ctx.fillStyle = "#6366f1"; // Indigo-500 indicator bar
        ctx.fillRect(80, currentY + 6, 6, (subLines.length * subLineHeight) - 10);

        ctx.fillStyle = "#cbd5e1"; // reset subtitle color
        if (textStyles.hasShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
          ctx.shadowBlur = 10;
        }
        for (let j = 0; j < subLines.length; j++) {
          ctx.fillText(subLines[j], 115, currentY);
          currentY += subLineHeight;
        }
      } else {
        for (let j = 0; j < subLines.length; j++) {
          ctx.fillText(subLines[j], textX, currentY);
          currentY += subLineHeight;
        }
      }
    }

    // Reset shadow values
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  // Draw floating brand stamp badge "NewsFlow AI" on upper corner
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(79, 70, 229, 0.85)"; // Indigo-600
  ctx.beginPath();
  const stampX = w - 240;
  const stampY = 50;
  const stampW = 190;
  const stampH = 46;

  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(stampX, stampY, stampW, stampH, 8);
  } else {
    ctx.rect(stampX, stampY, stampW, stampH);
  }
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 17px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NEWSFLOW AI", stampX + (stampW / 2), stampY + (stampH / 2) + 1);
}

// Word-wrapping function helper
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + " ";
    const metrics = ctx.measureText(testLine.trim());
    if (metrics.width > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + " ";
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  return lines;
}
