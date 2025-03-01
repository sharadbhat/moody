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
    x: x - width / 2,
    y: y - height / 2,
    width,
    height,
    fileType: FileType.IMAGE,
    fileContent: imageObject?.src || "",
    lockAspectRatio: true,
    locked: false,
  };
};

export const useCanvasObject = () => {
  const addCanvasObject = useMoodyStore((state) => state.addCanvasObject);
  const updateCanvasObjectPosition = useMoodyStore(
    (state) => state.updateCanvasObjectPosition
  );
  const updateCanvasObjectSize = useMoodyStore(
    (state) => state.updateCanvasObjectSize
  );

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
    updateCanvasObjectPosition(id, x, y);
  };

  const handleResizeStop = ({ id, delta, x, y }: HandleResizeStopProps) => {
    updateCanvasObjectSize(id, delta.width, delta.height, x, y);
  };

  return {
    handleNewCanvasObject,
    handleDragStop,
    handleResizeStop,
  };
};
