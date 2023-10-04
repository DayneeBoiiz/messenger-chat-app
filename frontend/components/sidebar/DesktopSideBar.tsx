import useRoutes from "../hooks/useRoutes";
import { useState } from "react";
import DesktopItems from "./DesktopItems";
import Avatar from "../avatar";
import SettingModal from "./SettingModal";
import { usersProps } from "@/app/users/layout";

interface DesktopSideBarProps {
  currentUser: usersProps;
}

const DesktopSideBar: React.FC<DesktopSideBarProps> = ({ currentUser }) => {
  const { routes } = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  const handleRouteClick = (handler: () => void) => {
    handler();
  };

  return (
    <>
      <SettingModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 lg:overflow-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {routes.map((item) => (
              <DesktopItems
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active as boolean}
                onClick={() => handleRouteClick(item.handler)}
              />
            ))}
          </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="cursor-pointer hover:opacity-75 transition"
          >
            {currentUser && (
              <>
                <Avatar currentUser={currentUser} />
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSideBar;
