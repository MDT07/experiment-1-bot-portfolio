import type { Metadata } from "next";
import AiSystemsLab from "@/components/AiSystemsLab";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Bot Studio",
  description: "Спроектируйте ограниченную систему бота, изучите граф возможностей и проверьте её в preview из пяти сообщений.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/ru/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function RussianLabPage() {
  return <AiSystemsLab locale="ru" />;
}
