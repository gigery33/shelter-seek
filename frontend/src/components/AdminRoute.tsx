import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppSelector((s) => s.auth);

  if (loading) return null;
  if (!user?.isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}
