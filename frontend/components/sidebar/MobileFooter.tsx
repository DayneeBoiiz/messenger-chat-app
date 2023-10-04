import useConversation from "../hooks/useConversation";
import useRoutes from "../hooks/useRoutes";
import MobileItem from "./MobileItem";

const Mobilefooter = () => {
  const { routes } = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  const handleRouteClick = (handler: () => void) => {
    handler();
  };

  return (
    <>
      <div
        className="fixed justify-between 
        w-full bottom-0 z-40 flex item-center bg-white border-t-[1px] lg:hidden"
      >
        {routes.map((route) => (
          <MobileItem
            key={route.href}
            href={route.href}
            active={route.active as boolean}
            icon={route.icon}
            onClick={() => handleRouteClick(route.handler)}
          />
        ))}
      </div>
    </>
  );
};

export default Mobilefooter;
