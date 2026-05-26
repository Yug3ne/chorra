import { z } from "zod";
import { useState, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Zod schemas
const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpData = z.infer<typeof signUpSchema>;

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });

  const {
    signUpAsync,
    isSigningUp,
    signUpError,
    signInAsync,
    isSigningIn,
    signInError,
  } = useAuth();

  // Validation
  const validateField = useCallback(async (name: string, value: string) => {
    try {
      if (name === "email") {
        await z.string().email().parseAsync(value);
      } else if (name === "password") {
        await z.string().min(8).parseAsync(value);
      } else if (name === "name") {
        await z.string().min(2).parseAsync(value);
      }
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationErrors((prev) => ({
          ...prev,
          [name]: err.issues[0]?.message || "Invalid input",
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setValidationErrors({});

    try {
      const schema = isSignUp ? signUpSchema : signInSchema;
      const validation = await schema.safeParseAsync(formData);

      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path !== undefined) {
            errors[String(path)] = issue.message;
          }
        });
        setValidationErrors(errors);
        return;
      }

      if (isSignUp) {
        await signUpAsync({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      } else {
        await signInAsync({
          email: formData.email,
          password: formData.password,
        });
      }

      // Clear form on success
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error("Auth error:", err);
      // Error is handled via signUpError/signInError from the hook
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setValidationErrors({});
    setFormData({ name: "", email: "", password: "" });
  };

  const isSubmitting = isSigningUp || isSigningIn;
  const error = signUpError || signInError;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {isSignUp ? "Create Account" : "Welcome to Chora"}
            </h1>
            <p className="text-gray-500">
              {isSignUp
                ? "Sign up to start creating amazing whiteboards"
                : "Sign in to your account to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm">{validationErrors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={validationErrors.email ? "border-red-500" : ""}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={validationErrors.password ? "border-red-500" : ""}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-sm">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error instanceof Error ? error.message : "An error occurred"}
              </div>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting
                ? "Processing..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-gray-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleToggleMode}
            disabled={isSubmitting}
          >
            {isSignUp ? "Sign In Instead" : "Create an Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
