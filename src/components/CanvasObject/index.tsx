import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { useMoodyStore } from "../../utils/store";
import { HoverCard } from "@mantine/core";
import useTransformObject from "../../hooks/useTransformObject";

const CanvasObject = (canvasObject: CanvasObject) => {
  const { Handles, handleDragDown } = useTransformObject(canvasObject);

  const { scale, offsetX, offsetY } = useMoodyStore((state) => state);

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
        width: canvasObject.width * scale,
        height: canvasObject.height * scale,
        transform: `translate(${(canvasObject.x - offsetX) * scale}px, ${
          (canvasObject.y - offsetY) * scale
        }px) rotate(${canvasObject.rotationAngle || 0}deg)`,
      }}
      onMouseDown={handleDragDown}
    >
      <Handles />
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
