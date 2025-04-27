import { Ref, RefObject } from "react";

export enum FileType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
}

export type BoardData = {
  id: string;
  boardName: string;
};

export interface CanvasObject {
  id: string;
  x: number;
  y: number;
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

export interface MoodyStoreState {
  boardId: string;
  boardName: string;
  canvasObjectList: CanvasObject[];
  selectedCanvasObjectId: string;
  selectedCanvasObjectRef: RefObject<any>;
  selectedCanvasObjectLocked: boolean;
  backgroundPatternId: number;
  patternColor: string;
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
  boardList: BoardData[];
  boardLoading: boolean;
}

export interface MoodyStore extends MoodyStoreState {
  toggleSnapToGrid: () => void;
  setIsCropping: (isCropping: boolean) => void;
  setCropDimensions: (
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
  setBoardName: (boardName: string) => void;
  setSelectedCanvasObjectId: (canvasObjectId: string) => void;
  setSelectedCanvasObjectRef: (ref: RefObject<any>) => void;
  setSelectedCanvasObjectLocked: (locked: boolean) => void;
  setBackgroundPatternId: (backgroundPatternId: number) => void;
  setPatternColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  setScale: (scale: number) => void;
  setOffset: (offsetX: number, offsetY: number) => void;
  addCanvasObject: (canvasObject: CanvasObject) => void;
  removeCanvasObject: (canvasObjectId: string) => void;
  setCanvasObjectLock: (canvasObjectId: string, lockState: boolean) => void;
  setCanvasObjectPosition: (id: string, points: any) => void;
  setCanvasObjectLayerBack: (id: string) => void;
  setCanvasObjectLayerFront: (id: string) => void;
  setCanvasObjectLockAspectRatio: (id: string, lockState: boolean) => void;
  setCanvasObjectRotationAngle: (id: string, rotationAngle: number) => void;
  setStateFromIndexedDB: (stateFromDB: MoodyStore) => void;
  setBoardList: (boards: BoardData[]) => void;
  setBoardLoading: (loading: boolean) => void;
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
