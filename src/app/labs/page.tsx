import type { Metadata } from "next";
import AiSystemsLab from "@/components/AiSystemsLab";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Bot Studio",
  description: "Design one bounded bot system, inspect its capability graph, and test it in a five-message preview.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function EnglishLabPage() {
  return <AiSystemsLab locale="en" />;
}
