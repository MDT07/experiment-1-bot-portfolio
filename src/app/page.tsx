import type { Metadata } from "next";
import PortfolioExperience from "@/components/PortfolioExperience";
import { contentByLocale } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: contentByLocale.en.meta.title,
  description: contentByLocale.en.meta.description,
  alternates: {
    canonical: siteUrl || undefined,
    languages: siteUrl
      ? {
          en: siteUrl,
          ru: `${siteUrl}/ru`,
          "x-default": siteUrl,
        }
      : undefined,
  },
};

export default function EnglishPortfolioPage() {
  return <PortfolioExperience content={contentByLocale.en} />;
}
