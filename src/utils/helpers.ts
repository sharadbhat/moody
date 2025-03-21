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

function resizeObject(
  direction: string,
  canvasObject: any,
  deltaX: number,
  deltaY: number,
  lockAspectRatio: boolean = false
) {
  const { points: points } = canvasObject;
  const centerX = (points.point1.x + points.point3.x) / 2;
  const centerY = (points.point1.y + points.point3.y) / 2;

  const angle = Math.atan2(
    points.point2.y - points.point1.y,
    points.point2.x - points.point1.x
  );
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const deltaLocalX = deltaX * cosA + deltaY * sinA;
  const deltaLocalY = -deltaX * sinA + deltaY * cosA;

  const localPoints = getLocalPoints(points, centerX, centerY, cosA, sinA);
  const tl = { ...localPoints.point1 };
  const tr = { ...localPoints.point2 };
  const br = { ...localPoints.point3 };
  const bl = { ...localPoints.point4 };

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

export { rotatePoint, resizeObject };
