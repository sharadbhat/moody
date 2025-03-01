import { Rnd } from "react-rnd";
import { useMoodyStore } from "../../utils/store";
import { FileType, type CanvasObject } from "../../utils/types";
import { useCanvasObject } from "../../hooks/useCanvasObject";
import { useState } from "react";
import CanvasObjectControls from "../CanvasObjectControls";

import "./index.css";

const CanvasObject = (canvasObject: CanvasObject) => {
  const { scale, offsetX, offsetY, snapToGrid } = useMoodyStore(
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
      disableDragging={canvasObject.locked}
      enableResizing={!canvasObject.locked}
      onDragStart={(e) => {
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
      dragGrid={snapToGrid ? [20, 20] : undefined}
      resizeGrid={snapToGrid ? [20, 20] : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <CanvasObjectControls id={canvasObject.id} show={isHovered} />
      </div>
      {renderContent()}
    </Rnd>
  );
};

export default CanvasObject;
