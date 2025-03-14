import { useRef } from "react";
import { useMoodyStore } from "../utils/store";
import { CanvasObject } from "../utils/types";

const GRID_SIZE = 20;

const useTransformObject = (canvasObject: CanvasObject) => {
  const {
    scale,
    offsetX,
    offsetY,
    snapToGrid,
    setCanvasObjectPosition,
    setCanvasObjectRotationAngle,
  } = useMoodyStore((state) => state);

  const draggingRef = useRef(false);
  const rotatingRef = useRef(false);
  const initialMousePositionRef = useRef({ x: 0, y: 0 });

  const animationFrameRef = useRef<number | null>(null);

  const handleDragDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;

    initialMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRotateDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    rotatingRef.current = true;

    document.addEventListener("mousemove", handleRotateMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRotateMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!rotatingRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const centerX =
        (canvasObject.x - offsetX + canvasObject.width / 2) * scale;
      const centerY =
        (canvasObject.y - offsetY + canvasObject.height / 2) * scale;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      angle += 90;

      setCanvasObjectRotationAngle(canvasObject.id, angle);
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!draggingRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      let deltaX = (e.clientX - initialMousePositionRef.current.x) / scale;
      let deltaY = (e.clientY - initialMousePositionRef.current.y) / scale;

      if (snapToGrid) {
        deltaX = Math.round(deltaX / GRID_SIZE) * GRID_SIZE;
        deltaY = Math.round(deltaY / GRID_SIZE) * GRID_SIZE;
      }

      setCanvasObjectPosition(
        canvasObject.id,
        canvasObject.x + deltaX,
        canvasObject.y + deltaY
      );
    });
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    rotatingRef.current = false;

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mousemove", handleRotateMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const Handles = () => {
    return (
      <>
        <div className="resize-handle edge left" />
        <div className="resize-handle edge right" />
        <div className="resize-handle edge top" />
        <div className="resize-handle edge bottom" />
        <div className="resize-handle corner top-left" />
        <div className="resize-handle corner top-right" />
        <div className="resize-handle corner bottom-left" />
        <div className="resize-handle corner bottom-right" />
        <div className="rotate-handle" onMouseDown={handleRotateDown} />
      </>
    );
  };

  return {
    Handles,
    handleDragDown,
  };
};

export default useTransformObject;
