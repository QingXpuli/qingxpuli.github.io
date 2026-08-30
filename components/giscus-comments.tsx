"use client";

import { useEffect, useRef } from "react";

const giscusConfig = {
  repo: "QingXpuli/qingxpuli.github.io",
  repoId: "R_kgDOUIxmTA",
  category: "General",
  categoryId: "DIC_kwDOUIxmTM4DEgmX",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "zh-CN"
} as const;

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.childElementCount > 0) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    Object.entries(giscusConfig).forEach(([key, value]) => {
      script.setAttribute(`data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
    });
    container.appendChild(script);
  }, []);

  return <div ref={containerRef} className="giscus-shell" aria-label="评论区" />;
}
