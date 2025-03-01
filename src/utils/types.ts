export enum FileType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
}

export interface CanvasObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fileType: FileType;
  fileContent: string;
  locked: boolean;
  lockAspectRatio: boolean;
}

export interface CreateAndAddCanvasObjectProps {
  fileType: FileType;
  fileContent: string;
  x: number;
  y: number;
}

export interface HandleDragStopProps {
  id: string;
  x: number;
  y: number;
}

export interface HandleResizeStopProps {
  id: string;
  delta: { width: number; height: number };
  x: number;
  y: number;
}

export interface MoodyStore {
  canvasObjectList: CanvasObject[];
  scale: number;
  offsetX: number;
  offsetY: number;
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  addCanvasObject: (canvasObject: CanvasObject) => void;
  removeCanvasObject: (canvasObjectId: string) => void;
  updateCanvasObjectPosition: (id: string, x: number, y: number) => void;
  updateCanvasObjectSize: (
    id: string,
    widthDelta: number,
    heightDelta: number,
    x: number,
    y: number
  ) => void;
}

export interface DrawImageProps {
  src: string;
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
}
