import { describe, expect, it } from "vitest";
import {
  botBlueprintSchema,
  normalizeGraph,
  runRulesPreview,
  studioBriefSchema,
  type BotBlueprint,
} from "./bot-studio";

const blueprint: BotBlueprint = {
  name: "Studio guide",
  oneLine: "Answers scoped studio questions.",
  mode: "rules",
  identity: "A bounded studio support guide.",
  greeting: "How can I help?",
  systemPrompt: "Answer only from the approved studio knowledge.",
  intents: [
    { id: "pricing", label: "Pricing", userExamples: ["pricing details"], responseStrategy: "I can explain the approved pricing model." },
    { id: "handoff", label: "Human handoff", userExamples: ["speak to a person"], responseStrategy: "I will describe the handoff path." },
  ],
  capabilities: ["Answer approved questions", "Describe a handoff"],
  knowledgeDomains: ["Studio services"],
  integrations: [],
  guardrails: ["No external writes", "No secret access", "No unsupported claims"],
  limitations: ["I only know the supplied brief.", "No channel is connected."],
  evaluationScenarios: ["Known question", "Unknown question", "Handoff request"],
  graph: {
    nodes: [
      { id: "input", kind: "input", label: "User message", detail: "A preview message" },
      { id: "intent", kind: "intent", label: "Intent", detail: "Matched request" },
      { id: "capability", kind: "capability", label: "Answer", detail: "Bounded response" },
      { id: "guardrail", kind: "guardrail", label: "Limit", detail: "No external action" },
    ],
    edges: [
      { source: "input", target: "intent", label: "classifies" },
      { source: "intent", target: "capability", label: "routes" },
      { source: "capability", target: "guardrail", label: "checked by" },
    ],
  },
};

describe("Studio contracts", () => {
  it("accepts a bounded brief and rejects an underspecified purpose", () => {
    const valid = {
      locale: "en",
      purpose: "Qualify a studio lead and prepare a handoff.",
      audience: "Founders",
      channel: "web",
      aiCore: true,
      language: "English",
      tone: "Precise",
      autonomy: "approval-gated",
      capabilities: ["Collect requirements"],
      knowledge: "Approved studio services",
      escalation: "Escalate unknown requests",
    };

    expect(studioBriefSchema.safeParse(valid).success).toBe(true);
    expect(studioBriefSchema.safeParse({ ...valid, purpose: "Too short" }).success).toBe(false);
  });

  it("rejects duplicate graph node IDs", () => {
    const duplicate = structuredClone(blueprint);
    duplicate.graph.nodes[1].id = "input";
    expect(botBlueprintSchema.safeParse(duplicate).success).toBe(false);
  });

  it("repairs invalid graph edges without preserving unknown node references", () => {
    const malformed: BotBlueprint = {
      ...blueprint,
      graph: {
        nodes: blueprint.graph.nodes,
        edges: [
          { source: "missing", target: "intent", label: "invalid" },
          { source: "intent", target: "intent", label: "loop" },
          { source: "capability", target: "missing", label: "invalid" },
        ],
      },
    };
    const normalized = normalizeGraph(malformed);
    const nodeIds = new Set(normalized.graph.nodes.map((node) => node.id));

    expect(normalized.graph.edges).toHaveLength(3);
    expect(normalized.graph.edges.every((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))).toBe(true);
    expect(normalized.graph.edges.every((edge) => edge.source !== edge.target)).toBe(true);
  });

  it("routes a deterministic preview and falls back honestly", () => {
    expect(runRulesPreview(blueprint, "Can you share pricing details?")).toBe(
      "I can explain the approved pricing model.",
    );
    expect(runRulesPreview(blueprint, "Tell me tomorrow's weather")).toBe(blueprint.limitations[0]);
  });
});
