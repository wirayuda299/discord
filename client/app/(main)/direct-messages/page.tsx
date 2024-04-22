import ServerSidebarLinksItem from "@/components/sidebar/server-sidebar-links";
import { serverSidebarLinks } from "@/constants/sidebarLinks";

export default function DirectMessages() {
  return (
    <aside
      className={
        "no-scrollbar border-r-foreground size-full min-h-screen min-w-[255px] max-w-[255px]  gap-3 overflow-y-auto border-r-2 md:h-full md:bg-[#2b2d31]"
      }
    >
      <div className="flex w-full flex-col items-center p-3">
        <form>
          <input
            className="bg-foreground rounded px-2 py-1 placeholder:text-xs focus-visible:outline-none"
            type="search"
            placeholder="Search or start conversation"
          />
        </form>
      </div>
      <ul className="flex flex-col justify-start gap-3">
        {serverSidebarLinks.map((item) => (
          <ServerSidebarLinksItem
            icons={item.icons}
            label={item.label}
            path={item.path}
            key={item.label}
          />
        ))}
      </ul>
    </aside>
  );
}
