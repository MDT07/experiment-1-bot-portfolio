import type { Metadata } from "next";
import AiSystemsLab from "@/components/AiSystemsLab";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Live AI Systems Lab",
  description: "A bounded NVIDIA-powered architecture laboratory for bots and agent assistants.",
  alternates: {
    canonical: siteUrl ? `${siteUrl}/labs` : undefined,
    languages: siteUrl ? { en: `${siteUrl}/labs`, ru: `${siteUrl}/ru/labs` } : undefined,
  },
};

export default function EnglishLabPage() {
  return <AiSystemsLab locale="en" />;
}
