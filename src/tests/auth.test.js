import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  clearAuthState,
  clearUser,
  loadAuthState,
  loadUser,
  loadUsers,
  saveAuthState,
  saveUser,
  saveUsers,
} from "../utils/auth";

const user = {
  email: "melih@example.com",
  fullName: "Melih Demir",
  avatar: "data:image/png;base64,avatar",
};

describe("auth utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("saveUser and loadUser read from both current and legacy user storage keys", () => {
    saveUser(user);

    expect(loadUser()).toEqual(user);

    localStorage.removeItem("currentUser");
    expect(loadUser()).toEqual(user);
  });

  test("loadUser and loadUsers fall back safely for malformed data", () => {
    localStorage.setItem("currentUser", "{bad-json");
    expect(loadUser()).toBeNull();

    localStorage.setItem("users", JSON.stringify({ invalid: true }));
    expect(loadUsers()).toEqual([]);
  });

  test("clearUser removes both user storage keys", () => {
    saveUser(user);

    clearUser();

    expect(localStorage.getItem("travel_memory_user")).toBeNull();
    expect(localStorage.getItem("currentUser")).toBeNull();
  });

  test("saveUsers and loadUsers persist the user list", () => {
    saveUsers([user]);

    expect(loadUsers()).toEqual([user]);
  });

  test("saveAuthState, loadAuthState, and clearAuthState keep auth flags in sync", () => {
    saveAuthState(true);

    expect(loadAuthState()).toBe(true);
    expect(localStorage.getItem("travel_memory_auth")).toBe("true");
    expect(localStorage.getItem("isAuthenticated")).toBe("true");

    clearAuthState();

    expect(loadAuthState()).toBe(false);
  });

  test("loadAuthState returns false when storage access throws", () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(loadAuthState()).toBe(false);

    getItemSpy.mockRestore();
  });
});
