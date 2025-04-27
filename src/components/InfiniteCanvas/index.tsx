import { Layer, Stage, Transformer } from "react-konva";
import "./index.css";
import { CanvasObject } from "../CanvasObject";
import { useInfiniteCanvas } from "../../hooks/useInfiniteCanvas";
import { useEffect, useRef } from "react";
import { useMoodyStore } from "../../utils/store";
import { CONSTANTS } from "../../utils/constants";
const InfiniteCanvas = () => {
  const {
    stageRef,
    handleClick,
    handleDragOver,
    handleDrop,
    handleWheelScroll,
  } = useInfiniteCanvas();

  const {
    canvasObjectList,
    selectedCanvasObjectRef,
    selectedCanvasObjectId,
    selectedCanvasObjectLocked,
    scale,
    offsetX,
    offsetY,
    setOffset,
  } = useMoodyStore();

  const transformerRef = useRef(null);

  useEffect(() => {
    if (
      selectedCanvasObjectRef &&
      selectedCanvasObjectId &&
      !selectedCanvasObjectLocked
    ) {
      transformerRef.current.nodes([selectedCanvasObjectRef.current]);
    } else {
      transformerRef.current.nodes([]);
    }
  }, [
    selectedCanvasObjectRef,
    selectedCanvasObjectId,
    selectedCanvasObjectLocked,
  ]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: "relative" }}
    >
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        ref={stageRef}
        onWheel={handleWheelScroll}
        onClick={handleClick}
        scaleX={scale}
        scaleY={scale}
        x={offsetX}
        y={offsetY}
        onDragEnd={() => {
          const stage = stageRef.current;
          if (stage) {
            setOffset(stage.x(), stage.y());
          }
        }}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            document.body.style.cursor = CONSTANTS.CURSOR_GRABBING;
          }
        }}
        onMouseUp={(e) => {
          if (e.target === e.target.getStage()) {
            document.body.style.cursor = CONSTANTS.CURSOR_DEFAULT;
          }
        }}
      >
        <Layer>
          {canvasObjectList.map((imgObj) => {
            return (
              <CanvasObject
                key={imgObj.id}
                id={imgObj.id}
                src={imgObj.fileContent}
                x={imgObj.x}
                y={imgObj.y}
                locked={imgObj.locked}
                aspectRatioLocked={imgObj.lockAspectRatio}
              />
            );
          })}
          <Transformer
            ref={transformerRef}
            keepRatio={false}
            borderStroke="black"
            borderStrokeWidth={2}
            anchorCornerRadius={50}
            anchorFill="white"
            anchorStroke="black"
            anchorStrokeWidth={2}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default InfiniteCanvas;
