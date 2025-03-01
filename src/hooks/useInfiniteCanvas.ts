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

  useEffect(() => {
    // Adjust the canvas offset when the scale changes
    setOffset(offsetX / scale, offsetY / scale);
  }, [scale]);

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

    if (newScale < 0.1) {
      setScale(0.1);
      return;
    }

    if (newScale > 3) {
      setScale(3);
      return;
    }

    if (newScale > 0.95 && newScale < 1.05) {
      setScale(1);
      return;
    }

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

    setOffset(offsetX + deltaX / scale, offsetY + deltaY / scale);

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
