import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { HoverCard } from "@mantine/core";
import useTransformObject from "../../hooks/useTransformObject";

const CanvasObject = (canvasObject: CanvasObject) => {
  const { Handles, handleDragDown } = useTransformObject(canvasObject);

  const { transformedPoints: points } = canvasObject;

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
          className="canvasImage"
          src={canvasObject.fileContent}
          draggable={false}
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
        cursor: canvasObject.locked ? "default" : "move",
      }}
      onMouseDown={!canvasObject.locked && handleDragDown}
    >
      {!canvasObject.locked && <Handles />}
      <HoverCard
        closeDelay={250}
        styles={{ dropdown: { padding: 0 } }}
        position="top-end"
      >
        <HoverCard.Target>{renderContent()}</HoverCard.Target>
        <HoverCard.Dropdown>
          <CanvasObjectControls
            id={canvasObject.id}
            aspectRatioLocked={canvasObject.lockAspectRatio}
            locked={canvasObject.locked}
          />
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default CanvasObject;
