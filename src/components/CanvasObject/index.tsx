import "./index.css";
import { type CanvasObject, FileType } from "../../utils/types";
import CanvasObjectControls from "../CanvasObjectControls";
import { Rnd } from "react-rnd";
import { useCanvasObject } from "../../hooks/useCanvasObject";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";

const GRID_SIZE = 20;

const CanvasObject = (canvasObject: CanvasObject) => {
  const { scale, offsetX, offsetY, snapToGrid, isCropping } = useMoodyStore(
    (state) => state
  );

  const { handleDragStop, handleResizeStop } = useCanvasObject();

  const [isHovered, setIsHovered] = useState(false);

  const renderContent = () => {
    if (canvasObject.fileType === FileType.IMAGE) {
      return (
        <img
          className={"canvasImage"}
          src={canvasObject.fileContent}
          onDrag={(e) => e.preventDefault()}
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
      onMouseEnter={() => setIsHovered(!isCropping ? true : false)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CanvasObjectControls
          id={canvasObject.id}
          show={isHovered}
          locked={canvasObject.locked}
        />
      </div>
      {renderContent()}
    </Rnd>
  );
};

export default CanvasObject;
