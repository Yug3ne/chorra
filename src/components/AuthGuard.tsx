import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Login } from "./auth/Login";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.auth.getCurrentUser);

  if (user === undefined) {
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
