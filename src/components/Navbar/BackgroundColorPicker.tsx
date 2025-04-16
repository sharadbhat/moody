import "./index.css";
import {
  ActionIcon,
  Button,
  ColorPicker,
  ColorSwatch,
  Input,
  Menu,
  ScrollArea,
  SimpleGrid,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";
import { useEyeDropper } from "@mantine/hooks";
import { IconColorPicker, IconHash, IconPalette } from "@tabler/icons-react";
import { patterns } from "../../utils/patterns";
import { CONSTANTS } from "../../utils/constants";

const BackgroundColorPicker = () => {
  const {
    patternColor,
    backgroundColor,
    backgroundPatternId,
    setPatternColor,
    setBackgroundColor,
    setBackgroundPatternId,
  } = useMoodyStore((state) => state);

  const { colorScheme } = useMantineColorScheme();

  const { supported: isEyeDropperSupported, open: openEyeDropper } =
    useEyeDropper();

  const [initialBackgroundColor, setInitialBackgroundColor] =
    useState(backgroundColor);
  const [initialPatternColor, setInitialPatternColor] = useState(patternColor);
  const [initialBackgroundPatternId, setInitialBackgroundPatternId] =
    useState(backgroundPatternId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColorElement, setSelectedColorElement] = useState<
    string | null
  >(null);

  const resetSelections = () => {
    setPatternColor(initialPatternColor);
    setBackgroundColor(initialBackgroundColor);
    setBackgroundPatternId(initialBackgroundPatternId);
    setIsDropdownOpen(false);
  };

  const applySelections = () => {
    setIsDropdownOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (color.length <= 6 && !color.startsWith("#")) {
      color = `#${color}`;
    }

    if (selectedColorElement === "pattern") {
      setPatternColor(color);
    } else if (selectedColorElement === "background") {
      setBackgroundColor(color);
    }
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
    setInitialPatternColor(patternColor);
    setInitialBackgroundPatternId(backgroundPatternId);
  };

  const handleColorElementChange = (element: string) => {
    if (selectedColorElement !== element) {
      setSelectedColorElement(element);
    } else {
      setSelectedColorElement(null);
    }
  };

  const getPatternBackgroundColor = (id) => {
    if (colorScheme === "light") {
      return "white";
    }
    return "black";
  };

  const getPatternColor = (id) => {
    if (colorScheme === "light") {
      if (id == "0") {
        return "white";
      }
      if (backgroundPatternId.toString() == id) {
        return "var(--mantine-color-dark-text)";
      }
      return "var(--mantine-color-gray-filled)";
    }

    if (colorScheme === "dark") {
      if (id == "0") {
        return "black";
      }
      if (backgroundPatternId.toString() == id) {
        return "var(--mantine-color-gray-0)";
      }
      return "var(--mantine-color-gray-6)";
    }
  };

  return (
    <Menu
      opened={isDropdownOpen}
      onOpen={() => setIsDropdownOpen(true)}
      onClose={resetSelections}
      width={325}
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
              variant={"default"}
              size={"lg"}
              radius={"md"}
              onClick={initializeColors}
              autoContrast
              styles={{
                root: {
                  cursor: CONSTANTS.CURSOR_POINTER,
                },
              }}
            >
              {<IconPalette stroke={1.5} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="colorpicker-dropdown">
          <div className="colorpicker-element-buttons">
            <Button
              variant={selectedColorElement === "pattern" ? "light" : "default"}
              onClick={() => handleColorElementChange("pattern")}
              fullWidth
              leftSection={<ColorSwatch color={patternColor} size={20} />}
              styles={{
                root: {
                  cursor: CONSTANTS.CURSOR_POINTER,
                },
              }}
            >
              Pattern
            </Button>
            <Button
              variant={
                selectedColorElement === "background" ? "light" : "default"
              }
              onClick={() => handleColorElementChange("background")}
              fullWidth
              leftSection={<ColorSwatch color={backgroundColor} size={20} />}
              styles={{
                root: {
                  cursor: CONSTANTS.CURSOR_POINTER,
                },
              }}
            >
              Background
            </Button>
          </div>
          {selectedColorElement !== null && (
            <>
              <ColorPicker
                fullWidth
                value={
                  selectedColorElement === "pattern"
                    ? patternColor
                    : backgroundColor
                }
                format="rgba"
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
                styles={{
                  swatch: {
                    cursor: CONSTANTS.CURSOR_POINTER,
                  },
                }}
              />
              <div className="colorpicker-input-wrapper">
                <Input
                  placeholder="Enter a color hex code"
                  leftSection={<IconHash stroke={1.5} />}
                  onChange={(e) => handleColorChange(e.target.value)}
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
            </>
          )}
          <ScrollArea h={"30vh"}>
            <SimpleGrid cols={3} spacing={4} verticalSpacing={4}>
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
                      className="pattern-background"
                      style={{
                        cursor: CONSTANTS.CURSOR_POINTER,
                        border:
                          backgroundPatternId.toString() == id
                            ? "5px solid var(--mantine-primary-color-2)"
                            : "5px solid transparent",
                        backgroundColor: getPatternBackgroundColor(id),
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: getPatternColor(id),
                          maskImage: pattern.svg,
                          WebkitMaskImage: pattern.svg,
                        }}
                        className="pattern-div"
                        onClick={() =>
                          handlePatternChange(id as unknown as number)
                        }
                      />
                    </div>
                  </Tooltip>
                </div>
              ))}
            </SimpleGrid>
          </ScrollArea>

          <div className="colorpicker-buttons">
            <Button
              onClick={applySelections}
              fullWidth
              styles={{
                root: {
                  cursor: CONSTANTS.CURSOR_POINTER,
                },
              }}
            >
              Apply
            </Button>
            <Button
              variant="light"
              onClick={resetSelections}
              fullWidth
              styles={{
                root: {
                  cursor: CONSTANTS.CURSOR_POINTER,
                },
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BackgroundColorPicker;
