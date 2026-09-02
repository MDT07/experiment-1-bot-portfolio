import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emir Semenov — Bot Systems",
    short_name: "E/S Systems",
    description: "Experimental portfolio of AI-powered bot systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#030506",
    theme_color: "#71f5df",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
