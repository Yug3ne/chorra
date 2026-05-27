import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";

export function useAuth() {
  const user = useQuery(api.auth.getCurrentUser, {});
  const [authError, setAuthError] = useState<Error | null>(null);

  const signUp = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      setAuthError(null);
      return await authClient.signUp.email({
        email,
        password,
        name,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An error occurred");
      setAuthError(err);
      throw err;
    }
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setAuthError(null);
      return await authClient.signIn.email({
        email,
        password,
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An error occurred");
      setAuthError(err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setAuthError(null);
      await authClient.signOut();
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An error occurred");
      setAuthError(err);
      throw err;
    }
  };

  return {
    // User data
    user,
    isLoadingUser: user === undefined,
    userError: authError,

    // Sign up
    signUp,
    signUpAsync: signUp,
    isSigningUp: false,
    signUpError: authError,

    // Sign in
    signIn,
    signInAsync: signIn,
    isSigningIn: false,
    signInError: authError,

    // Sign out
    signOut,
    signOutAsync: signOut,
    isSigningOut: false,
    signOutError: authError,
  };
}
