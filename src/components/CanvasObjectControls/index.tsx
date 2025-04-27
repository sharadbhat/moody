import {
  IconAspectRatio,
  IconAspectRatioOff,
  IconLayersSelected,
  IconLayersSelectedBottom,
  IconLock,
  IconLockOpen,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useCanvasObject } from "../../hooks/useCanvasObject";
import { CONSTANTS } from "../../utils/constants";

export interface CanvasObjectControlsProps {
  id: string;
  aspectRatioLocked: boolean;
  locked: boolean;
}

const CanvasObjectControls = ({
  id,
  aspectRatioLocked,
  locked,
}: CanvasObjectControlsProps) => {
  const {
    handleBringToFront,
    handleSendToBack,
    handleLockCanvasObject,
    handleDeleteCanvasObject,
    handleLockCanvasObjectAspectRatio,
  } = useCanvasObject();

  return (
    <>
      {!locked && (
        <ActionIcon.Group>
          <CanvasObjectControlButton
            icon={<IconLayersSelected stroke={1.75} />}
            label={"Send to back"}
            onClick={() => handleSendToBack(id)}
            isEnabled={false}
          />
          <CanvasObjectControlButton
            icon={<IconLayersSelectedBottom stroke={1.75} />}
            label={"Bring to front"}
            onClick={() => handleBringToFront(id)}
            isEnabled={false}
          />
          <CanvasObjectControlButton
            label={
              aspectRatioLocked ? "Unlock aspect ratio" : "Lock aspect ratio"
            }
            icon={
              aspectRatioLocked ? (
                <IconAspectRatioOff stroke={1.75} />
              ) : (
                <IconAspectRatio stroke={1.75} />
              )
            }
            onClick={() =>
              handleLockCanvasObjectAspectRatio(id, !aspectRatioLocked)
            }
            isEnabled={false}
          />
          <CanvasObjectControlButton
            icon={<IconLockOpen stroke={1.75} />}
            label={"Lock"}
            onClick={() => handleLockCanvasObject(id, true)}
            isEnabled={false}
          />
          <CanvasObjectControlButton
            icon={<IconTrash stroke={1.75} />}
            label={"Delete"}
            onClick={() => handleDeleteCanvasObject(id)}
            isEnabled={false}
          />
        </ActionIcon.Group>
      )}
      {locked && (
        <ActionIcon.Group>
          <CanvasObjectControlButton
            icon={<IconLock stroke={1.75} />}
            label={"Unlock"}
            onClick={() => handleLockCanvasObject(id, false)}
            isEnabled={true}
          />
        </ActionIcon.Group>
      )}
    </>
  );
};

interface CanvasObjectControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isEnabled: boolean;
  label: string;
}

const CanvasObjectControlButton = ({
  icon,
  onClick,
  isEnabled,
  label,
}: CanvasObjectControlButtonProps) => {
  let variant = "subtle";
  let color = "gray";

  if (isEnabled) {
    variant = "filled";
    color = "blue";
  }

  return (
    <Tooltip label={label} position="top" withArrow>
      <ActionIcon
        variant={variant}
        aria-label={label}
        onClick={onClick}
        color={color}
        style={{
          cursor: CONSTANTS.CURSOR_POINTER,
        }}
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};

export default CanvasObjectControls;
