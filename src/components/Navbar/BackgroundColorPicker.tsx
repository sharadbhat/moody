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
import { IconColorPicker, IconHash, IconPalette } from "@tabler/icons-react";
import { patterns } from "../../utils/patterns";

const BackgroundColorPicker = () => {
  const {
    patternColor,
    backgroundColor,
    backgroundPatternId,
    setPatternColor,
    setBackgroundColor,
    setBackgroundPatternId,
  } = useMoodyStore((state) => state);

  const { supported: isEyeDropperSupported, open: openEyeDropper } =
    useEyeDropper();

  const [initialBackgroundColor, setInitialBackgroundColor] =
    useState(backgroundColor);
  const [initialPatternColor, setInitialPatternColor] = useState(patternColor);
  const [initialBackgroundPatternId, setInitialBackgroundPatternId] =
    useState(backgroundPatternId);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [segmentedControlValue, setSegmentedControlValue] = useState("pattern");

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

    segmentedControlValue === "pattern"
      ? setPatternColor(color)
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
    setInitialPatternColor(patternColor);
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
              variant={"default"}
              size={"lg"}
              radius={"md"}
              onClick={initializeColors}
              autoContrast
            >
              {<IconPalette stroke={1.5} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="colorpicker-dropdown">
          <SegmentedControl
            data={[
              {
                value: "pattern",
                label: "Pattern",
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
              segmentedControlValue === "pattern"
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
                      className="pattern-background"
                      style={{
                        border:
                          backgroundPatternId.toString() == id
                            ? "2px solid var(--mantine-primary-color-3)"
                            : null,
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: id === "0" ? "white" : null,
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
            <Button variant="light" onClick={resetSelections} fullWidth>
              Cancel
            </Button>
            <Button onClick={applySelections} fullWidth>
              Apply
            </Button>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BackgroundColorPicker;
