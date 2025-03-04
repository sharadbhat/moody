import { ActionIcon, ColorPicker, Menu, Tooltip } from "@mantine/core";
import { useMoodyStore } from "../../utils/store";

import "./index.css";

const BackgroundColorPicker = () => {
  const { backgroundColor, setBackgroundColor } = useMoodyStore(
    (state) => state
  );
  return (
    <Menu>
      <Menu.Target>
        <div>
          <Tooltip label="Background color" position="bottom" withArrow>
            <ActionIcon
              variant={"filled"}
              size={"lg"}
              radius={"md"}
              onClick={() => {}}
              color={backgroundColor}
            />
          </Tooltip>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <div className="colorpicker-dropdown">
          <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default BackgroundColorPicker;
