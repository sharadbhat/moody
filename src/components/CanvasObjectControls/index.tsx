import {
  IconLayersSelected,
  IconLayersSelectedBottom,
  IconLock,
  IconLockOpen,
  IconTrash,
} from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { useCanvasObject } from "../../hooks/useCanvasObject";
import { useState } from "react";

export interface CanvasObjectControlsProps {
  id: string;
  show: boolean;
  locked: boolean;
}

const CanvasObjectControls = ({
  id,
  show,
  locked,
}: CanvasObjectControlsProps) => {
  const {
    handleBringToFront,
    handleSendToBack,
    handleLockCanvasObject,
    handleDeleteCanvasObject,
  } = useCanvasObject();

  if (show) {
    return (
      <div style={{ position: "absolute", top: -20, backgroundColor: "white" }}>
        {!locked && (
          <>
            <CanvasObjectControlButton
              icon={<IconLayersSelected />}
              arialabel={"Bring to front"}
              onClick={() => handleBringToFront(id)}
              isEnabled={false}
            />
            <CanvasObjectControlButton
              icon={<IconLayersSelectedBottom />}
              arialabel={"Send to back"}
              onClick={() => handleSendToBack(id)}
              isEnabled={false}
            />
            <CanvasObjectControlButton
              icon={<IconLockOpen />}
              arialabel={"Lock object"}
              onClick={() => handleLockCanvasObject(id, true)}
              isEnabled={false}
            />
            <CanvasObjectControlButton
              icon={<IconTrash />}
              arialabel={"Delete object"}
              onClick={() => handleDeleteCanvasObject(id)}
              isEnabled={false}
            />
          </>
        )}
        {locked && (
          <CanvasObjectControlButton
            icon={<IconLock />}
            arialabel={"Unlock object"}
            onClick={() => handleLockCanvasObject(id, false)}
            isEnabled={true}
          />
        )}
      </div>
    );
  }
};

interface CanvasObjectControlButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  isEnabled: boolean;
  arialabel: string;
}

const CanvasObjectControlButton = ({
  icon,
  onClick,
  isEnabled,
  arialabel,
}: CanvasObjectControlButtonProps) => {
  const [hovered, setHovered] = useState(false);

  let variant = "transparent";
  if (hovered) {
    variant = "light";
  }
  if (isEnabled) {
    variant = "filled";
  }

  let color = "gray";
  if (hovered || isEnabled) {
    color = "blue";
  }

  const onMouseEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHovered(true);
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onMouseLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHovered(false);
  };

  return (
    <ActionIcon
      variant={variant}
      radius={"xl"}
      aria-label={arialabel}
      onClick={onClick}
      color={color}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {icon}
    </ActionIcon>
  );
};

export default CanvasObjectControls;
