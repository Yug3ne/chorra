import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user using TanStack Query with Convex
  const { data: user, isPending: isLoadingUser, error: userError } = useQuery(
    convexQuery(api.auth.getCurrentUser, {})
  );

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      return await authClient.signUp.email({
        email,
        password,
        name,
      });
    },
    onSuccess: () => {
      // Invalidate the user query to refetch
      queryClient.invalidateQueries(
        convexQuery(api.auth.getCurrentUser, {})
      );
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await authClient.signIn.email({
        email,
        password,
      });
    },
    onSuccess: () => {
      // Invalidate the user query to refetch
      queryClient.invalidateQueries(
        convexQuery(api.auth.getCurrentUser, {})
      );
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: () => {
      // Invalidate the user query
      queryClient.invalidateQueries(
        convexQuery(api.auth.getCurrentUser, {})
      );
    },
  });

  return {
    // User data
    user,
    isLoadingUser,
    userError,

    // Sign up
    signUp: signUpMutation.mutate,
    signUpAsync: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,

    // Sign in
    signIn: signInMutation.mutate,
    signInAsync: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,

    // Sign out
    signOut: signOutMutation.mutate,
    signOutAsync: signOutMutation.mutateAsync,
    isSigningOut: signOutMutation.isPending,
    signOutError: signOutMutation.error,
  };
}
