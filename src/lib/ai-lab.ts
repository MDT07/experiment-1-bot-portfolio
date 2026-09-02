export const labModes = ["bot", "assistant", "reference"] as const;

export type LabMode = (typeof labModes)[number];
export type LabLocale = "en" | "ru";

export type LabRequest = {
  locale: LabLocale;
  mode: LabMode;
  channel: string;
  autonomy: "advisory" | "approval-gated";
  brief: string;
};

export type LabTool = {
  name: string;
  purpose: string;
  permission: string;
};

export type LabArchitecture = {
  title: string;
  summary: string;
  userJourney: string[];
  agentLoop: string[];
  tools: LabTool[];
  guardrails: string[];
  demoScript: string[];
  evaluation: string[];
};

export type LabResponse = {
  architecture: LabArchitecture;
  meta: {
    provider: "NVIDIA NIM";
    model: string;
    generatedAt: string;
    actionsExecuted: false;
  };
};

export function isLabRequest(value: unknown): value is LabRequest {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<LabRequest>;

  return (
    (input.locale === "en" || input.locale === "ru") &&
    labModes.includes(input.mode as LabMode) &&
    typeof input.channel === "string" &&
    input.channel.length >= 2 &&
    input.channel.length <= 80 &&
    (input.autonomy === "advisory" || input.autonomy === "approval-gated") &&
    typeof input.brief === "string" &&
    input.brief.trim().length >= 24 &&
    input.brief.length <= 2000
  );
}
