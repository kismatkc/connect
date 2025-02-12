import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { HelpCircleIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { socketInstance } from "@/lib/web-sockets";
import { useRouter } from "next/navigation";

const HeaderUserDropDownMenu = () => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDrowdown] = useState(false);
  const router = useRouter();

  return (
    <DropdownMenu
      open={openDropdown}
      onOpenChange={(val) => setOpenDrowdown(val)}
    >
      <DropdownMenuTrigger
        asChild
        className=" md:size-11 flex justify-center items-center"
      >
        <Avatar className="size-8 ">
          <AvatarImage src={session?.user?.image as string} />
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="container-bg-dark container-bg-light mt-1 mr-2">
        <DropdownMenuSeparator />
        <Link href={`/${session?.user.id}`} className=" flex items-center ">
          <DropdownMenuItem
            onClick={() => setOpenDrowdown(false)}
            className="w-full"
          >
            <Avatar className="size-7 ">
              <AvatarImage src={session?.user?.image as string} />
            </Avatar>
            <span className="text-sm font-semibold ml-1 ">
              {session?.user.name &&
                session.user.name[0].toUpperCase() +
                  session.user.name.toLocaleLowerCase().slice(1)}
            </span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center"
          onClick={() => router.push("/support")}
        >
          <button
            className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark  
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-all duration-200 size-8  flex items-center justify-center  "
          >
            <HelpCircleIcon className="scale-110" />
          </button>
          <span className="text-sm font-semibold">Help & support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center "
          onClick={() => {
            try {
              signOut();
              socketInstance.emit("unregisterUser", {
                senderId: session?.user.id,
              });
              router.push("/log-in");
              socketInstance.disconnect();
            } catch (error) {
              toast.error("Please try again");
            }
          }}
        >
          <button
            className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark  
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-all duration-200 size-8  flex items-center justify-center  "
          >
            <LogOutIcon className="scale-110" />
          </button>
          <span className="text-sm font-semibold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserDropDownMenu;
