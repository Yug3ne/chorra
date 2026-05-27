import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";

import { SheetSwitcher } from "@/components/SheetSwitcher";
import { MainLayout } from "@/components/layout/MainLayout";

export function AppLayout() {
	useKeyboardShortcuts();

	return (
		<>
			<MainLayout />
			<SheetSwitcher />
		</>
	);
}
