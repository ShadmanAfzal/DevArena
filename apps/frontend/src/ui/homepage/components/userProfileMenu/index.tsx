import { KeyRoundIcon, LogOut, SettingsIcon, Sun } from "lucide-react";
import { User, useUserStore } from "../../../../store/userStore";
import MenuTab from "./MenuTab";
import { useNavigate } from "react-router";

type UserProfileMenuProps = {
  user: User;
  closeMenu?: () => void;
};

export const UserProfileMenu = ({ user, closeMenu }: UserProfileMenuProps) => {
  const signOut = useUserStore((state) => state.signOut);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    closeMenu?.();
  };

  const handleAppearanceClick = () => {
    closeMenu?.();
  };

  const handleSettingsClick = () => {
    closeMenu?.();
  };

  const goToAdminDashboard = () => {
    closeMenu?.();
    navigate("/admin");
  };

  return (
    <div className="bg-card rounded-lg py-3 px-2 w-64 flex flex-col gap-4 mt-2 mr-2 shadow-2xl drop-shadow-neutral-950">
      <div className="flex flex-row gap-2">
        <img
          src={user.profilePicture}
          className="h-12 aspect-square rounded-full"
          crossOrigin="anonymous"
        />
        <div className="text-[22px] font-bold">{`${user.firstName} ${user.lastName}`}</div>
      </div>
      <div>
        <MenuTab
          label="Admin Dashboard"
          menuIcon={<KeyRoundIcon size="18" />}
          onClickHandler={goToAdminDashboard}
        />
        <MenuTab
          label="Appearance"
          menuIcon={<Sun size="18" />}
          onClickHandler={handleAppearanceClick}
        />
        <MenuTab
          label="Settings"
          menuIcon={<SettingsIcon size="18" />}
          onClickHandler={handleSettingsClick}
        />
        <MenuTab
          label="Sign out"
          menuIcon={<LogOut size="18" />}
          onClickHandler={handleSignOut}
        />
      </div>
    </div>
  );
};
