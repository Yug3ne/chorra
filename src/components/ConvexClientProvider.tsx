import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "http://localhost:3210"
);

// Set up TanStack Query with Convex
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

// Connect Convex to TanStack Query
convexQueryClient.connect(queryClient);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          {children}
        </ConvexBetterAuthProvider>
      </QueryClientProvider>
    </ConvexProvider>
  );
}
