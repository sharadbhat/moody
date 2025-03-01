export interface CanvasObjectControlsProps {
  id: string;
  show: boolean;
}

const CanvasObjectControls = ({ id, show }: CanvasObjectControlsProps) => {
  if (show) {
    return <div style={{ position: "absolute", top: -10 }}>{id}</div>;
  }
};

export default CanvasObjectControls;
