import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoginScreen } from "@/components/auth/login-screen";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <LoginScreen pending />;
  if (user) return <Navigate to="/" />;
  return <LoginScreen />;
}
