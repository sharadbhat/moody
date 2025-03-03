import { useFullscreen } from "@mantine/hooks";
import { useMoodyStore } from "../../utils/store";
import { ActionIcon, Tooltip } from "@mantine/core";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBrandFigma,
  IconBrandGithub,
  IconDownload,
  IconGrid4x4,
} from "@tabler/icons-react";
import { CONSTANTS } from "../../utils/constants";
import DownloadMenu from "./DownloadMenu";

import "./index.css";

const Settings = () => {
  const { snapToGrid, toggleSnapToGrid } = useMoodyStore((state) => state);

  const { toggle, fullscreen } = useFullscreen();

  return (
    <div className="settings">
      <div className="settings-group">
        <SettingsButton
          title="Snap to grid"
          icon={<IconGrid4x4 stroke={1.5} />}
          isEnabled={snapToGrid}
          onClick={toggleSnapToGrid}
        />
        <DownloadMenu>
          <SettingsButton
            title="Download"
            icon={<IconDownload stroke={1.5} />}
            isEnabled={false}
            onClick={() => {}}
          />
        </DownloadMenu>
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
          onClick={() => window.open(CONSTANTS.REPO_URL, "_blank")}
        />
        <SettingsButton
          title="Figma"
          icon={<IconBrandFigma stroke={1.5} />}
          isEnabled={false}
          onClick={() => window.open(CONSTANTS.FIGMA_URL, "_blank")}
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
