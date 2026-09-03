import type { Metadata } from "next";
import SolutionAtlas from "@/components/SolutionAtlas";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Каталог решений для ботов и агентов",
  description: "Изучите восемь готовых архитектур ботов и агентов для продаж, сервиса, коммерции, операций и работы со знаниями.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/ru/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function RussianLabPage() {
  return <SolutionAtlas locale="ru" />;
}
