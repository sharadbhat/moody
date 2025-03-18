import {
  CanvasObject,
  type CreateAndAddCanvasObjectProps,
  FileType,
  type HandleDragStopProps,
  type HandleResizeStopProps,
} from "../utils/types";
import { useMoodyStore } from "../utils/store";

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
    setCanvasObjectLayerBack,
    setCanvasObjectLayerFront,
    setCanvasObjectLockAspectRatio,
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

    const x1 = x - width / 2;
    const y1 = y - height / 2;

    return {
      id: `${Date.now()}`,
      originalPoints: {
        point1: { x: x1, y: y1 },
        point2: { x: x1 + width, y: y1 },
        point3: { x: x1 + width, y: y1 + height },
        point4: { x: x1, y: y1 + height },
      },
      transformedPoints: {
        point1: { x: x1, y: y1 },
        point2: { x: x1 + width, y: y1 },
        point3: { x: x1 + width, y: y1 + height },
        point4: { x: x1, y: y1 + height },
      },
      rotationAngle: 0,
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

  const handleSendToBack = (id: string) => {
    setCanvasObjectLayerBack(id);
  };

  const handleBringToFront = (id: string) => {
    setCanvasObjectLayerFront(id);
  };

  const handleLockCanvasObjectAspectRatio = (
    id: string,
    lockState: boolean
  ) => {
    setCanvasObjectLockAspectRatio(id, lockState);
  };

  return {
    handleNewCanvasObject,
    handleDragStop,
    handleResizeStop,
    handleDeleteCanvasObject,
    handleLockCanvasObject,
    handleSendToBack,
    handleBringToFront,
    handleLockCanvasObjectAspectRatio,
  };
};
