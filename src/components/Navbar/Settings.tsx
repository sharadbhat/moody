import "./index.css";
import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBrandFigma,
  IconBrandGithub,
  IconDotsVertical,
  IconDownload,
  IconExternalLink,
  IconGrid4x4,
  IconPhoto,
  IconPlus,
  IconTextSize,
} from "@tabler/icons-react";
import { CONSTANTS } from "../../utils/constants";
import DownloadMenu from "./DownloadMenu";
import { useFullscreen } from "@mantine/hooks";
import { useMoodyStore } from "../../utils/store";
import BackgroundColorPicker from "./BackgroundColorPicker";

const Settings = () => {
  const { snapToGrid, toggleSnapToGrid } = useMoodyStore((state) => state);

  const { toggle, fullscreen } = useFullscreen();

  return (
    <div className="settings">
      <div className="settings-group">
        <SettingsButton
          title="Add image"
          icon={<IconPhoto stroke={1.5} />}
          isEnabled={false}
          onClick={() => {}}
          showAddIcon
        />
        <SettingsButton
          title="Add text"
          icon={<IconTextSize stroke={1.5} />}
          isEnabled={false}
          onClick={() => {}}
          showAddIcon
        />
      </div>
      <div className="settings-group">
        <BackgroundColorPicker />
      </div>
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
        <MoreMenu>
          <div>
            <SettingsButton
              title="More"
              icon={<IconDotsVertical stroke={1.5} />}
              isEnabled={false}
              onClick={() => {}}
            />
          </div>
        </MoreMenu>
      </div>
    </div>
  );
};

const SettingsButton = ({
  title,
  icon,
  isEnabled,
  onClick,
  showAddIcon = false,
}: {
  title: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  onClick: () => void;
  showAddIcon?: boolean;
}) => {
  return (
    <Tooltip label={title} position={"bottom"} withArrow>
      <div style={{ position: "relative" }}>
        <ActionIcon
          variant={isEnabled ? "filled" : "default"}
          size={"lg"}
          radius={"md"}
          onClick={onClick}
        >
          {icon}
        </ActionIcon>
        {showAddIcon && (
          <div
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "var(--mantine-color-white)",
              borderRadius: "50%",
              border: "0.0625rem solid var(--mantine-color-gray-3)",
              width: 15,
              height: 15,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconPlus stroke={1.5} size={16} />
          </div>
        )}
      </div>
    </Tooltip>
  );
};

const MoreMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <Menu width={200} withArrow>
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconBrandGithub stroke={1.5} />}
          rightSection={<IconExternalLink stroke={1.5} size={16} />}
          onClick={() => window.open(CONSTANTS.REPO_URL, "_blank")}
        >
          GitHub
        </Menu.Item>
        <Menu.Item
          leftSection={<IconBrandFigma stroke={1.5} />}
          rightSection={<IconExternalLink stroke={1.5} size={16} />}
          onClick={() => window.open(CONSTANTS.FIGMA_URL, "_blank")}
        >
          Figma
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Settings;
