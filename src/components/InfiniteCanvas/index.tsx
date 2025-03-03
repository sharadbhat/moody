import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useMoodyStore } from "../../utils/store";
import CanvasObject from "../CanvasObject";
import CropSelectionTool from "./CropSelectionTool";

import "./index.css";

const InfiniteCanvas = () => {
  const { canvasObjectList, isCropping } = useMoodyStore((state) => state);
  const {
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInfiniteCanvas();

  return (
    <>
      <div
        className="infiniteCanvas"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onWheel={!isCropping ? handleWheelScroll : null}
        onMouseDown={!isCropping ? handleMouseDown : null}
        onMouseMove={!isCropping ? handleMouseMove : null}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {canvasObjectList.map((canvasObject) => (
          <CanvasObject key={canvasObject.id} {...canvasObject} />
        ))}
      </div>
      {isCropping && <CropSelectionTool />}
    </>
  );
};

export default InfiniteCanvas;
