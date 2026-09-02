import type { Metadata } from "next";
import PortfolioExperience from "@/components/PortfolioExperience";
import { contentByLocale } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: contentByLocale.ru.meta.title,
  description: contentByLocale.ru.meta.description,
  alternates: {
    canonical: siteUrl ? `${siteUrl}/ru` : undefined,
    languages: siteUrl
      ? {
          en: siteUrl,
          ru: `${siteUrl}/ru`,
          "x-default": siteUrl,
        }
      : undefined,
  },
};

export default function RussianPortfolioPage() {
  return <PortfolioExperience content={contentByLocale.ru} />;
}
