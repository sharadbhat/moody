import "./index.css";
import {
  ActionIcon,
  Button,
  ColorPicker,
  Input,
  Menu,
  Tooltip,
} from "@mantine/core";
import { useMoodyStore } from "../../utils/store";
import { useState } from "react";
import { useEyeDropper } from "@mantine/hooks";
import { IconColorPicker, IconPalette } from "@tabler/icons-react";

const BackgroundColorPicker = () => {
  const { backgroundColor, setBackgroundColor } = useMoodyStore(
    (state) => state
  );

  const { supported: isEyeDropperSupported, open: openEyeDropper } =
    useEyeDropper();

  const [initialBackgroundColor, setInitialBackgroundColor] =
    useState(backgroundColor);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const resetBackgroundColor = () => {
    setBackgroundColor(initialBackgroundColor);
    setIsDropdownOpen(false);
  };

  const applyBackgroundColor = () => {
    setIsDropdownOpen(false);
  };

  const handleColorChange = (color: string) => {
    if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/i.test(color)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setBackgroundColor(color);
  };

  const handleEyeDropper = async () => {
    try {
      const { sRGBHex } = (await openEyeDropper())!;
      handleColorChange(sRGBHex);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Menu
      opened={isDropdownOpen}
      onOpen={() => setIsDropdownOpen(true)}
      onClose={() => setIsDropdownOpen(false)}
    >
      <Menu.Target>
        <div>
          <Tooltip
            label="Background color"
            position="bottom"
            withArrow
            openDelay={500}
            zIndex={1000}
          >
            <ActionIcon
              variant={"default"}
              size={"lg"}
              radius={"md"}
              onClick={() => setInitialBackgroundColor(backgroundColor)}
              className="background-color-actionicon"
            >
              <div
                className="background-color-preview"
                style={{
                  backgroundColor: backgroundColor,
                }}
              >
                {<IconPalette stroke={1.5} />}
              </div>
            </ActionIcon>
          </Tooltip>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="colorpicker-dropdown">
          <ColorPicker
            value={backgroundColor}
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
            <Button variant="light" onClick={resetBackgroundColor} fullWidth>
              Cancel
            </Button>
            <Button onClick={applyBackgroundColor} fullWidth disabled={isError}>
              Apply
            </Button>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BackgroundColorPicker;
