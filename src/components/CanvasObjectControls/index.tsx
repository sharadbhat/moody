import {
  IconLayersSelected,
  IconLayersSelectedBottom,
  IconLock,
  IconLockOpen,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useCanvasObject } from "../../hooks/useCanvasObject";

export interface CanvasObjectControlsProps {
  id: string;
  locked: boolean;
}

const CanvasObjectControls = ({ id, locked }: CanvasObjectControlsProps) => {
  const {
    handleBringToFront,
    handleSendToBack,
    handleLockCanvasObject,
    handleDeleteCanvasObject,
  } = useCanvasObject();

  return (
    <>
      {!locked && (
        <ActionIcon.Group>
          <CanvasObjectControlButton
            icon={<IconLayersSelected stroke={1.75} />}
            label={"Send to back"}
            onClick={() => handleBringToFront(id)}
            isEnabled={false}
          />
          <CanvasObjectControlButton
            icon={<IconLayersSelectedBottom stroke={1.75} />}
            label={"Bring to front"}
            onClick={() => handleSendToBack(id)}
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
      >
        {icon}
      </ActionIcon>
    </Tooltip>
  );
};

export default CanvasObjectControls;
