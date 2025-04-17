import "./index.css";
import BoardName from "./BoardName";
import Settings from "./Settings";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">Logo</div>
      <BoardName />
      <Settings />
    </div>
  );
};

export default Navbar;
