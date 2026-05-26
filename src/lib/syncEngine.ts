export type SaveData = { elements: unknown[]; appState: unknown };

type SaveFunction = (data: SaveData) => Promise<void>;

export interface SyncEngineOptions {
  debounceMs?: number;
}

export class SyncEngine {
  debounceTimer: ReturnType<typeof setTimeout> | null = null;
  pendingSaveData: SaveData | null = null;
  onSave: SaveFunction;
  debounceMs: number;

  constructor(onSave: SaveFunction, options?: SyncEngineOptions) {
    this.onSave = onSave;
    this.debounceMs = options?.debounceMs ?? 1000;
  }

  onCanvasChange(elements: unknown[], appState: unknown) {
    this.pendingSaveData = { elements, appState };

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      if (this.pendingSaveData) {
        this.onSave(this.pendingSaveData);
        this.pendingSaveData = null;
      }
      this.debounceTimer = null;
    }, this.debounceMs);
  }

  cancel() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingSaveData = null;
  }
}
