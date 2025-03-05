import "./index.css";
import CanvasObject from "../CanvasObject";
import CropSelectionTool from "./CropSelectionTool";
import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useMoodyStore } from "../../utils/store";

const InfiniteCanvas = () => {
  const { canvasObjectList, isCropping, backgroundColor } = useMoodyStore(
    (state) => state
  );
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
        style={{ backgroundColor }}
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
