import { afterEach, describe, expect, it, vi } from "vitest";
import { isStudioOwner } from "./owner";

describe("isStudioOwner", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts the immutable owner user ID even when the provider email differs", () => {
    vi.stubEnv("STUDIO_OWNER_USER_ID", "11111111-1111-4111-8111-111111111111");
    vi.stubEnv("STUDIO_OWNER_EMAIL", "owner@example.com");

    expect(isStudioOwner({
      id: "11111111-1111-4111-8111-111111111111",
      email: "github@example.com",
    })).toBe(true);
  });

  it("keeps the verified email fallback", () => {
    vi.stubEnv("STUDIO_OWNER_USER_ID", "11111111-1111-4111-8111-111111111111");
    vi.stubEnv("STUDIO_OWNER_EMAIL", "owner@example.com");

    expect(isStudioOwner({
      id: "22222222-2222-4222-8222-222222222222",
      email: "OWNER@example.com",
    })).toBe(true);
  });

  it("rejects any identity that matches neither owner control", () => {
    vi.stubEnv("STUDIO_OWNER_USER_ID", "11111111-1111-4111-8111-111111111111");
    vi.stubEnv("STUDIO_OWNER_EMAIL", "owner@example.com");

    expect(isStudioOwner({
      id: "22222222-2222-4222-8222-222222222222",
      email: "visitor@example.com",
    })).toBe(false);
  });
});
