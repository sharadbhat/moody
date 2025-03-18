import { useEffect, useRef } from "react";
import { useMoodyStore } from "../utils/store";
import { CanvasObject } from "../utils/types";

const GRID_SIZE = 20;

function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  cosA: number,
  sinA: number
) {
  return {
    x: cx + (px - cx) * cosA - (py - cy) * sinA,
    y: cy + (px - cx) * sinA + (py - cy) * cosA,
  };
}

/**
 * Converts canvas coordinates to local coordinates relative to the object's center and rotation.
 */
function getLocalPoints(
  points: {
    point1: { x: number; y: number };
    point2: { x: number; y: number };
    point3: { x: number; y: number };
    point4: { x: number; y: number };
  },
  centerX: number,
  centerY: number,
  cosA: number,
  sinA: number
) {
  return {
    point1: {
      x:
        cosA * (points.point1.x - centerX) + sinA * (points.point1.y - centerY),
      y:
        -sinA * (points.point1.x - centerX) +
        cosA * (points.point1.y - centerY),
    },
    point2: {
      x:
        cosA * (points.point2.x - centerX) + sinA * (points.point2.y - centerY),
      y:
        -sinA * (points.point2.x - centerX) +
        cosA * (points.point2.y - centerY),
    },
    point3: {
      x:
        cosA * (points.point3.x - centerX) + sinA * (points.point3.y - centerY),
      y:
        -sinA * (points.point3.x - centerX) +
        cosA * (points.point3.y - centerY),
    },
    point4: {
      x:
        cosA * (points.point4.x - centerX) + sinA * (points.point4.y - centerY),
      y:
        -sinA * (points.point4.x - centerX) +
        cosA * (points.point4.y - centerY),
    },
  };
}

/**
 * Converts a local coordinate back to canvas coordinates.
 */
function localToCanvas(
  localPoint: { x: number; y: number },
  centerX: number,
  centerY: number,
  cosA: number,
  sinA: number
) {
  return {
    x: centerX + localPoint.x * cosA - localPoint.y * sinA,
    y: centerY + localPoint.x * sinA + localPoint.y * cosA,
  };
}

/**
 * Resizes the object by adjusting its local points.
 *
 * If lockAspectRatio is true the resize will maintain the original aspect ratio,
 * using a fixed (anchored) edge or corner as the pivot.
 *
 * In local space we assume:
 *   - point1: top-left
 *   - point2: top-right
 *   - point3: bottom-right
 *   - point4: bottom-left
 *
 * @param direction - One of:
 *   "left", "right", "top", "bottom",
 *   "top-left", "top-right", "bottom-right", "bottom-left".
 * @param canvasObject - The object containing transformedPoints.
 * @param deltaX - The mouse movement delta along X (canvas space).
 * @param deltaY - The mouse movement delta along Y (canvas space).
 * @param lockAspectRatio - If true, the aspect ratio is maintained.
 * @returns Updated canvas points after resizing.
 */
function resizeObject(
  direction: string,
  canvasObject: any,
  deltaX: number,
  deltaY: number,
  lockAspectRatio: boolean = false
) {
  const { transformedPoints: points } = canvasObject;
  // Compute the object's center.
  const centerX = (points.point1.x + points.point3.x) / 2;
  const centerY = (points.point1.y + points.point3.y) / 2;

  // Compute rotation (using the top edge as reference).
  const angle = Math.atan2(
    points.point2.y - points.point1.y,
    points.point2.x - points.point1.x
  );
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Project the canvas delta into local space.
  const deltaLocalX = deltaX * cosA + deltaY * sinA;
  const deltaLocalY = -deltaX * sinA + deltaY * cosA;

  // Convert canvas points to local coordinates.
  const localPoints = getLocalPoints(points, centerX, centerY, cosA, sinA);
  // For clarity, define the four corners.
  const tl = { ...localPoints.point1 }; // top-left
  const tr = { ...localPoints.point2 }; // top-right
  const br = { ...localPoints.point3 }; // bottom-right
  const bl = { ...localPoints.point4 }; // bottom-left

  const originalWidth = Math.sqrt(
    Math.pow(points.point2.x - points.point1.x, 2) +
      Math.pow(points.point2.y - points.point1.y, 2)
  );

  const originalHeight = Math.sqrt(
    Math.pow(points.point4.x - points.point1.x, 2) +
      Math.pow(points.point4.y - points.point1.y, 2)
  );

  let newLocalPoints = { ...localPoints };

  if (!lockAspectRatio) {
    switch (direction) {
      case "left":
        newLocalPoints.point1.x = tl.x + deltaLocalX;
        newLocalPoints.point4.x = bl.x + deltaLocalX;
        break;
      case "right":
        newLocalPoints.point2.x = tr.x + deltaLocalX;
        newLocalPoints.point3.x = br.x + deltaLocalX;
        break;
      case "top":
        newLocalPoints.point1.y = tl.y + deltaLocalY;
        newLocalPoints.point2.y = tr.y + deltaLocalY;
        break;
      case "bottom":
        newLocalPoints.point3.y = br.y + deltaLocalY;
        newLocalPoints.point4.y = bl.y + deltaLocalY;
        break;
      case "top-left": {
        const newTopLeft = {
          x: localPoints.point1.x + deltaLocalX,
          y: localPoints.point1.y + deltaLocalY,
        };
        newLocalPoints = {
          point1: newTopLeft,
          point2: { x: localPoints.point3.x, y: newTopLeft.y },
          point3: localPoints.point3,
          point4: { x: newTopLeft.x, y: localPoints.point3.y },
        };
        break;
      }
      case "top-right": {
        const newTopRight = {
          x: localPoints.point2.x + deltaLocalX,
          y: localPoints.point2.y + deltaLocalY,
        };
        newLocalPoints = {
          point1: { x: localPoints.point4.x, y: newTopRight.y },
          point2: newTopRight,
          point3: { x: newTopRight.x, y: localPoints.point4.y },
          point4: localPoints.point4,
        };
        break;
      }
      case "bottom-right": {
        const newBottomRight = {
          x: localPoints.point3.x + deltaLocalX,
          y: localPoints.point3.y + deltaLocalY,
        };
        newLocalPoints = {
          point1: localPoints.point1,
          point2: { x: newBottomRight.x, y: localPoints.point1.y },
          point3: newBottomRight,
          point4: { x: localPoints.point1.x, y: newBottomRight.y },
        };
        break;
      }
      case "bottom-left": {
        const newBottomLeft = {
          x: localPoints.point4.x + deltaLocalX,
          y: localPoints.point4.y + deltaLocalY,
        };
        newLocalPoints = {
          point1: { x: newBottomLeft.x, y: localPoints.point2.y },
          point2: localPoints.point2,
          point3: { x: localPoints.point2.x, y: newBottomLeft.y },
          point4: newBottomLeft,
        };
        break;
      }
      default:
        break;
    }
  } else {
    switch (direction) {
      case "left": {
        const anchor = { ...tr };
        const proposed = { x: bl.x + deltaLocalX, y: bl.y + deltaLocalY };
        const newWidth = anchor.x - proposed.x;
        const scale = newWidth / originalWidth;
        const newBl = {
          x: anchor.x - originalWidth * scale,
          y: anchor.y + originalHeight * scale,
        };
        newLocalPoints = {
          point1: { x: newBl.x, y: anchor.y },
          point2: anchor,
          point3: { x: anchor.x, y: newBl.y },
          point4: newBl,
        };
        break;
      }
      case "right": {
        const anchor = { ...tl };
        const proposed = { x: br.x + deltaLocalX, y: br.y + deltaLocalY };
        const newWidth = proposed.x - anchor.x;
        const scale = newWidth / originalWidth;
        const newBr = {
          x: anchor.x + originalWidth * scale,
          y: anchor.y + originalHeight * scale,
        };
        newLocalPoints = {
          point1: anchor,
          point2: { x: newBr.x, y: anchor.y },
          point3: newBr,
          point4: { x: anchor.x, y: newBr.y },
        };
        break;
      }

      case "top-left": {
        const anchor = { ...br };
        const proposed = { x: tl.x + deltaLocalX, y: tl.y + deltaLocalY };
        const newHeight = anchor.y - proposed.y;
        const scale = newHeight / originalHeight;
        const newTl = {
          x: anchor.x - originalWidth * scale,
          y: anchor.y - originalHeight * scale,
        };
        newLocalPoints = {
          point1: newTl,
          point2: { x: anchor.x, y: newTl.y },
          point3: anchor,
          point4: { x: newTl.x, y: anchor.y },
        };
        break;
      }
      case "top":
      case "top-right": {
        const anchor = { ...bl };
        const proposed = { x: tr.x + deltaLocalX, y: tr.y + deltaLocalY };
        const newHeight = anchor.y - proposed.y;
        const scale = newHeight / originalHeight;
        const newTr = {
          x: anchor.x + originalWidth * scale,
          y: anchor.y - originalHeight * scale,
        };
        newLocalPoints = {
          point1: { x: anchor.x, y: newTr.y },
          point2: newTr,
          point3: { x: newTr.x, y: anchor.y },
          point4: anchor,
        };
        break;
      }
      case "bottom":
      case "bottom-right": {
        const anchor = { ...tl };
        const proposed = { x: br.x + deltaLocalX, y: br.y + deltaLocalY };
        const newHeight = proposed.y - anchor.y;
        const scale = newHeight / originalHeight;
        const newBr = {
          x: anchor.x + originalWidth * scale,
          y: anchor.y + originalHeight * scale,
        };
        newLocalPoints = {
          point1: anchor,
          point2: { x: newBr.x, y: anchor.y },
          point3: newBr,
          point4: { x: anchor.x, y: newBr.y },
        };
        break;
      }
      case "bottom-left": {
        const anchor = { ...tr };
        const proposed = { x: bl.x + deltaLocalX, y: bl.y + deltaLocalY };
        const newHeight = proposed.y - anchor.y;
        const scale = newHeight / originalHeight;
        const newBl = {
          x: anchor.x - originalWidth * scale,
          y: anchor.y + originalHeight * scale,
        };
        newLocalPoints = {
          point1: { x: newBl.x, y: anchor.y },
          point2: anchor,
          point3: { x: anchor.x, y: newBl.y },
          point4: newBl,
        };
        break;
      }
      default:
        break;
    }
  }

  const newPoints = {
    point1: localToCanvas(newLocalPoints.point1, centerX, centerY, cosA, sinA),
    point2: localToCanvas(newLocalPoints.point2, centerX, centerY, cosA, sinA),
    point3: localToCanvas(newLocalPoints.point3, centerX, centerY, cosA, sinA),
    point4: localToCanvas(newLocalPoints.point4, centerX, centerY, cosA, sinA),
  };

  return newPoints;
}

const useTransformObject = (canvasObject: CanvasObject) => {
  const {
    scale,
    offsetX,
    offsetY,
    snapToGrid,
    lastMousePosition,
    setCanvasObjectPosition,
  } = useMoodyStore((state) => state);

  const {
    id: canvasObjectId,
    transformedPoints,
    lockAspectRatio,
  } = canvasObject;

  const draggingRef = useRef(false);
  const rotatingRef = useRef(false);
  const resizingRef = useRef(false);
  const resizeDirectionRef = useRef<string | null>(null);
  const initialMousePositionRef = useRef({
    x: 0,
    y: 0,
  });
  const initialRotationRef = useRef(0);

  const animationFrameRef = useRef<number | null>(null);

  const offsetXRef = useRef(offsetX);
  const offsetYRef = useRef(offsetY);
  useEffect(() => {
    const { point1, point2, point3, point4 } = canvasObject.transformedPoints;

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

    // Use mouse position as scaling center
    const centerX = lastMousePosition ? lastMousePosition.x : 0;
    const centerY = lastMousePosition ? lastMousePosition.y : 0;

    // Apply scaling relative to mouse position
    const point1 = {
      x: centerX + (transformedPoints.point1.x - centerX) * scaleDelta,
      y: centerY + (transformedPoints.point1.y - centerY) * scaleDelta,
    };
    const point2 = {
      x: centerX + (transformedPoints.point2.x - centerX) * scaleDelta,
      y: centerY + (transformedPoints.point2.y - centerY) * scaleDelta,
    };
    const point3 = {
      x: centerX + (transformedPoints.point3.x - centerX) * scaleDelta,
      y: centerY + (transformedPoints.point3.y - centerY) * scaleDelta,
    };
    const point4 = {
      x: centerX + (transformedPoints.point4.x - centerX) * scaleDelta,
      y: centerY + (transformedPoints.point4.y - centerY) * scaleDelta,
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

    const centerX =
      (transformedPoints.point1.x + transformedPoints.point3.x) / 2;
    const centerY =
      (transformedPoints.point1.y + transformedPoints.point3.y) / 2;

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
      const centerX =
        (transformedPoints.point1.x + transformedPoints.point3.x) / 2;
      const centerY =
        (transformedPoints.point1.y + transformedPoints.point3.y) / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const newAngle = Math.atan2(deltaY, deltaX);

      let angleDiff = newAngle - initialRotationRef.current;

      const cosA = Math.cos(angleDiff);
      const sinA = Math.sin(angleDiff);

      const point1 = rotatePoint(
        transformedPoints.point1.x,
        transformedPoints.point1.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point2 = rotatePoint(
        transformedPoints.point2.x,
        transformedPoints.point2.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point3 = rotatePoint(
        transformedPoints.point3.x,
        transformedPoints.point3.y,
        centerX,
        centerY,
        cosA,
        sinA
      );

      const point4 = rotatePoint(
        transformedPoints.point4.x,
        transformedPoints.point4.y,
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
        x: transformedPoints.point1.x + deltaX,
        y: transformedPoints.point1.y + deltaY,
      };
      const point2 = {
        x: transformedPoints.point2.x + deltaX,
        y: transformedPoints.point2.y + deltaY,
      };
      const point3 = {
        x: transformedPoints.point3.x + deltaX,
        y: transformedPoints.point3.y + deltaY,
      };
      const point4 = {
        x: transformedPoints.point4.x + deltaX,
        y: transformedPoints.point4.y + deltaY,
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

    // Compute mouse delta from the initial mouse position.
    const deltaX = e.clientX - initialMousePositionRef.current.x;
    const deltaY = e.clientY - initialMousePositionRef.current.y;

    animationFrameRef.current = requestAnimationFrame(() => {
      // Use the current resize direction (could be any of the 8 options)
      const newPoints = resizeObject(
        resizeDirectionRef.current,
        canvasObject,
        deltaX,
        deltaY,
        lockAspectRatio
      );

      // Update the canvas object's position.
      setCanvasObjectPosition(canvasObjectId, newPoints);
    });
  };

  const handleMouseUp = () => {
    draggingRef.current = false;
    rotatingRef.current = false;

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mousemove", handleRotateMove);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const Handles = () => {
    return (
      <>
        <div
          className="resize-handle edge left"
          onMouseDown={(e) => handleResizeDown(e, "left")}
        />
        <div
          className="resize-handle edge right"
          onMouseDown={(e) => handleResizeDown(e, "right")}
        />
        <div
          className="resize-handle edge top"
          onMouseDown={(e) => handleResizeDown(e, "top")}
        />
        <div
          className="resize-handle edge bottom"
          onMouseDown={(e) => handleResizeDown(e, "bottom")}
        />
        <div
          className="resize-handle corner top-left"
          onMouseDown={(e) => handleResizeDown(e, "top-left")}
        />
        <div
          className="resize-handle corner top-right"
          onMouseDown={(e) => handleResizeDown(e, "top-right")}
        />
        <div
          className="resize-handle corner bottom-left"
          onMouseDown={(e) => handleResizeDown(e, "bottom-left")}
        />
        <div
          className="resize-handle corner bottom-right"
          onMouseDown={(e) => handleResizeDown(e, "bottom-right")}
        />
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
