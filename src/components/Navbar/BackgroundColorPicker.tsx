import "./index.css";
import {
  ActionIcon,
  Button,
  ColorPicker,
  Input,
  Menu,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";
import { useEyeDropper } from "@mantine/hooks";
import { IconColorPicker, IconPalette } from "@tabler/icons-react";
import { patterns } from "../../utils/patterns";

const BackgroundColorPicker = () => {
  const {
    foregroundColor,
    backgroundColor,
    backgroundPatternId,
    setForegroundColor,
    setBackgroundColor,
    setBackgroundPatternId,
  } = useMoodyStore((state) => state);

  const { supported: isEyeDropperSupported, open: openEyeDropper } =
    useEyeDropper();

  const [initialBackgroundColor, setInitialBackgroundColor] =
    useState(backgroundColor);
  const [initialForegroundColor, setInitialForegroundColor] =
    useState(foregroundColor);
  const [initialBackgroundPatternId, setInitialBackgroundPatternId] =
    useState(backgroundPatternId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [segmentedControlValue, setSegmentedControlValue] =
    useState("foreground");

  const resetSelections = () => {
    setForegroundColor(initialForegroundColor);
    setBackgroundColor(initialBackgroundColor);
    setBackgroundPatternId(initialBackgroundPatternId);
    setIsDropdownOpen(false);
  };

  const applySelections = () => {
    setIsDropdownOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    segmentedControlValue === "foreground"
      ? setForegroundColor(color)
      : setBackgroundColor(color);
  };

  const handleEyeDropper = async () => {
    try {
      const { sRGBHex } = (await openEyeDropper())!;
      handleColorChange(sRGBHex);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatternChange = (id: number) => {
    setBackgroundPatternId(id);
  };

  const initializeColors = () => {
    setInitialBackgroundColor(backgroundColor);
    setInitialForegroundColor(foregroundColor);
    setInitialBackgroundPatternId(backgroundPatternId);
  };

  return (
    <Menu
      opened={isDropdownOpen}
      onOpen={() => setIsDropdownOpen(true)}
      onClose={resetSelections}
      width={300}
    >
      <Menu.Target>
        <div>
          <Tooltip
            label="Background"
            position="bottom"
            withArrow
            openDelay={500}
            zIndex={1000}
          >
            <ActionIcon
              variant={"filled"}
              size={"lg"}
              radius={"md"}
              onClick={initializeColors}
              className="background-color-actionicon"
              autoContrast
              color={backgroundColor}
            >
              {<IconPalette stroke={1.5} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="colorpicker-dropdown">
          <ScrollArea h={"30vh"}>
            <SimpleGrid cols={3} spacing={8} verticalSpacing={8}>
              {Object.entries(patterns).map(([id, pattern]) => (
                <div key={id}>
                  <Tooltip
                    label={pattern.name}
                    position="top"
                    withArrow
                    zIndex={1000}
                    openDelay={200}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: 60,
                        backgroundColor: "white",
                        backgroundImage: pattern.svg.replaceAll(
                          "FILL_COLOR",
                          "black"
                        ),
                        backgroundPosition: "center",
                      }}
                      onClick={() =>
                        handlePatternChange(id as unknown as number)
                      }
                    />
                  </Tooltip>
                </div>
              ))}
            </SimpleGrid>
          </ScrollArea>
          <SegmentedControl
            data={[
              {
                value: "foreground",
                label: "Foreground",
              },
              {
                value: "background",
                label: "Background",
              },
            ]}
            value={segmentedControlValue}
            onChange={setSegmentedControlValue}
            fullWidth
          />
          <ColorPicker
            fullWidth
            value={
              segmentedControlValue === "foreground"
                ? foregroundColor
                : backgroundColor
            }
            onChange={handleColorChange}
            swatches={[
              "#2A2D34",
              "#878BCD",
              "#D292D2",
              "#F6AEC5",
              "#FDF1A1",
              "#BFEB88",
              "#83D1D4",
              "#fcaad1",
              "#f7e9de",
              "#96b7f8",
              "#f9faf9",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
          <div className="colorpicker-input-wrapper">
            <Input
              value={backgroundColor.toUpperCase()}
              onChange={(e) => handleColorChange(e.target.value)}
              error={isError}
              className="colorpicker-input"
            />
            {isEyeDropperSupported && (
              <Tooltip
                label="Eye dropper tool"
                withArrow
                openDelay={200}
                zIndex={1000}
              >
                <div>
                  <Tooltip
                    label="Press ESC to close"
                    position="bottom"
                    openDelay={200}
                    zIndex={1000}
                  >
                    <ActionIcon
                      size={"lg"}
                      radius={"xl"}
                      onClick={handleEyeDropper}
                      variant="light"
                    >
                      {<IconColorPicker stroke={1.5} />}
                    </ActionIcon>
                  </Tooltip>
                </div>
              </Tooltip>
            )}
          </div>

          <div className="colorpicker-buttons">
            <Button variant="light" onClick={resetSelections} fullWidth>
              Cancel
            </Button>
            <Button onClick={applySelections} fullWidth disabled={isError}>
              Apply
            </Button>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BackgroundColorPicker;
