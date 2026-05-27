import { Outlet } from "react-router";

export function AuthLayout() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-4">
			<Outlet />
		</div>
	);
}
