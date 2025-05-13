import { Link } from "react-router";
import { LanguageSelector } from "./LanguageSelector";
import ProfileAvatar from "../../homepage/components/ProfileAvatar";

const Header = () => {
  return (
    <div className="flex flex-row gap-4 justify-between py-4 mx-4">
      <div className="text-3xl font-bold">
        <Link to="/" className="flex flex-row">
          <div className="">arena</div>
          <div className="text-yellow-500">.dev</div>
        </Link>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <LanguageSelector />
        <ProfileAvatar />
      </div>
    </div>
  );
};

export default Header;
