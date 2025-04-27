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
    setSelectedCanvasObjectLocked,
    setSelectedCanvasObjectId,
    setSelectedCanvasObjectRef,
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

    return {
      id: `${Date.now()}`,
      x: x,
      y: y,
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
    setSelectedCanvasObjectId(null);
    setSelectedCanvasObjectRef(null);
  };

  const handleLockCanvasObject = (id: string, lockState: boolean) => {
    setCanvasObjectLock(id, lockState);
    setSelectedCanvasObjectLocked(lockState);
    setSelectedCanvasObjectRef(null);
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
