import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useMoodyStore } from "../../utils/store";
import CanvasObject from "../CanvasObject";

import "./index.css";

const InfiniteCanvas = () => {
  const { canvasObjectList } = useMoodyStore((state) => state);
  const {
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInfiniteCanvas();

  return (
    <div
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onWheel={handleWheelScroll}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {canvasObjectList.map((canvasObject) => (
        <CanvasObject key={canvasObject.id} {...canvasObject} />
      ))}
    </div>
  );
};

export default InfiniteCanvas;
