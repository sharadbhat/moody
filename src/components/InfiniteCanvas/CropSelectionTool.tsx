import { useState } from "react";
import { useMoodyStore } from "../../utils/store";
import { Rnd } from "react-rnd";

const CropSelectionTool = () => {
  const { cropDimensions, setCropDimensions } = useMoodyStore((state) => state);

  const [initialCropDimension, setInitialCropDimension] = useState({
    x: cropDimensions.x,
    y: cropDimensions.y,
    width: cropDimensions.width,
    height: cropDimensions.height,
  });

  return (
    <>
      <div
        className="cropOverlay"
        id="cropOverlay"
        style={{
          clipPath: `polygon(
            0% 0%,
            0% 100%,
            ${cropDimensions.x}px 100%,
            ${cropDimensions.x}px ${cropDimensions.y}px,
            ${cropDimensions.x + cropDimensions.width}px ${cropDimensions.y}px,
            ${cropDimensions.x + cropDimensions.width}px ${
            cropDimensions.y + cropDimensions.height
          }px,
            ${cropDimensions.x}px ${cropDimensions.y + cropDimensions.height}px,
            ${cropDimensions.x}px 100%,
            100% 100%,
            100% 0%
          )`,
        }}
      />
      <Rnd
        bounds={"parent"}
        style={{ border: "1px dashed black" }}
        id="cropBox"
        default={cropDimensions}
        minWidth={150}
        minHeight={150}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onDrag={(e, d) => {
          setCropDimensions(
            d.x,
            d.y,
            cropDimensions.width,
            cropDimensions.height
          );
          e.stopPropagation();
        }}
        onResizeStart={(_e, _direction, _ref) => {
          setInitialCropDimension({
            x: cropDimensions.x,
            y: cropDimensions.y,
            width: cropDimensions.width,
            height: cropDimensions.height,
          });
        }}
        onResize={(_e, _direction, _ref, delta, position) => {
          setCropDimensions(
            position.x,
            position.y,
            initialCropDimension.width + delta.width,
            initialCropDimension.height + delta.height
          );
        }}
      />
    </>
  );
};

export default CropSelectionTool;
