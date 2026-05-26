type SaveFunction = (data: { elements: any[]; appState: any }) => Promise<void>;

export class SyncEngine {
  debounceTimer: ReturnType<typeof setTimeout> | null = null;
  pendingSaveData: {
    elements: any[];
    appState: any;
  } | null = null;
  onSave: SaveFunction;

  constructor(onSave: SaveFunction) {
    this.onSave = onSave;
  }

  onCanvasChange(elements: any[], appState: any) {
    this.pendingSaveData = { elements, appState };

    // Cancel previous timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer: 1000ms delay
    this.debounceTimer = setTimeout(() => {
      if (this.pendingSaveData) {
        this.onSave(this.pendingSaveData);
        this.pendingSaveData = null;
      }
      this.debounceTimer = null;
    }, 1000);
  }

  cancel() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingSaveData = null;
  }
}
