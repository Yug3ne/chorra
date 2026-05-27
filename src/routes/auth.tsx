import { useQuery } from "convex/react";
import { Navigate, Outlet } from "react-router";

import { api } from "../../convex/_generated/api";

export function AuthRoute() {
	const user = useQuery(api.auth.getCurrentUser, {});

	if (user === undefined) {
		return (
			<div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
				<div className="text-center">
					<h2 className="mb-2 text-2xl font-bold">Loading...</h2>
					<p className="text-sm text-muted-foreground">
						Please wait while we verify your session
					</p>
				</div>
			</div>
		);
	}

	if (user) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
