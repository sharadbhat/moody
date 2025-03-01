import { useEffect, useState } from "react";
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

  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    const url = event.dataTransfer?.getData("URL");

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleNewCanvasObject({
          fileType: FileType.IMAGE,
          fileContent: reader.result as string,
          x: event.clientX - offsetX,
          y: event.clientY - offsetY,
        });
      };
      reader.readAsDataURL(file);
    } else if (url && url.startsWith("http")) {
      handleNewCanvasObject({
        fileType: FileType.IMAGE,
        fileContent: url,
        x: event.clientX - offsetX,
        y: event.clientY - offsetY,
      });
    }
  };

  const handleWheelScroll = (event) => {
    event.preventDefault();

    const scaleDelta = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = scale * scaleDelta;

    if (newScale < 0.1) return setScale(0.1);
    if (newScale > 3) return setScale(3);
    // if (newScale > 0.95 && newScale < 1.05) return setScale(1);

    // Get mouse position relative to current canvas scale
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const worldX = (mouseX - offsetX) / scale;
    const worldY = (mouseY - offsetY) / scale;

    // Compute new offsets to keep zoom centered at mouse
    const newOffsetX = mouseX - worldX * newScale;
    const newOffsetY = mouseY - worldY * newScale;

    setOffset(newOffsetX, newOffsetY);
    setScale(newScale);
  };

  const handleMouseDown = (event) => {
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

    setOffset(offsetX + deltaX, offsetY + deltaY);

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
