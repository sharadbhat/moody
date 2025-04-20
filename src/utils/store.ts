import type { MoodyStore, MoodyStoreState } from "./types";
import { create } from "zustand";

const initialState: MoodyStoreState = {
  boardId: `${Date.now()}`,
  boardName: "Untitled",
  canvasObjectList: [],
  backgroundPatternId: 0,
  patternColor: "#000000",
  backgroundColor: "#ffffff",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  lastMousePosition: { x: 0, y: 0 },

  // Global settings
  snapToGrid: false,
  isCropping: false,
  cropDimensions: {
    x: window.innerWidth / 2 - 250,
    y: window.innerHeight / 2 - 250,
    width: 500,
    height: 500,
  },
  boardList: [],
  boardLoading: false,
};

export const useMoodyStore = create<MoodyStore>()((set) => ({
  // State variables
  ...initialState,

  // Settings actions
  toggleSnapToGrid: () =>
    set((state) => ({
      snapToGrid: !state.snapToGrid,
    })),

  setIsCropping: (isCropping) =>
    set(() => ({
      isCropping,
    })),

  setCropDimensions: (x, y, width, height) =>
    set(() => ({
      cropDimensions: {
        x,
        y,
        width,
        height,
      },
    })),
  setLastMousePosition: (position) =>
    set(() => ({
      lastMousePosition: {
        x: position.x,
        y: position.y,
      },
    })),

  // State actions
  setBoardName: (boardName) =>
    set(() => ({
      boardName,
    })),

  setBackgroundPatternId: (backgroundPatternId) =>
    set(() => ({
      backgroundPatternId,
    })),

  setPatternColor: (patternColor) =>
    set(() => ({
      patternColor,
    })),

  setBackgroundColor: (backgroundColor) =>
    set(() => ({
      backgroundColor,
    })),

  setScale: (scale) =>
    set(() => ({
      scale,
    })),

  setOffset: (offsetX, offsetY) =>
    set(() => ({
      offsetX,
      offsetY,
    })),

  addCanvasObject: (canvasObject) =>
    set((state) => ({
      canvasObjectList: [...state.canvasObjectList, canvasObject],
    })),

  removeCanvasObject: (canvasObjectId) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.filter(
        (canvasObject) => canvasObject.id !== canvasObjectId
      ),
    })),

  setCanvasObjectLock: (canvasObjectId, lockState) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === canvasObjectId
          ? { ...canvasObject, locked: lockState }
          : canvasObject
      ),
    })),

  setCanvasObjectPosition: (id, points) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === id
          ? {
              ...canvasObject,
              points: points,
            }
          : canvasObject
      ),
    })),

  setCanvasObjectLayerBack: (id) =>
    set((state) => {
      const index = state.canvasObjectList.findIndex(
        (canvasObject) => canvasObject.id === id
      );
      if (index === 0) {
        return state;
      }

      const canvasObject = state.canvasObjectList[index];
      const newList = state.canvasObjectList.filter(
        (canvasObject) => canvasObject.id !== id
      );
      newList.unshift(canvasObject);

      return {
        canvasObjectList: newList,
      };
    }),

  setCanvasObjectLayerFront: (id) =>
    set((state) => {
      const index = state.canvasObjectList.findIndex(
        (canvasObject) => canvasObject.id === id
      );
      if (index === state.canvasObjectList.length - 1) {
        return state;
      }

      const canvasObject = state.canvasObjectList[index];
      const newList = state.canvasObjectList.filter(
        (canvasObject) => canvasObject.id !== id
      );
      newList.push(canvasObject);

      return {
        canvasObjectList: newList,
      };
    }),

  setCanvasObjectLockAspectRatio: (id, lockAspectRatio) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === id
          ? { ...canvasObject, lockAspectRatio: lockAspectRatio }
          : canvasObject
      ),
    })),

  setCanvasObjectRotationAngle: (id, rotationAngle) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === id
          ? { ...canvasObject, rotationAngle }
          : canvasObject
      ),
    })),

  setStateFromIndexedDB: (stateFromDB) =>
    set(() => ({
      ...stateFromDB,
    })),

  setBoardList: (boards) =>
    set(() => ({
      boardList: boards,
    })),

  resetStore: () =>
    set(() => ({
      ...initialState,
      boardId: `${Date.now()}`,
    })),

  setBoardLoading: (loading) =>
    set(() => ({
      boardLoading: loading,
    })),
}));
