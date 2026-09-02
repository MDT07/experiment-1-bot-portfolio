import { z } from "zod";

export const studioChannels = ["web", "telegram", "whatsapp", "instagram", "concept"] as const;
export const studioAutonomy = ["advisory", "approval-gated"] as const;

export const studioBriefSchema = z.object({
  locale: z.enum(["en", "ru"]),
  purpose: z.string().trim().min(24).max(1200),
  audience: z.string().trim().min(2).max(180),
  channel: z.enum(studioChannels),
  aiCore: z.boolean(),
  language: z.string().trim().min(2).max(80),
  tone: z.string().trim().min(2).max(120),
  autonomy: z.enum(studioAutonomy),
  capabilities: z.array(z.string().trim().min(2).max(120)).min(1).max(8),
  knowledge: z.string().trim().max(1200),
  escalation: z.string().trim().max(500),
});

const intentSchema = z.object({
  id: z.string().trim().min(1).max(48),
  label: z.string().trim().min(1).max(100),
  userExamples: z.array(z.string().trim().min(1).max(180)).min(1).max(4),
  responseStrategy: z.string().trim().min(1).max(320),
});

const graphNodeSchema = z.object({
  id: z.string().trim().min(1).max(48),
  kind: z.enum(["input", "intent", "knowledge", "capability", "integration", "guardrail", "handoff"]),
  label: z.string().trim().min(1).max(90),
  detail: z.string().trim().min(1).max(240),
});

const graphEdgeSchema = z.object({
  source: z.string().trim().min(1).max(48),
  target: z.string().trim().min(1).max(48),
  label: z.string().trim().min(1).max(80),
});

export const botBlueprintSchema = z.object({
  name: z.string().trim().min(2).max(80),
  oneLine: z.string().trim().min(12).max(240),
  mode: z.enum(["rules", "ai"]),
  identity: z.string().trim().min(12).max(420),
  greeting: z.string().trim().min(2).max(420),
  systemPrompt: z.string().trim().min(24).max(5000),
  intents: z.array(intentSchema).min(2).max(8),
  capabilities: z.array(z.string().trim().min(2).max(180)).min(2).max(10),
  knowledgeDomains: z.array(z.string().trim().min(2).max(160)).max(8),
  integrations: z.array(z.string().trim().min(2).max(160)).max(6),
  guardrails: z.array(z.string().trim().min(2).max(220)).min(3).max(10),
  limitations: z.array(z.string().trim().min(2).max(220)).min(2).max(8),
  evaluationScenarios: z.array(z.string().trim().min(2).max(220)).min(3).max(8),
  graph: z.object({
    nodes: z.array(graphNodeSchema).min(4).max(24),
    edges: z.array(graphEdgeSchema).min(3).max(32),
  }),
}).superRefine((blueprint, context) => {
  const nodeIds = blueprint.graph.nodes.map((node) => node.id);
  if (new Set(nodeIds).size !== nodeIds.length) {
    context.addIssue({
      code: "custom",
      path: ["graph", "nodes"],
      message: "Graph node IDs must be unique.",
    });
  }
});

export const studioChatRequestSchema = z.object({
  projectId: z.string().uuid(),
  message: z.string().trim().min(1).max(1000),
});

export type StudioBrief = z.infer<typeof studioBriefSchema>;
export type BotBlueprint = z.infer<typeof botBlueprintSchema>;
export type StudioChatRequest = z.infer<typeof studioChatRequestSchema>;
export type StudioLocale = StudioBrief["locale"];

export type StudioProject = {
  id: string;
  blueprint: BotBlueprint;
  createdAt: string;
  previewMessagesUsed: number;
};

export type StudioStatus = {
  configured: boolean;
  public: boolean;
  signedIn: boolean;
  owner: boolean;
  generationAvailable: boolean;
  previewMessageLimit: number;
  provider: string;
  model: string;
  project: StudioProject | null;
};

export function normalizeGraph(blueprint: BotBlueprint): BotBlueprint {
  const nodeIds = new Set(blueprint.graph.nodes.map((node) => node.id));
  const edgeIds = new Set<string>();
  const edges = blueprint.graph.edges.filter((edge) => {
    const edgeId = `${edge.source}:${edge.target}:${edge.label}`;
    if (edge.source === edge.target || !nodeIds.has(edge.source) || !nodeIds.has(edge.target) || edgeIds.has(edgeId)) {
      return false;
    }
    edgeIds.add(edgeId);
    return true;
  });
  const fallbackEdges = blueprint.graph.nodes.slice(0, 4).flatMap((node, index, nodes) => {
    const target = nodes[index + 1];
    return target ? [{ source: node.id, target: target.id, label: "flows to" }] : [];
  });

  return {
    ...blueprint,
    graph: {
      nodes: blueprint.graph.nodes,
      edges: edges.length >= 3 ? edges : fallbackEdges,
    },
  };
}

export function runRulesPreview(blueprint: BotBlueprint, message: string): string {
  const normalized = message.toLocaleLowerCase();
  const matched = blueprint.intents.find((intent) =>
    [intent.label, ...intent.userExamples].some((example) => {
      const words = example
        .toLocaleLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter((word) => word.length > 3);
      return words.some((word) => normalized.includes(word));
    }),
  );

  if (matched) return matched.responseStrategy;
  return blueprint.limitations[0] || blueprint.greeting;
}
