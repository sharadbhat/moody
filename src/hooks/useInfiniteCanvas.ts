import { FileType } from "../utils/types";
import { useCanvasObject } from "./useCanvasObject";
import { useMoodyStore } from "../utils/store";
import { useRef, useState } from "react";

export const useInfiniteCanvas = () => {
  const scale = useMoodyStore((state) => state.scale);
  const setScale = useMoodyStore((state) => state.setScale);

  const offsetXRef = useRef(useMoodyStore.getState().offsetX);
  const offsetYRef = useRef(useMoodyStore.getState().offsetY);
  const setOffset = useMoodyStore((state) => state.setOffset);

  const { handleNewCanvasObject } = useCanvasObject();

  const isPanning = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const animationFrameRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    const url = event.dataTransfer?.getData("URL");

    if (files.length > 0) {
      let prevX = 0;
      for (let file of files) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleNewCanvasObject({
              fileType: FileType.IMAGE,
              fileContent: reader.result as string,
              x: event.clientX + prevX,
              y: event.clientY,
            });
            prevX += 100; // Offset images by 100px if multiple dropped
          };
          reader.readAsDataURL(file);
        }
      }
    } else if (url && url.startsWith("http")) {
      handleNewCanvasObject({
        fileType: FileType.IMAGE,
        fileContent: url,
        x: event.clientX / scale,
        y: event.clientY / scale,
      });
    }
  };

  const handleWheelScroll = (event) => {
    event.preventDefault();

    const scaleDelta = event.deltaY > 0 ? 0.9 : 1.1;
    let newScale = scale * scaleDelta;

    if (newScale < 0.1) newScale = 0.1;
    else if (newScale > 3) newScale = 3;
    else if (newScale > 0.95 && newScale < 1.05) newScale = 1;

    const worldX = event.clientX / scale + offsetXRef.current;
    const worldY = event.clientY / scale + offsetYRef.current;

    const newOffsetX = worldX - event.clientX / newScale;
    const newOffsetY = worldY - event.clientY / newScale;

    offsetXRef.current = newOffsetX;
    offsetYRef.current = newOffsetY;

    setOffset(newOffsetX, newOffsetY);
    setScale(newScale);
  };

  const handleMouseDown = (event) => {
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;

    isPanning.current = true;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    if (!isPanning.current) {
      return;
    }

    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(() => {
        const deltaX = (event.clientX - startXRef.current) / scale;
        const deltaY = (event.clientY - startYRef.current) / scale;

        offsetXRef.current -= deltaX;
        offsetYRef.current -= deltaY;
        setOffset(offsetXRef.current, offsetYRef.current);

        startXRef.current = event.clientX;
        startYRef.current = event.clientY;
        animationFrameRef.current = null;
      });
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return {
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleMouseDown,
  };
};
