import { Link } from "react-router";
import { LanguageSelector } from "./LanguageSelector";
import ProfileAvatar from "../../homepage/components/ProfileAvatar";

const Header = () => {
  return (
    <div className="flex flex-row gap-4 justify-between py-4 mx-4">
      <div className="text-xl">
        <Link to="/">🚀 DevArena</Link>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <LanguageSelector />
        <ProfileAvatar />
      </div>
    </div>
  );
};

export default Header;
