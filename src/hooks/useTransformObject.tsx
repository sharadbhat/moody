import { useEffect, useRef, useState } from "react";
import { useMoodyStore } from "../utils/store";
import { CanvasObject } from "../utils/types";
import { resizeObject, rotatePoint } from "../utils/helpers";
import { CONSTANTS } from "../utils/constants";

const GRID_SIZE = 20;

const useTransformObject = (canvasObject: CanvasObject) => {
  const {
    scale,
    offsetX,
    offsetY,
    snapToGrid,
    lastMousePosition,
    setCanvasObjectPosition,
  } = useMoodyStore((state) => state);

  const { id: canvasObjectId, points, lockAspectRatio } = canvasObject;

  const draggingRef = useRef(false);
  const rotatingRef = useRef(false);
  const resizingRef = useRef(false);
  const resizeDirectionRef = useRef<string | null>(null);
  const initialMousePositionRef = useRef({
    x: 0,
    y: 0,
  });
  const initialRotationRef = useRef(0);
  const currentRotationRef = useRef(0);

  const animationFrameRef = useRef<number | null>(null);

  const [showHandles, setShowHandles] = useState(false);

  const offsetXRef = useRef(offsetX);
  const offsetYRef = useRef(offsetY);
  useEffect(() => {
    const { point1, point2, point3, point4 } = canvasObject.points;

    const offsetXDiff = offsetX - offsetXRef.current;
    const offsetYDiff = offsetY - offsetYRef.current;

    offsetXRef.current = offsetX;
    offsetYRef.current = offsetY;

    const transformedPoints = {
      point1: {
        x: point1.x - offsetXDiff,
        y: point1.y - offsetYDiff,
      },
      point2: {
        x: point2.x - offsetXDiff,
        y: point2.y - offsetYDiff,
      },
      point3: {
        x: point3.x - offsetXDiff,
        y: point3.y - offsetYDiff,
      },
      point4: {
        x: point4.x - offsetXDiff,
        y: point4.y - offsetYDiff,
      },
    };

    setCanvasObjectPosition(canvasObjectId, transformedPoints);
  }, [offsetX, offsetY]);

  const scaleRef = useRef(scale);
  useEffect(() => {
    if (scale === scaleRef.current) return;

    const scaleDelta = scale / scaleRef.current;

    const centerX = lastMousePosition ? lastMousePosition.x : 0;
    const centerY = lastMousePosition ? lastMousePosition.y : 0;

    const point1 = {
      x: centerX + (points.point1.x - centerX) * scaleDelta,
      y: centerY + (points.point1.y - centerY) * scaleDelta,
    };
    const point2 = {
      x: centerX + (points.point2.x - centerX) * scaleDelta,
      y: centerY + (points.point2.y - centerY) * scaleDelta,
    };
    const point3 = {
      x: centerX + (points.point3.x - centerX) * scaleDelta,
      y: centerY + (points.point3.y - centerY) * scaleDelta,
    };
    const point4 = {
      x: centerX + (points.point4.x - centerX) * scaleDelta,
      y: centerY + (points.point4.y - centerY) * scaleDelta,
    };

    setCanvasObjectPosition(canvasObjectId, {
      point1,
      point2,
      point3,
      point4,
    });

    scaleRef.current = scale;
  }, [scale, lastMousePosition]);

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

    const centerX = (points.point1.x + points.point3.x) / 2;
    const centerY = (points.point1.y + points.point3.y) / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const initialAngle = Math.atan2(deltaY, deltaX);

    initialRotationRef.current = initialAngle;

    document.addEventListener("mousemove", handleRotateMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = true;
    resizeDirectionRef.current = direction;

    initialMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRotateMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!rotatingRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const centerX = (points.point1.x + points.point3.x) / 2;
      const centerY = (points.point1.y + points.point3.y) / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const newAngle = Math.atan2(deltaY, deltaX);
      currentRotationRef.current = (newAngle * 180) / Math.PI + 90;

      let angleDiff = newAngle - initialRotationRef.current;

      const cosA = Math.cos(angleDiff);
      const sinA = Math.sin(angleDiff);

      const point1 = rotatePoint(
        points.point1.x,
        points.point1.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point2 = rotatePoint(
        points.point2.x,
        points.point2.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point3 = rotatePoint(
        points.point3.x,
        points.point3.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point4 = rotatePoint(
        points.point4.x,
        points.point4.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      setCanvasObjectPosition(canvasObjectId, {
        point1,
        point2,
        point3,
        point4,
      });
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!draggingRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      let deltaX = e.clientX - initialMousePositionRef.current.x;
      let deltaY = e.clientY - initialMousePositionRef.current.y;

      if (snapToGrid) {
        deltaX = Math.round(deltaX / GRID_SIZE) * GRID_SIZE;
        deltaY = Math.round(deltaY / GRID_SIZE) * GRID_SIZE;
      }

      const point1 = {
        x: points.point1.x + deltaX,
        y: points.point1.y + deltaY,
      };
      const point2 = {
        x: points.point2.x + deltaX,
        y: points.point2.y + deltaY,
      };
      const point3 = {
        x: points.point3.x + deltaX,
        y: points.point3.y + deltaY,
      };
      const point4 = {
        x: points.point4.x + deltaX,
        y: points.point4.y + deltaY,
      };

      setCanvasObjectPosition(canvasObjectId, {
        point1,
        point2,
        point3,
        point4,
      });
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!resizingRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const deltaX = e.clientX - initialMousePositionRef.current.x;
    const deltaY = e.clientY - initialMousePositionRef.current.y;

    animationFrameRef.current = requestAnimationFrame(() => {
      const newPoints = resizeObject(
        resizeDirectionRef.current,
        canvasObject,
        deltaX,
        deltaY,
        lockAspectRatio
      );

      setCanvasObjectPosition(canvasObjectId, newPoints);
    });
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    draggingRef.current = false;
    rotatingRef.current = false;
    resizingRef.current = false;

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mousemove", handleRotateMove);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const Handles = ({ show }) => {
    useEffect(() => {
      setShowHandles(show);
    }, [show]);

    return (
      <>
        <div
          className={`resize-handle left`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current + 45}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "left")}
        />
        <div
          className={`resize-handle right`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current + 45}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "right")}
        />
        <div
          className={`resize-handle top`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current - 45}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "top")}
        />
        <div
          className={`resize-handle bottom`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current - 45}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "bottom")}
        />
        <div
          className={`resize-handle ${showHandles ? "corner" : ""} top-left`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current - 90}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "top-left")}
        />
        <div
          className={`resize-handle ${showHandles ? "corner" : ""} top-right`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "top-right")}
        />
        <div
          className={`resize-handle ${showHandles ? "corner" : ""} bottom-left`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "bottom-left")}
        />
        <div
          className={`resize-handle ${
            showHandles ? "corner" : ""
          } bottom-right`}
          style={{
            cursor: CONSTANTS.CURSOR_RESIZE.replace(
              "{rotationAngle}",
              `${currentRotationRef.current - 90}`
            ),
          }}
          onMouseDown={(e) => handleResizeDown(e, "bottom-right")}
        />
        <div className={"rotate-handle"} onMouseDown={handleRotateDown} />
      </>
    );
  };

  return {
    Handles,
    handleDragDown,
    isDragging: draggingRef.current,
    isRotating: rotatingRef.current,
    isResizing: resizingRef.current,
  };
};

export default useTransformObject;
