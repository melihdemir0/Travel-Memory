import { AUTH_STORAGE_KEY, USER_STORAGE_KEY } from "../constants/authConstants";

const LEGACY_AUTH_STORAGE_KEY = "isAuthenticated";
const CURRENT_USER_STORAGE_KEY = "currentUser";
const USERS_STORAGE_KEY = "users";

function parseStoredJson(rawValue, fallbackValue) {
  if (!rawValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallbackValue;
  }
}

export function saveUser(userData) {
  const serializedUser = JSON.stringify(userData);
  localStorage.setItem(USER_STORAGE_KEY, serializedUser);
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, serializedUser);
}

export function loadUser() {
  const user = parseStoredJson(
    localStorage.getItem(CURRENT_USER_STORAGE_KEY) ?? localStorage.getItem(USER_STORAGE_KEY),
    null,
  );
  return user && typeof user === "object" ? user : null;
}

export function clearUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function loadUsers() {
  const users = parseStoredJson(localStorage.getItem(USERS_STORAGE_KEY), []);
  return Array.isArray(users) ? users : [];
}

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function loadAuthState() {
  try {
    const storedValue =
      localStorage.getItem(AUTH_STORAGE_KEY) ?? localStorage.getItem(LEGACY_AUTH_STORAGE_KEY);
    return storedValue === "true";
  } catch {
    return false;
  }
}

export function saveAuthState(isAuthenticated) {
  const serializedAuthState = String(isAuthenticated);
  localStorage.setItem(AUTH_STORAGE_KEY, serializedAuthState);
  localStorage.setItem(LEGACY_AUTH_STORAGE_KEY, serializedAuthState);
}

export function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}
