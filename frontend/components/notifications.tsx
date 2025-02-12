import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Bell, Check, ExternalLinkIcon, X } from "lucide-react";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import React from "react";
import { notifications } from "@/lib/axios-utils";
import Link from "next/link";

const HeaderUserDropDownMenu = () => {
  const [openDropdown, setOpenDrowdown] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const notificationContainerRef = useRef<HTMLDivElement>(null);
  const [friendRequests, setFriendRequests] = useState<
    {
      profile_picture_url: string;
      first_name: string;
      last_name: string;
      id: string;
      requester_id: string;
    }[]
  >([]);
  const [generalNotifications, setGeneralNotifications] = useState<
    {
      notification_description: string;
      profile_picture_url: string;
      first_name: string;
      last_name: string;
      id: string;
    }[]
  >([]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const notificationContainer = notificationContainerRef.current;
      const target = e.target;
      if (!notificationContainer?.contains(target as Node)) {
        setOpenDrowdown(false);
      }
    };
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!session || !openDropdown) return;

    const getPendingRequests = async () => {
      const newFriendRequests = await notifications.getPendingRequest(
        session.user.id
      );

      if (newFriendRequests) {
        const currentInStringFormat = JSON.stringify(friendRequests);
        const newStateInStringFormat = JSON.stringify(newFriendRequests);
        if (currentInStringFormat === newStateInStringFormat) return;
        const newState = JSON.parse(newStateInStringFormat);

        setFriendRequests(newState);
      }
    };
    const getNewGeneralNotifications = async () => {
      const newGeneralNotifications =
        await notifications.getGeneralNotifications({
          notificationType: "friendRequest",
          notificationFor: session.user.id,
        });
      if (newGeneralNotifications) {
        const currentInStringFormat = JSON.stringify(generalNotifications);
        const newStateInStringFormat = JSON.stringify(newGeneralNotifications);
        if (currentInStringFormat === newStateInStringFormat) return;
        const newState = JSON.parse(newStateInStringFormat);

        setGeneralNotifications(newState);
      }
    };
    getPendingRequests();
    getNewGeneralNotifications();
  }, [session, openDropdown, friendRequests, generalNotifications]);

  return (
    <div className="relative" ref={notificationContainerRef}>
      <button
        className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark size-8   md:size-11 flex justify-center items-center "
        onClick={() => setOpenDrowdown(!openDropdown)}
      >
        <Bell fill="black" className="size-5 md:size-7" />
      </button>
      {openDropdown && (
        <div className="z-50 absolute container-bg-dark container-bg-light right-1 top-[130%] shadow-md rounded-md border-t-2 w-[280px]">
          {!(friendRequests.length > 0 || generalNotifications.length > 0) ? (
            <div className="flex justify-center items-center p-5">
              No new notifcations found
            </div>
          ) : (
            <div>
              <ul className="flex flex-col w-full">
                {friendRequests.length > 0 &&
                  friendRequests.map((item) => (
                    <div
                      className="flex p-2 justify-between flex-nowrap"
                      key={item.id}
                    >
                      <div className="flex gap-x-3">
                        <Avatar className="size-7 ">
                          <AvatarImage src={item.profile_picture_url} />
                        </Avatar>

                        <div className="text-sm font-semibold self-center overflow-x-clip flex gap-x-1 flex-nowrap">
                          <span>{item.first_name}</span>
                          <span>{item.last_name}</span>
                        </div>
                      </div>

                      <div className="flex gap-x-2 ml-3 ">
                        <button
                          className=" rounded-full bg-green-400 hover:bg-green-600 flex items-center justify-center p-1"
                          onClick={async () => {
                            const success =
                              await notifications.acceptPendingRequest(item.id);
                            const createNotification =
                              await notifications.createGeneralNotification({
                                notificationType: "friendRequest",
                                notificationDescription:
                                  "has accepted your friend request",
                                notificationFrom: session?.user.id as string,
                                notificationFor: item.requester_id,
                              });
                            if (success) {
                              setFriendRequests((prevRequests) =>
                                prevRequests.filter(
                                  (req) => !(item.id === req.id)
                                )
                              );
                              return toast.success("Request Accepted");
                            }
                            toast.error(
                              "Requets Not Accepted,Please try again"
                            );
                          }}
                        >
                          <Check />
                        </button>
                        <button
                          className="  rounded-full bg-red-400 flex hover:bg-red-600 items-center justify-center  p-1"
                          onClick={async () => {
                            const success =
                              await notifications.deletePendingRequest(item.id);
                            if (success) {
                              setFriendRequests((prevRequests) =>
                                prevRequests.filter(
                                  (req) => !(item.id === req.id)
                                )
                              );
                              return toast.success("Request Deleted");
                            }
                            toast.error("Requets not deleted,Please try again");
                          }}
                        >
                          <X />
                        </button>
                        <button
                          className="rounded-full  flex items-center justify-center "
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDrowdown(false);
                            router.push(`/${item.requester_id}`);
                          }}
                        >
                          <ExternalLinkIcon />
                        </button>
                      </div>
                    </div>
                  ))}
              </ul>
              <ul className="flex flex-col w-full">
                {generalNotifications.length > 0 &&
                  generalNotifications.map((item) => (
                    <Link
                      className="flex p-2 justify-between flex-nowrap"
                      key={item.id}
                      href={`/${item.id}`}
                      onClick={() => setOpenDrowdown(false)}
                    >
                      <div className="flex gap-x-3">
                        <Avatar className="size-7 ">
                          <AvatarImage src={item.profile_picture_url} />
                        </Avatar>

                        <div className="text-sm   overflow-x-clip flex flex-col ">
                          <div className="font-semibold flex gap-x-1 flex-nowrap">
                            <span>{item.first_name}</span>
                            <span>{item.last_name}</span>
                          </div>

                          <span>{item.notification_description}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderUserDropDownMenu;
