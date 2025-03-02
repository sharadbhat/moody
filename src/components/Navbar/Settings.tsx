import { useFullscreen } from "@mantine/hooks";
import { useMoodyStore } from "../../utils/store";
import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBrandFigma,
  IconBrandGithub,
  IconDownload,
  IconGrid4x4,
} from "@tabler/icons-react";
import { toJpeg, toPng } from "html-to-image";

import "./index.css";

const Settings = () => {
  const { boardName, snapToGrid, toggleSnapToGrid } = useMoodyStore(
    (state) => state
  );

  const { toggle, fullscreen } = useFullscreen();

  const downloadAsImage = (imageType: string) => {
    const canvas = document.querySelector(
      "[class*='infiniteCanvas']"
    ) as HTMLCanvasElement;

    const toImageType = imageType === "jpeg" ? toJpeg : toPng;

    if (!canvas) return;
    toImageType(canvas).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${boardName}.${imageType}`;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <div className="settings">
      <div className="settings-group">
        <SettingsButton
          title="Snap to grid"
          icon={<IconGrid4x4 stroke={1.5} />}
          isEnabled={snapToGrid}
          onClick={toggleSnapToGrid}
        />
        <Menu shadow="md" width={150} withArrow position="bottom">
          <Menu.Target>
            <div>
              <SettingsButton
                title="Download"
                icon={<IconDownload stroke={1.5} />}
                isEnabled={false}
                onClick={null}
              />
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Download as</Menu.Label>
            <Menu.Item onClick={() => downloadAsImage("jpeg")}>JPEG</Menu.Item>
            <Menu.Item onClick={() => downloadAsImage("png")}>PNG</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <SettingsButton
          title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          icon={
            fullscreen ? (
              <IconArrowsMinimize stroke={1.5} />
            ) : (
              <IconArrowsMaximize stroke={1.5} />
            )
          }
          isEnabled={false}
          onClick={toggle}
        />
      </div>
      <div className="settings-group">
        <SettingsButton
          title="Github"
          icon={<IconBrandGithub stroke={1.5} />}
          isEnabled={false}
          onClick={() =>
            window.open("https://github.com/sharadbhat/moody/", "_blank")
          }
        />
        <SettingsButton
          title="Figma"
          icon={<IconBrandFigma stroke={1.5} />}
          isEnabled={false}
          onClick={() =>
            window.open("https://github.com/sharadbhat/moody/", "_blank")
          }
        />
      </div>
    </div>
  );
};

const SettingsButton = ({
  title,
  icon,
  isEnabled,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  onClick: () => void;
}) => {
  return (
    <Tooltip label={title} position={"bottom"} withArrow>
      <ActionIcon
        variant={isEnabled ? "filled" : "default"}
        size={"lg"}
        radius={"md"}
        onClick={onClick}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};

export default Settings;
