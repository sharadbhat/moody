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
      className="infiniteCanvas"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onWheel={handleWheelScroll}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {canvasObjectList.map((canvasObject) => (
        <CanvasObject key={canvasObject.id} {...canvasObject} />
      ))}
    </div>
  );
};

export default InfiniteCanvas;
