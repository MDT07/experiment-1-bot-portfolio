import type { Metadata } from "next";
import SolutionAtlas from "@/components/SolutionAtlas";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Bot & Agent Solution Catalog",
  description: "Explore eight implementation-ready bot and agent architectures for sales, service, commerce, operations, and knowledge workflows.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function EnglishLabPage() {
  return <SolutionAtlas locale="en" />;
}
