import "./index.css";
import CanvasObject from "../CanvasObject";
import CropSelectionTool from "./CropSelectionTool";
import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useMoodyStore } from "../../utils/store";
import { patterns } from "../../utils/patterns";
import { useMemo } from "react";

const InfiniteCanvas = () => {
  const {
    canvasObjectList,
    isCropping,
    scale,
    offsetX,
    offsetY,
    backgroundPatternId,
    patternColor,
    backgroundColor,
  } = useMoodyStore((state) => state);
  const { handleDragOver, handleDrop, handleWheelScroll, handleMouseDown } =
    useInfiniteCanvas();

  const [width, height] = [
    patterns[backgroundPatternId].width,
    patterns[backgroundPatternId].height,
  ];
  const backgroundSize = useMemo(
    () => `${width * scale * 2}px ${height * scale * 2}px`,
    [width, height, scale]
  );
  const backgroundPosition = useMemo(
    () => `${-offsetX * scale}px ${-offsetY * scale}px`,
    [offsetX, offsetY, scale]
  );

  return (
    <>
      <div className="infiniteCanvas" style={{ backgroundColor }}>
        <div
          className="infiniteCanvas_pattern"
          style={{
            backgroundColor:
              backgroundPatternId == 0 ? backgroundColor : patternColor,
            backgroundSize,
            backgroundPosition,
            maskImage: patterns[backgroundPatternId].svg,
            maskSize: backgroundSize,
            maskPosition: backgroundPosition,
            WebkitMaskImage: patterns[backgroundPatternId].svg,
            WebkitMaskSize: backgroundSize,
            WebkitMaskPosition: backgroundPosition,
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onWheel={!isCropping ? handleWheelScroll : null}
          onMouseDown={!isCropping ? handleMouseDown : null}
        />
        {canvasObjectList.map((canvasObject) => (
          <CanvasObject key={canvasObject.id} {...canvasObject} />
        ))}
      </div>
      {isCropping && <CropSelectionTool />}
    </>
  );
};

export default InfiniteCanvas;
