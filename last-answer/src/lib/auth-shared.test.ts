import { describe, expect, it } from "vitest";

import {
  MIN_PASSWORD_LENGTH,
  validatePassword,
  validateUsername,
} from "./auth-shared";

describe("validateUsername", () => {
  it("requires a non-empty username", () => {
    expect(validateUsername("")).toBe("Username is required.");
    expect(validateUsername("   ")).toBe("Username is required.");
  });

  it("rejects usernames shorter than 3 characters", () => {
    expect(validateUsername("ab")).toBe(
      "Username must be 3-20 characters using letters, numbers, or underscores.",
    );
  });

  it("rejects usernames longer than 20 characters", () => {
    expect(validateUsername("a".repeat(21))).toBe(
      "Username must be 3-20 characters using letters, numbers, or underscores.",
    );
  });

  it("rejects usernames with unsupported characters", () => {
    expect(validateUsername("player-one")).toBe(
      "Username must be 3-20 characters using letters, numbers, or underscores.",
    );
    expect(validateUsername("player one")).toBe(
      "Username must be 3-20 characters using letters, numbers, or underscores.",
    );
  });

  it("accepts letters, numbers, and underscores within the allowed length", () => {
    expect(validateUsername("abc")).toBeNull();
    expect(validateUsername("Player_123")).toBeNull();
    expect(validateUsername("a".repeat(20))).toBeNull();
  });
});

describe("validatePassword", () => {
  it("requires a non-empty password", () => {
    expect(validatePassword("")).toBe("Password is required.");
  });

  it("rejects passwords shorter than the minimum length", () => {
    expect(validatePassword("a".repeat(MIN_PASSWORD_LENGTH - 1))).toBe(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    );
  });

  it("accepts passwords that meet the minimum length", () => {
    expect(validatePassword("a".repeat(MIN_PASSWORD_LENGTH))).toBeNull();
    expect(validatePassword("correct-horse-battery-staple")).toBeNull();
  });
});
