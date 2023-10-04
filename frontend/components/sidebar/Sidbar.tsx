"use client";

import DesktopSideBar from "./DesktopSideBar";
import useCurrentUser from "../hooks/useCurrentUser";
import MobileFooter from "./MobileFooter";

function Sidebar({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useCurrentUser();

  return (
    <>
      {loading === false && (
        <div className="h-full">
          {currentUser && (
            <>
              <DesktopSideBar currentUser={currentUser} />
              <MobileFooter />
              <main className="lg:pl-20 h-full">{children}</main>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
