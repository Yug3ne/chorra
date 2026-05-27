import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "http://localhost:3210"
);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        {children}
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  );
}
