import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

export function SignInForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
	});

	const onSubmit = async (data: SignInValues) => {
		const { error } = await authClient.signIn.email({
			email: data.email,
			password: data.password,
		});

		if (error) {
			toast.error(error.message || "Unable to sign in");
			return;
		}

		toast.success("Signed in");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1.5">
				<label htmlFor="signin-email" className="text-sm font-medium">
					Email
				</label>
				<Input
					id="signin-email"
					type="email"
					placeholder="you@example.com"
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-xs text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<label htmlFor="signin-password" className="text-sm font-medium">
					Password
				</label>
				<Input
					id="signin-password"
					type="password"
					placeholder="••••••••"
					{...register("password")}
				/>
				{errors.password && (
					<p className="text-xs text-destructive">
						{errors.password.message}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Signing in..." : "Sign in"}
			</Button>
		</form>
	)
}
