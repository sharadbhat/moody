import { useMoodyStore } from "../utils/store";
import {
  CanvasObject,
  FileType,
  type CreateAndAddCanvasObjectProps,
  type HandleDragStopProps,
  type HandleResizeStopProps,
} from "../utils/types";

const MAX_DIMENSION = 300;

type CreateImageCanvasObjectProps = {
  x: number;
  y: number;
  imageObject: HTMLImageElement;
};

export const useCanvasObject = () => {
  const {
    scale,
    offsetX,
    offsetY,
    addCanvasObject,
    setCanvasObjectPosition,
    setCanvasObjectSizeAndPosition,
    removeCanvasObject,
    setCanvasObjectLock,
  } = useMoodyStore((state) => state);

  const createImageCanvasObject = ({
    x,
    y,
    imageObject,
  }: CreateImageCanvasObjectProps): CanvasObject => {
    let { width = 0, height = 0 } = imageObject || {};
    if (width > height && width > MAX_DIMENSION) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    } else if (height > MAX_DIMENSION) {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }

    return {
      id: `${Date.now()}`,
      x: x / scale + offsetX - width / 2,
      y: y / scale + offsetY - height / 2,
      width,
      height,
      fileType: FileType.IMAGE,
      fileContent: imageObject?.src || "",
      lockAspectRatio: true,
      locked: false,
    };
  };

  const handleNewCanvasObject = ({
    fileType,
    fileContent,
    x,
    y,
  }: CreateAndAddCanvasObjectProps) => {
    if (fileType === "IMAGE") {
      const img = new Image();
      img.onload = () => {
        addCanvasObject(
          createImageCanvasObject({
            x,
            y,
            imageObject: img,
          })
        );
      };
      img.src = fileContent;
    }
  };

  const handleDragStop = ({ id, x, y }: HandleDragStopProps) => {
    setCanvasObjectPosition(id, x, y);
  };

  const handleResizeStop = ({ id, delta, x, y }: HandleResizeStopProps) => {
    setCanvasObjectSizeAndPosition(id, delta.width, delta.height, x, y);
  };

  const handleDeleteCanvasObject = (id: string) => {
    removeCanvasObject(id);
  };

  const handleLockCanvasObject = (id: string, lockState: boolean) => {
    setCanvasObjectLock(id, lockState);
  };

  return {
    handleNewCanvasObject,
    handleDragStop,
    handleResizeStop,
    handleDeleteCanvasObject,
    handleLockCanvasObject,
  };
};
