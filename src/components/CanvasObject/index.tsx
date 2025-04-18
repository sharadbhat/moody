import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { Popover } from "@mantine/core";
import useTransformObject from "../../hooks/useTransformObject";
import {
  useClickOutside,
  useDisclosure,
  useHover,
  useMergedRef,
} from "@mantine/hooks";
import { CONSTANTS } from "../../utils/constants";
import { useState } from "react";

const CanvasObject = (canvasObject: CanvasObject) => {
  const { Handles, handleDragDown, isDragging, isResizing, isRotating } =
    useTransformObject(canvasObject);

  const [opened, { close, toggle }] = useDisclosure(false);
  const [mouseDownTimestamp, setMouseDownTimestamp] = useState(0);

  const clickOutsideRef = useClickOutside(close);
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
            isDragging || isResizing || isRotating || hovered || opened
              ? "canvasImageSelected"
              : ""
          }`}
          src={canvasObject.fileContent}
          draggable={false}
          onClick={(e) => {
            e.stopPropagation();
            if (Date.now() - mouseDownTimestamp < 200) {
              toggle();
            }
          }}
          onMouseDown={(e) => {
            setMouseDownTimestamp(Date.now());
            if (!canvasObject.locked) {
              handleDragDown(e);
            }
          }}
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
        opened={opened}
        onClose={close}
        position={canvasObject.locked ? "top" : "top-end"}
        styles={{ dropdown: { padding: 0 } }}
        withinPortal={true}
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
