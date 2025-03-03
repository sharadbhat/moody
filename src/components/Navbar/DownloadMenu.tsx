import { useState } from "react";
import { toCanvas, toJpeg, toPng } from "html-to-image";
import { useMoodyStore } from "../../utils/store";
import { Text, Menu, NativeSelect, Slider, Flex, Button } from "@mantine/core";
import { CONSTANTS } from "../../utils/constants";

const DownloadMenu = ({ children }: { children: React.ReactNode }) => {
  const { boardName, isCropping, setIsCropping, cropDimensions } =
    useMoodyStore((state) => state);

  const [imageType, setImageType] = useState("jpeg");
  const [imageScale, setImageScale] = useState(1);
  const [canvasDiv, setCanvasDiv] = useState<HTMLDivElement | null>(null);

  const onDownloadClick = () => {
    const canvasDiv = document.querySelector(
      "[class*='infiniteCanvas']"
    ) as HTMLDivElement;

    if (!canvasDiv) return;

    setCanvasDiv(canvasDiv);
  };

  const downloadAsImage = () => {
    const toImageType = imageType === "jpeg" ? toJpeg : toPng;

    if (!canvasDiv) return;

    toImageType(canvasDiv, {
      pixelRatio: imageScale,
      backgroundColor: "white",
    }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${boardName}.${imageType}`;
      link.href = dataUrl;
      link.click();
    });
  };

  const downloadSelectionAsImage = () => {
    if (!canvasDiv) return;

    toCanvas(canvasDiv, {
      pixelRatio: imageScale,
      backgroundColor: "white",
      filter: (node) => {
        return !["cropOverlay", "cropBox"].includes(node.id);
      },
    }).then((fullCanvas) => {
      // Create an offscreen canvas to store the cropped image
      const croppedCanvas = document.createElement("canvas");
      const ctx = croppedCanvas.getContext("2d");

      if (!ctx) return;

      // Set the canvas size to match the crop dimensions
      croppedCanvas.width = cropDimensions.width * imageScale;
      croppedCanvas.height = cropDimensions.height * imageScale;

      // Draw only the cropped portion onto the new canvas
      ctx.drawImage(
        fullCanvas,
        cropDimensions.x * imageScale, // Source X
        cropDimensions.y * imageScale, // Source Y
        cropDimensions.width * imageScale, // Source Width
        cropDimensions.height * imageScale, // Source Height
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      // Convert the cropped canvas to an image and download it
      croppedCanvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${boardName}.${imageType}`;
        link.click();
        URL.revokeObjectURL(link.href);
      }, `image/${imageType}`);
    });
  };

  const renderImageSize = () => {
    if (!canvasDiv) return;

    if (isCropping) {
      return `${cropDimensions.width * imageScale} x ${
        cropDimensions.height * imageScale
      }`;
    }

    return `${canvasDiv.clientWidth * imageScale} x ${
      canvasDiv.clientHeight * imageScale
    }`;
  };

  const scaleMarks = [];
  for (let i = 1; i <= CONSTANTS.MAX_IMAGE_SCALE; i++) {
    scaleMarks.push({ value: i });
  }

  return (
    <Menu
      withArrow
      width={340}
      onOpen={onDownloadClick}
      onClose={() => setIsCropping(false)}
    >
      <Menu.Target>
        <div>{children}</div>
      </Menu.Target>
      <Menu.Dropdown>
        <Flex direction={"column"} gap={"md"} className="downloadmenu-flex">
          <div>
            <Text size="xs" c="dimmed">
              Download as
            </Text>
            <div className="downloadmenu-select-wrapper">
              <NativeSelect
                value={imageType}
                onChange={(e) => setImageType(e.target.value)}
                mt="md"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
              </NativeSelect>
            </div>
          </div>
          <div>
            <Text size="xs" c="dimmed">
              Scale
            </Text>
            <div className="downloadmenu-scale-slider-wrapper">
              <Slider
                value={imageScale}
                onChange={setImageScale}
                min={1}
                max={CONSTANTS.MAX_IMAGE_SCALE}
                step={1}
                label={(value) => `${value}x`}
                marks={scaleMarks}
                style={{
                  width: "100%",
                }}
              />
            </div>
            <Text size="xs" ta={"right"} c="dimmed">
              {renderImageSize()}
            </Text>
          </div>
          <div className="downloadmenu-buttons">
            {!isCropping && (
              <>
                <Button variant="light" onClick={() => setIsCropping(true)}>
                  Download selection
                </Button>
                <Button onClick={downloadAsImage}>Download screen</Button>
              </>
            )}
            {isCropping && (
              <>
                <Button onClick={downloadSelectionAsImage}>
                  Download selection
                </Button>
                <Button variant="light" onClick={() => setIsCropping(false)}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Flex>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DownloadMenu;
