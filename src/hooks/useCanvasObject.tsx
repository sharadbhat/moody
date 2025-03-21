import {
  CanvasObject,
  type CreateAndAddCanvasObjectProps,
  FileType,
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
    addCanvasObject,
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
    const scaledMaxDimension = MAX_DIMENSION * scale;
    if (width > height && width > scaledMaxDimension) {
      height = Math.round((height * scaledMaxDimension) / width);
      width = scaledMaxDimension;
    } else if (height > scaledMaxDimension) {
      width = Math.round((width * scaledMaxDimension) / height);
      height = scaledMaxDimension;
    }

    const x1 = x - width / 2;
    const y1 = y - height / 2;

    return {
      id: `${Date.now()}`,
      points: {
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
    handleDeleteCanvasObject,
    handleLockCanvasObject,
    handleSendToBack,
    handleBringToFront,
    handleLockCanvasObjectAspectRatio,
  };
};
