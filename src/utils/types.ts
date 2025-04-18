export enum FileType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export type Point = {
  x: number;
  y: number;
};

export type CanvasObjectPoints = {
  point1: Point;
  point2: Point;
  point3: Point;
  point4: Point;
};

export interface CanvasObject {
  id: string;
  points: CanvasObjectPoints;
  rotationAngle: number;
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

export interface MoodyStore {
  boardId: string;
  boardName: string;
  canvasObjectList: CanvasObject[];
  backgroundPatternId: number;
  patternColor: string;
  backgroundColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
  lastMousePosition: Point;
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
  setLastMousePosition: (position: Point) => void;
  setBoardName: (boardName: string) => void;
  setBackgroundPatternId: (backgroundPatternId: number) => void;
  setPatternColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  addCanvasObject: (canvasObject: CanvasObject) => void;
  removeCanvasObject: (canvasObjectId: string) => void;
  setCanvasObjectLock: (canvasObjectId: string, lockState: boolean) => void;
  setCanvasObjectPosition: (id: string, points: CanvasObjectPoints) => void;
  setCanvasObjectLayerBack: (id: string) => void;
  setCanvasObjectLayerFront: (id: string) => void;
  setCanvasObjectLockAspectRatio: (id: string, lockState: boolean) => void;
  setCanvasObjectRotationAngle: (id: string, rotationAngle: number) => void;
  setStateFromIndexedDB: (stateFromDB: MoodyStore) => void;
  resetStore: () => void;
}

export interface DrawImageProps {
  src: string;
  id: string;
  x: number;
  y: number;
  height: number;
  width: number;
}
