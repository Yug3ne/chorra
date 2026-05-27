import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signupSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Please enter a valid email"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupValues = z.infer<typeof signupSchema>;

export function SignUpForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupValues>({
		resolver: zodResolver(signupSchema),
	});

	const onSubmit = async (data: SignupValues) => {
		const { error } = await authClient.signUp.email({
			name: data.name,
			email: data.email,
			password: data.password,
		});

		if (error) {
			toast.error(error.message || "Unable to create account");
			return;
		}

		toast.success("Account created");
		navigate("/");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1.5">
				<label htmlFor="signup-name" className="text-sm font-medium">
					Full Name
				</label>
				<Input
					id="signup-name"
					placeholder="Jane Mwangi"
					{...register("name")}
				/>
				{errors.name && (
					<p className="text-xs text-destructive">{errors.name.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<label htmlFor="signup-email" className="text-sm font-medium">
					Email
				</label>
				<Input
					id="signup-email"
					type="email"
					placeholder="you@example.com"
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-xs text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-1.5">
				<label htmlFor="signup-password" className="text-sm font-medium">
					Password
				</label>
				<Input
					id="signup-password"
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

			<div className="space-y-1.5">
				<label htmlFor="signup-confirm" className="text-sm font-medium">
					Confirm Password
				</label>
				<Input
					id="signup-confirm"
					type="password"
					placeholder="••••••••"
					{...register("confirmPassword")}
				/>
				{errors.confirmPassword && (
					<p className="text-xs text-destructive">
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Creating account..." : "Create account"}
			</Button>
		</form>
	)
}
