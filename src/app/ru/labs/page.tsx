import type { Metadata } from "next";
import AiSystemsLab from "@/components/AiSystemsLab";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Live-лаборатория AI-систем",
  description: "Ограниченная NVIDIA-лаборатория архитектуры ботов и агентов-ассистентов.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/ru/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function RussianLabPage() {
  return <AiSystemsLab locale="ru" />;
}
