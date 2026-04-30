import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "./authStore";

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isHydrated: false,
    isAuthenticated: false,
    logoutPending: false,
  });
});

describe("useAuthStore", () => {
  it("starts unauthenticated before hydration", () => {
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isHydrated: false,
      isAuthenticated: false,
      logoutPending: false,
    });
  });

  it("hydrates an authenticated user", () => {
    const user = { id: "user-1", username: "Ada" };

    useAuthStore.getState().hydrateAuth(user);

    expect(useAuthStore.getState()).toMatchObject({
      user,
      isHydrated: true,
      isAuthenticated: true,
    });
  });

  it("hydrates an anonymous session", () => {
    useAuthStore.getState().hydrateAuth(null);

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isHydrated: true,
      isAuthenticated: false,
    });
  });

  it("tracks logout pending state", () => {
    useAuthStore.getState().setLogoutPending(true);
    expect(useAuthStore.getState().logoutPending).toBe(true);

    useAuthStore.getState().setLogoutPending(false);
    expect(useAuthStore.getState().logoutPending).toBe(false);
  });

  it("clears auth state after logout", () => {
    useAuthStore.getState().hydrateAuth({ id: "user-1", username: "Ada" });
    useAuthStore.getState().setLogoutPending(true);

    useAuthStore.getState().clearAuth();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isHydrated: true,
      isAuthenticated: false,
      logoutPending: false,
    });
  });
});
