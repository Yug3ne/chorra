import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { Login } from "./auth/Login";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isPending } = useQuery(
    convexQuery(api.auth.getCurrentUser, {})
  );

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your session</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}
