import { useRef } from "react";
import { useMoodyStore } from "../utils/store";
import { FileType } from "../utils/types";
import { useCanvasObject } from "./useCanvasObject";

export const useInfiniteCanvas = () => {
  const stageRef = useRef(null);
  const {
    setSelectedCanvasObjectId,
    setSelectedCanvasObjectRef,
    setScale,
    setOffset,
  } = useMoodyStore();

  const { handleNewCanvasObject } = useCanvasObject();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getScaledPointerPosition = (e) => {
    const stage = stageRef.current;

    stage.setPointersPositions(e);
    const position = stage.getPointerPosition();

    const stageAttrs = stage.attrs;

    var x = (position.x - (stageAttrs.x || 0)) / (stageAttrs.scaleX || 1);
    var y = (position.y - (stageAttrs.y || 0)) / (stageAttrs.scaleY || 1);

    return { x, y };
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (!stageRef.current) return;

    const position = getScaledPointerPosition(e);

    const files = e.dataTransfer?.files;
    const url = e.dataTransfer?.getData("URL");

    if (files.length > 0) {
      let prevX = 0;
      for (let file of files) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            handleNewCanvasObject({
              fileType: FileType.IMAGE,
              fileContent: reader.result as string,
              x: position.x + prevX,
              y: position.y,
            });
            prevX += 100; // Offset images by 100px if multiple dropped
          };
          reader.readAsDataURL(file);
        }
      }
    } else if (url && url.startsWith("http")) {
      handleNewCanvasObject({
        fileType: FileType.IMAGE,
        fileContent: url,
        x: position.x,
        y: position.y,
      });
    }
  };

  const handleWheelScroll = (e) => {
    e.evt.preventDefault();

    setSelectedCanvasObjectId(null);

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? -1 : 1;

    let scaleBy = 1.1;
    if (e.evt.ctrlKey) {
      scaleBy = 1.025; // smoother scrolling on trackpad
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale < 0.1) newScale = 0.1;
    else if (newScale > 3) newScale = 3;

    stage.scale({ x: newScale, y: newScale });
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    setOffset(newPos.x, newPos.y);
  };

  const handleClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedCanvasObjectId(null);
      setSelectedCanvasObjectRef(null);
    }
  };

  return {
    stageRef,
    handleDragOver,
    handleDrop,
    handleWheelScroll,
    handleClick,
  };
};
