import React from "react";

type MenuTabProps = {
  onClickHandler: () => void;
  menuIcon: React.ReactNode;
  label: string;
};

const MenuTab = ({ label, menuIcon, onClickHandler }: MenuTabProps) => {
  return (
    <div
      onClick={onClickHandler}
      className="flex flex-row gap-2 items-center cursor-pointer hover:bg-white/5 transition-all duration-200 ease-in-out px-3 py-2 rounded-lg"
    >
      {menuIcon}
      <div>{label}</div>
    </div>
  );
};

export default MenuTab;
