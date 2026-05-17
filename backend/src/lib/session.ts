export type SessionUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}
