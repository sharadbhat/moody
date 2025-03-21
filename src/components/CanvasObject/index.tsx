import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { Popover } from "@mantine/core";
import useTransformObject from "../../hooks/useTransformObject";
import { useState } from "react";
import { useClickOutside, useHover, useMergedRef } from "@mantine/hooks";
import { CONSTANTS } from "../../utils/constants";

const CanvasObject = (canvasObject: CanvasObject) => {
  const { Handles, handleDragDown, isDragging, isResizing, isRotating } =
    useTransformObject(canvasObject);

  const [isOpened, setIsOpened] = useState(false);

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const { hovered, ref: hoverRef } = useHover();
  const mergedRef = useMergedRef(hoverRef, clickOutsideRef);

  const { points } = canvasObject;

  const width = Math.sqrt(
    Math.pow(points.point2.x - points.point1.x, 2) +
      Math.pow(points.point2.y - points.point1.y, 2)
  );

  const height = Math.sqrt(
    Math.pow(points.point4.x - points.point1.x, 2) +
      Math.pow(points.point4.y - points.point1.y, 2)
  );

  const imageCenterX = width / 2;
  const imageCenterY = height / 2;

  const centerX = (points.point1.x + points.point3.x) / 2;
  const centerY = (points.point1.y + points.point3.y) / 2;

  const translateX = centerX - imageCenterX;
  const translateY = centerY - imageCenterY;

  const angle = Math.atan2(
    points.point2.y - points.point1.y,
    points.point2.x - points.point1.x
  );
  const angleInDegrees = (angle * 180) / Math.PI;

  const renderContent = () => {
    if (canvasObject.fileType === FileType.IMAGE) {
      return (
        <img
          className={`canvasImage ${
            isDragging || isResizing || isRotating || hovered || isOpened
              ? "canvasImageSelected"
              : ""
          }`}
          src={canvasObject.fileContent}
          draggable={false}
          onClick={() => setIsOpened(!isOpened)}
          onMouseDown={!canvasObject.locked && handleDragDown}
        />
      );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        transformOrigin: "center",
        width: width,
        height: height,
        transform: `translate(${translateX}px, ${translateY}px) rotate(${angleInDegrees}deg)`,
        cursor: canvasObject.locked
          ? CONSTANTS.CURSOR_DEFAULT
          : CONSTANTS.CURSOR_MOVE,
      }}
      ref={mergedRef}
    >
      {!canvasObject.locked && (
        <Handles show={isDragging || isResizing || isRotating || hovered} />
      )}
      <Popover
        opened={isOpened}
        onClose={() => setIsOpened(false)}
        position={canvasObject.locked ? "top" : "top-end"}
        styles={{ dropdown: { padding: 0 } }}
        withinPortal={false}
      >
        <Popover.Target>{renderContent()}</Popover.Target>
        <Popover.Dropdown>
          <CanvasObjectControls
            id={canvasObject.id}
            aspectRatioLocked={canvasObject.lockAspectRatio}
            locked={canvasObject.locked}
          />
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default CanvasObject;
