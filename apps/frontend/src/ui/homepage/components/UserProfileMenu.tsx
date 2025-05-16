import { LogOut, SettingsIcon, Sun } from "lucide-react";
import { User, useUserStore } from "../../../store/userStore";

type UserProfileMenuProps = {
  user: User;
  closeMenu?: () => void;
};

export const UserProfileMenu = ({ user, closeMenu }: UserProfileMenuProps) => {
  const signOut = useUserStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    closeMenu?.();
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
        <div
          onClick={closeMenu}
          className="flex flex-row gap-2 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-3 py-2 rounded-lg"
        >
          <Sun size={18} />
          <div>Appearance</div>
        </div>

        <div
          onClick={closeMenu}
          className="flex flex-row gap-2 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-3 py-2 rounded-lg"
        >
          <SettingsIcon size={18} />
          <div>Settings</div>
        </div>
        <div
          onClick={handleSignOut}
          className="flex flex-row gap-2 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-3 py-2 rounded-lg"
        >
          <LogOut size={18} />
          <div>Sign out</div>
        </div>
      </div>
    </div>
  );
};
