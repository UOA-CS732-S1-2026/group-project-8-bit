import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { AchievementToastStack } from "./AchievementToastStack";

const { dismissToast, mockStoreState } = vi.hoisted(() => ({
  dismissToast: vi.fn(),
  mockStoreState: {
    toasts: [] as Array<{
      id: string;
      title: string;
      tier: "bronze" | "silver" | "gold" | "mythic";
      createdAt: number;
    }>,
  },
}));

vi.mock("./ModalPortal", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/store/achievementStore", () => ({
  useAchievementStore: (
    selector: (state: {
      toasts: typeof mockStoreState.toasts;
      dismissToast: typeof dismissToast;
    }) => unknown,
  ) =>
    selector({
      toasts: mockStoreState.toasts,
      dismissToast,
    }),
}));

describe("AchievementToastStack", () => {
  afterEach(() => {
    mockStoreState.toasts = [];
    dismissToast.mockReset();
  });

  it("renders nothing when there is no active toast", () => {
    expect(renderToStaticMarkup(<AchievementToastStack />)).toBe("");
  });

  it("renders the unlocked achievement title and icon", () => {
    mockStoreState.toasts = [
      {
        id: "ending_golden",
        title: "Crown of Dawn",
        tier: "gold",
        createdAt: 123,
      },
    ];

    const html = renderToStaticMarkup(<AchievementToastStack />);

    expect(html).toContain("Achievement Unlocked");
    expect(html).toContain("gold");
    expect(html).toContain("Crown of Dawn");
    expect(html).toContain(
      "/icons/achievements/ending_golden.png?v=20260510-ash-fix",
    );
    expect(html).toContain('alt="Crown of Dawn icon"');
  });
});
