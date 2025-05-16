import { Popover } from "react-tiny-popover";
import { useUserStore } from "../../../store/userStore";
import { UserProfileMenu } from "./UserProfileMenu";
import { useState } from "react";

const ProfileAvatar = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const user = useUserStore((state) => state.user);

  const togglePopover = () => setIsPopoverOpen((prev) => !prev);

  if (!user) return;

  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["top", "bottom", "left", "right"]}
      content={<UserProfileMenu user={user} closeMenu={togglePopover} />}
      onClickOutside={togglePopover}
      transformMode="absolute"
    >
      <img
        src={user.profilePicture}
        className="h-8 aspect-square rounded-full cursor-pointer transition-all duration-200 ease-in-out hover:ring-4 hover:ring-white/10"
        crossOrigin="anonymous"
        onClick={togglePopover}
        referrerPolicy="no-referrer"
      />
    </Popover>
  );
};

export default ProfileAvatar;
