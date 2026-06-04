import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diarinho — Diário & Agenda",
    short_name: "Diarinho",
    description:
      "Seu cantinho fofo para registrar o dia a dia e organizar compromissos.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff5f7",
    theme_color: "#ec88a3",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["lifestyle", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
