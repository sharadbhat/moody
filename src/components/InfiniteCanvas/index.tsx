import "./index.css";
import CanvasObject from "../CanvasObject";
import CropSelectionTool from "./CropSelectionTool";
import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useMoodyStore } from "../../utils/store";
import { patterns } from "../../utils/patterns";

const InfiniteCanvas = () => {
  const {
    canvasObjectList,
    isCropping,
    scale,
    offsetX,
    offsetY,
    backgroundPatternId,
    foregroundColor,
    backgroundColor,
  } = useMoodyStore((state) => state);
  const {
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useInfiniteCanvas();

  const [width, height] = [
    patterns[backgroundPatternId].width,
    patterns[backgroundPatternId].height,
  ];
  const backgroundSize = `${width * scale * 2}px ${height * scale * 2}px`;
  const backgroundPosition = `${-offsetX}px ${-offsetY}px`;

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
        style={{
          backgroundColor,
        }}
      >
        <div
          className="infiniteCanvas_pattern"
          style={{
            backgroundColor:
              backgroundPatternId == 0 ? backgroundColor : foregroundColor,
            backgroundSize,
            backgroundPosition,
            maskImage: patterns[backgroundPatternId].svg,
            maskSize: backgroundSize,
            maskPosition: backgroundPosition,
            WebkitMaskImage: patterns[backgroundPatternId].svg,
            WebkitMaskSize: backgroundSize,
            WebkitMaskPosition: backgroundPosition,
          }}
        >
          {canvasObjectList.map((canvasObject) => (
            <CanvasObject key={canvasObject.id} {...canvasObject} />
          ))}
        </div>
      </div>
      {isCropping && <CropSelectionTool />}
    </>
  );
};

export default InfiniteCanvas;
