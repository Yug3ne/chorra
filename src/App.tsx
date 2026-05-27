import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { AuthLayout } from "@/layouts/auth-layout";
import { AppLayout } from "@/layouts/app-layout";
import { IndexRoute } from "./routes/index";
import { AuthRoute } from "./routes/auth";
import { SignInForm } from "@/components/auth/signin-form";
import { SignUpForm } from "@/components/auth/signup-form";

const router = createBrowserRouter([
	{
		element: <IndexRoute />,
		children: [
			{ index: true, element: <AppLayout /> },
		],
	},
	{
		path: "auth",
		element: <AuthRoute />,
		children: [
			{
				element: <AuthLayout />,
				children: [
					{ index: true, element: <SignInForm /> },
					{ path: "signup", element: <SignUpForm /> },
				],
			},
		],
	},
	{ path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
	return (
		<RouterProvider router={router} />
	);
}
