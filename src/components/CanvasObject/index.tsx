import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { Rnd } from "react-rnd";
import { useCanvasObject } from "../../hooks/useCanvasObject";
import { useMoodyStore } from "../../utils/store";
import { HoverCard } from "@mantine/core";

const GRID_SIZE = 20;

const CanvasObject = (canvasObject: CanvasObject) => {
  const { scale, offsetX, offsetY, snapToGrid, isCropping } = useMoodyStore(
    (state) => state
  );

  const { handleDragStop, handleResizeStop } = useCanvasObject();

  const renderContent = () => {
    if (canvasObject.fileType === FileType.IMAGE) {
      return (
        <img
          className={"canvasImage"}
          src={canvasObject.fileContent}
          draggable={false}
        />
      );
    }
  };

  const scaledGridSize = snapToGrid ? GRID_SIZE * scale : 1;

  return (
    <Rnd
      key={canvasObject.id}
      position={{
        x: (canvasObject.x - offsetX) * scale,
        y: (canvasObject.y - offsetY) * scale,
      }}
      size={{
        width: canvasObject.width * scale,
        height: canvasObject.height * scale,
      }}
      lockAspectRatio={canvasObject.lockAspectRatio}
      disableDragging={!isCropping ? canvasObject.locked : true}
      enableResizing={!isCropping ? !canvasObject.locked : false}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragStop={(_e, d) => {
        handleDragStop({
          id: canvasObject.id,
          x: d.x / scale + offsetX,
          y: d.y / scale + offsetY,
        });
      }}
      onResizeStop={(_e, _direction, _ref, delta, position) => {
        handleResizeStop({
          id: canvasObject.id,
          delta: {
            width: delta.width / scale,
            height: delta.height / scale,
          },
          x: position.x / scale + offsetX,
          y: position.y / scale + offsetY,
        });
      }}
      dragGrid={[scaledGridSize, scaledGridSize]}
      resizeGrid={[scaledGridSize, scaledGridSize]}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
      }}
    >
      <HoverCard
        closeDelay={250}
        styles={{
          dropdown: {
            padding: 0,
          },
        }}
        position="top"
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
    </Rnd>
  );
};

export default CanvasObject;
