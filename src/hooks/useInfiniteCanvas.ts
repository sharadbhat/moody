import { useState } from "react";
import { useMoodyStore } from "../utils/store";
import { FileType } from "../utils/types";
import { useCanvasObject } from "./useCanvasObject";

export const useInfiniteCanvas = () => {
  const scale = useMoodyStore((state) => state.scale);
  const offsetX = useMoodyStore((state) => state.offsetX);
  const offsetY = useMoodyStore((state) => state.offsetY);

  const setScale = useMoodyStore((state) => state.setScale);
  const setOffset = useMoodyStore((state) => state.setOffset);

  const { handleNewCanvasObject } = useCanvasObject();

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    const url = event.dataTransfer?.getData("URL");

    if (files.length !== 0) {
      let prevX = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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

    const worldX = event.clientX / scale + offsetX;
    const worldY = event.clientY / scale + offsetY;

    // Compute new offsets to keep zoom centered at mouse
    const newOffsetX = worldX - event.clientX / newScale;
    const newOffsetY = worldY - event.clientY / newScale;

    setOffset(newOffsetX, newOffsetY);
    setScale(newScale);
  };

  const handleMouseDown = (event) => {
    console.log("mouse down");

    setStartX(event.clientX);
    setStartY(event.clientY);

    setIsPanning(true);
  };

  const handleMouseMove = (event) => {
    if (!isPanning) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    setOffset(offsetX - deltaX / scale, offsetY - deltaY / scale);

    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleMouseUp = (_event) => {
    setStartX(0);
    setStartY(0);

    setIsPanning(false);
  };

  return {
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
