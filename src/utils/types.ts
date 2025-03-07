export enum FileType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
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
  boardName: string;
  canvasObjectList: CanvasObject[];
  backgroundPatternId: number;
  foregroundColor: string;
  backgroundColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  isCropping: boolean;
  cropDimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  setIsCropping: (isCropping: boolean) => void;
  setCropDimensions: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  setBoardName: (boardName: string) => void;
  setBackgroundPatternId: (backgroundPatternId: number) => void;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  addCanvasObject: (canvasObject: CanvasObject) => void;
  removeCanvasObject: (canvasObjectId: string) => void;
  setCanvasObjectLock: (canvasObjectId: string, lockState: boolean) => void;
  setCanvasObjectPosition: (id: string, x: number, y: number) => void;
  setCanvasObjectSizeAndPosition: (
    id: string,
    widthDelta: number,
    heightDelta: number,
    x: number,
    y: number
  ) => void;
  setCanvasObjectLayerBack: (id: string) => void;
  setCanvasObjectLayerFront: (id: string) => void;
}

export interface DrawImageProps {
  src: string;
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
}
