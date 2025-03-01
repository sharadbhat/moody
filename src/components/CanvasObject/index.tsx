import { Rnd } from "react-rnd";
import { useMoodyStore } from "../../utils/store";
import { FileType, type CanvasObject } from "../../utils/types";
import { useCanvasObject } from "../../hooks/useCanvasObject";

import "./index.css";

const CanvasObject = (canvasObject: CanvasObject) => {
  const scale = useMoodyStore((state) => state.scale);
  const offsetX = useMoodyStore((state) => state.offsetX);
  const offsetY = useMoodyStore((state) => state.offsetY);
  const snapToGrid = useMoodyStore((state) => state.snapToGrid);

  const { handleDragStop, handleResizeStop } = useCanvasObject();

  return (
    <Rnd
      key={canvasObject.id}
      position={{ x: offsetX + canvasObject.x, y: offsetY + canvasObject.y }}
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
          x: d.x - offsetX,
          y: d.y - offsetY,
        });
      }}
      onResizeStop={(_e, _direction, _ref, delta, position) => {
        handleResizeStop({
          id: canvasObject.id,
          delta,
          x: position.x - offsetX,
          y: position.y - offsetY,
        });
      }}
      dragGrid={snapToGrid ? [20, 20] : undefined}
      resizeGrid={snapToGrid ? [20, 20] : undefined}
    >
      <div>
        {canvasObject.fileType === FileType.IMAGE && (
          <img
            className={"canvasImage"}
            src={canvasObject.fileContent}
            onDrag={(e) => e.preventDefault()}
          />
        )}
      </div>
    </Rnd>
  );
};

export default CanvasObject;
