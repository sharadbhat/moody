import "./index.css";
import BoardName from "./BoardName";
import Settings from "./Settings";
import { useMoodyStore } from "../../utils/store";

const Navbar = () => {
  const { boardName } = useMoodyStore((state) => state);

  return (
    <div className="navbar">
      <div className="logo">Logo</div>
      <BoardName name={boardName} />
      <Settings />
    </div>
  );
};

export default Navbar;
