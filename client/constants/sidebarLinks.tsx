import { Bell, LayoutGrid, MessageCircle, UserRoundPlus } from "lucide-react";

export const serverSidebarLinks = [
  {
    path: "?menu=friends&tab=online",
    icons: "/icons/friend.svg",
    label: "Friends",
  },
  {
    path: "?menu=nitro",
    icons: "/icons/nitro.svg",
    label: "Nitro",
  },
  {
    path: "?menu=shop",
    icons: "/icons/shop.svg",
    label: "Shop",
  },
] as const;

export const navItemsMobile = [
  {
    path: "/direct-messages",
    icon: <LayoutGrid color="#fff" size={30} />,
  },
  {
    path: "/direct-messages",
    icon: <MessageCircle color="#fff" size={30} />,
  },
  {
    path: "/notifications",
    icon: <Bell color="#fff" size={30} />,
  },
  {
    path: "/profile",
    icon: <UserRoundPlus color="#fff" size={30} />,
  },
] as const;
