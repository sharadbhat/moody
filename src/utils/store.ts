import { create } from "zustand";
import type { MoodyStore } from "./types";

export const useMoodyStore = create<MoodyStore>()((set) => ({
  // State variables
  boardName: "Board name",
  canvasObjectList: [],
  scale: 1,
  offsetX: 0,
  offsetY: 0,

  // Global settings
  snapToGrid: false,

  // Settings actions
  toggleSnapToGrid: () =>
    set((state) => ({
      snapToGrid: !state.snapToGrid,
    })),

  // State actions
  setBoardName: (boardName) =>
    set(() => ({
      boardName,
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

  setCanvasObjectPosition: (id, x, y) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === id ? { ...canvasObject, x, y } : canvasObject
      ),
    })),

  setCanvasObjectSizeAndPosition: (id, widthDelta, heightDelta, x, y) =>
    set((state) => ({
      canvasObjectList: state.canvasObjectList.map((canvasObject) =>
        canvasObject.id === id
          ? {
              ...canvasObject,
              width: canvasObject.width + widthDelta,
              height: canvasObject.height + heightDelta,
              x,
              y,
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
}));
