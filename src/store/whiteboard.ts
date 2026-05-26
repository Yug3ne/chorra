import { create } from "zustand";

export interface Sheet {
  id: string;
  title: string;
  updatedAt: number;
  createdAt: number;
}

export interface WhiteboardStore {
  // State
  activeSheetId: string | null;
  sheets: Sheet[];
  isLoading: boolean;
  isSaving: boolean;
  showSheetSwitcher: boolean;
  sidebarOpen: boolean;
  sidebarWidth: number;
  editingSheetId: string | null;

  // Actions
  setActiveSheet: (id: string) => void;
  addSheet: (sheet: Sheet) => void;
  removeSheet: (id: string) => void;
  updateSheetTitle: (id: string, title: string) => void;
  updateSheet: (sheet: Sheet) => void;
  updateSheets: (sheets: Sheet[]) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setShowSheetSwitcher: (show: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setEditingSheetId: (id: string | null) => void;
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  // Initial state
  activeSheetId: null,
  sheets: [],
  isLoading: false,
  isSaving: false,
  showSheetSwitcher: false,
  sidebarOpen: true,
  sidebarWidth: 256, // w-64 = 256px
  editingSheetId: null,

  // Actions
  setActiveSheet: (id) => set({ activeSheetId: id }),

  addSheet: (sheet) =>
    set((state) => ({
      sheets: [sheet, ...state.sheets],
    })),

  removeSheet: (id) =>
    set((state) => ({
      sheets: state.sheets.filter((s) => s.id !== id),
      activeSheetId:
        state.activeSheetId === id ? null : state.activeSheetId,
    })),

  updateSheetTitle: (id, title) =>
    set((state) => ({
      sheets: state.sheets.map((s) =>
        s.id === id ? { ...s, title } : s
      ),
    })),

  updateSheet: (sheet) =>
    set((state) => ({
      sheets: state.sheets.map((s) => (s.id === sheet.id ? sheet : s)),
    })),

  updateSheets: (sheets) =>
    set({
      sheets,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setSaving: (saving) => set({ isSaving: saving }),

  setShowSheetSwitcher: (show) => set({ showSheetSwitcher: show }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSidebarWidth: (width) => set({ sidebarWidth: width }),

  setEditingSheetId: (id) => set({ editingSheetId: id }),
}));
