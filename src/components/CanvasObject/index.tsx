import { useRef, useState } from "react";
import useImage from "use-image";
import { Group, Image as KonvaImage } from "react-konva";
import { Group as MantineGroup } from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { CONSTANTS } from "../../utils/constants";
import { Html } from "react-konva-utils";
import CanvasObjectControls from "../CanvasObjectControls";

export const CanvasObject = ({ src, id, x, y, locked, aspectRatioLocked }) => {
  const [image] = useImage(src);

  const {
    selectedCanvasObjectId,
    setSelectedCanvasObjectId,
    setSelectedCanvasObjectRef,
  } = useMoodyStore();

  const objectRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (selectedCanvasObjectId === id) {
      setSelectedCanvasObjectRef(null);
      setSelectedCanvasObjectId(null);
    } else {
      setSelectedCanvasObjectRef(objectRef);
      setSelectedCanvasObjectId(id);
    }
  };

  const transformFunc = (attrs) => {
    const imageNode = objectRef.current;
    const stage = imageNode?.getStage();
    if (!imageNode || !stage) return attrs;

    const box = imageNode.getClientRect();
    const x = box.x + box.width;
    const y = box.y;

    return {
      ...attrs,
      x: x - 200,
      y: y - 35,
      scaleX: 1,
      scaleY: 1,
    };
  };

  const handleUnlockCanvasObject = () => {
    setSelectedCanvasObjectRef(objectRef);
    setSelectedCanvasObjectId(id);
  };

  return (
    <Group x={x} y={y} draggable={!locked}>
      {selectedCanvasObjectId === id && (
        <Html transformFunc={transformFunc}>
          <MantineGroup justify="end" w={200}>
            <CanvasObjectControls
              id={id}
              locked={locked}
              aspectRatioLocked={aspectRatioLocked}
              handleUnlockCanvasObject={handleUnlockCanvasObject}
            />
          </MantineGroup>
        </Html>
      )}
      <KonvaImage
        image={image}
        ref={objectRef}
        x={0}
        y={0}
        offsetX={image ? image.width / 2 : 0}
        offsetY={image ? image.height / 2 : 0}
        onClick={handleClick}
        onTap={handleClick}
        stroke={"black"}
        strokeWidth={4}
        strokeEnabled={
          (selectedCanvasObjectId === id && locked) ||
          (selectedCanvasObjectId !== id && isHovered)
        }
        strokeScaleEnabled={false}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onMouseDown={() => {
          document.body.style.cursor = CONSTANTS.CURSOR_MOVE;
        }}
        onMouseUp={() =>
          (document.body.style.cursor = CONSTANTS.CURSOR_DEFAULT)
        }
      />
    </Group>
  );
};
