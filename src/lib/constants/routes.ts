export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  PROFILE: "/profile",
} as const;

export const BOOK_ROUTES = {
  LIST: "/books",
  ADD: "/books/add",
  DETAIL: (id: string) => `/books/${id}`,
  EDIT: (id: string) => `/books/${id}/edit`,
} as const;

export const ANALYTICS_ROUTES = {
  DASHBOARD: "/analytics",
} as const;

export const ROOT_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
} as const;

export const ROUTES = {
  AUTH: AUTH_ROUTES,
  BOOK: BOOK_ROUTES,
  ANALYTICS: ANALYTICS_ROUTES,
  ROOT: ROOT_ROUTES,
} as const;

export default ROUTES;
