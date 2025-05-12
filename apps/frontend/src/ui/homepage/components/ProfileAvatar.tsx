import { useUserStore } from "../../../store/userStore";

const ProfileAvatar = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return;

  return (
    <img
      src={user.profilePicture}
      className="h-8 aspect-square rounded-full"
      crossOrigin="anonymous"
    />
  );
};

export default ProfileAvatar;
