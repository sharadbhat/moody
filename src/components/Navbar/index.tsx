import "./index.css";
import BoardName from "./BoardName";
import Settings from "./Settings";
import { CONSTANTS } from "../../utils/constants";

const Navbar = () => {
  return (
    <div className="navbar" style={{ cursor: CONSTANTS.CURSOR_DEFAULT }}>
      <div className="logo">Logo</div>
      <BoardName />
      <Settings />
    </div>
  );
};

export default Navbar;
