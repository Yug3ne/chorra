export interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: string;
  strokeWidth: number;
  strokeStyle: string;
  roughness: number;
  opacity: number;
  groupIds: string[];
  frameId: string | null;
  roundness: { type: number } | null;
  seed: number;
  version: number;
  versionNonce: number;
  isDeleted: boolean;
  boundElements: { id: string; type: string }[] | null;
  updated: number;
  link: string | null;
  locked: boolean;
  index: string;
  [key: string]: unknown;
}

export interface ExcalidrawAppState {
  zoom: { value: number };
  scrollX: number;
  scrollY: number;
  theme?: string;
  collaborators?: Record<string, unknown>;
  viewBackgroundColor?: string;
  gridSize?: number;
  name?: string;
  selectedElementIds?: Record<string, boolean>;
  [key: string]: unknown;
}
