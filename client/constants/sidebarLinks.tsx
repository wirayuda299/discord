import { Bell, LayoutGrid, MessageCircle, UserRoundPlus } from "lucide-react";

export const serverSidebarLinks = [
  {
    path: "/friends",
    icons: "/icons/friend.svg",
    label: "Friends",
  },
  {
    path: "/nitro",
    icons: "/icons/nitro.svg",
    label: "Nitro",
  },
  {
    path: "/shop",
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
    path: "/messages",
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
