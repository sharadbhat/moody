import { useMoodyStore } from "../../utils/store";
import BoardName from "./BoardName";
import Settings from "./Settings";

import "./index.css";

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
