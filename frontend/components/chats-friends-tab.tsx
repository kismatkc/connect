import { useMobileChatSheetStore } from "@/hooks/global-zustand-hooks";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect, useRef } from "react";
import useGetFriends from "@/hooks/get-friends";
import { useSession } from "next-auth/react";
import OnlineIndicator from "./online-indicator";
import useGetLastMessages from "@/hooks/fetch-last-message";

const ChatOrFriendsTab = () => {
  const { setShowIndividualChat, setUser, lastTab, setLastTab } =
    useMobileChatSheetStore();
  const { data: user } = useSession();
  const chatsOrFriendsContainerRef = useRef<HTMLDivElement>(null);

  const { data: friends } = useGetFriends(user?.user?.id);

  const { data: chats } = useGetLastMessages(user, friends);

  return (
    <Tabs defaultValue={lastTab || "Chats"} className="w-full">
      <TabsList className="w-full mb-2  bg-icon-bg-light dark:bg-icon-bg-dark">
        <TabsTrigger value="Chats" className="w-full">
          Chats
        </TabsTrigger>
        <TabsTrigger value="Friends" className="w-full">
          Friends
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Chats">
        <section className="flex flex-col gap-y-2 h-full">
          <h1 className="font-bold text-xl">Chats</h1>
          <div
            className="flex flex-col gap-y-4 h-full overflow-y-scroll"
            ref={chatsOrFriendsContainerRef}
            onClick={(e) => {
              const container = chatsOrFriendsContainerRef.current;
              const target = e.target as HTMLElement;
              if (container?.contains(target) && target === container) return;
              const divParent = target.closest("[data-user]") as HTMLDivElement;
              if (!divParent?.dataset?.user) return;
              const data = JSON.parse(divParent.dataset.user);
              const user: any = {
                id: data.id,
                name: `${data.firstName} ${data.lastName}`,
                profilePicture: data.profilePictureUrl,
                status: "online",
              };

              setUser(user);
              setLastTab("Chats");
              setShowIndividualChat(true);
            }}
          >
            {chats && chats?.length > 0 ? (
              chats.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-x-1 justify-start"
                  data-user={JSON.stringify(item)}
                >
                  {/* <Image
                    src={item?.profilePictureUrl as string}
                    alt={`${item.firstName[0].toLocaleUpperCase()}  `}
                    width={48}
                    height={48}
                    className="rounded-full w-[48px] h-[48px] flex items-center justify-center"
                    priority
                  /> */}
                  <OnlineIndicator
                    profilePictureUrl={item?.profilePictureUrl as string}
                    firstName={item.firstName}
                    status={item.status}
                    id={item.id}
                  />
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">{`${item?.firstName} ${item?.lastName}`}</span>
                    <span className="text-sm font-medium ">
                      {item?.message}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-semibold">
                  You dont have any past conversations.
                </span>
              </div>
            )}
          </div>
        </section>
      </TabsContent>
      <TabsContent value="Friends">
        <section className="flex flex-col gap-y-2 h-full">
          <h1 className="font-bold text-xl">Friends</h1>
          <div
            className="flex flex-col gap-y-4 h-full overflow-y-scroll"
            ref={chatsOrFriendsContainerRef}
            onClick={(e) => {
              const container = chatsOrFriendsContainerRef.current;
              const target = e.target as HTMLElement;
              if (container?.contains(target) && target === container) return;
              const divParent = target.closest("[data-user]") as HTMLDivElement;
              if (!divParent?.dataset?.user) return;
              const data = JSON.parse(divParent.dataset.user);
              const user: any = {
                id: data.id,
                name: `${data.first_name} ${data.last_name}`,
                profilePicture: data.profile_picture_url,
                status: "online",
              };

              setUser(user);
              setLastTab("Friends");

              setShowIndividualChat(true);
            }}
          >
            {friends && friends?.length > 0 ? (
              friends.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-start items-center gap-x-5"
                  data-user={JSON.stringify(item)}
                >
                  <OnlineIndicator
                    profilePictureUrl={item?.profile_picture_url as string}
                    firstName={item.first_name}
                    status={item.status}
                    id={item.id}
                  />
                  <div className="flex gap-x-1 flex-nowrap">
                    <span className="text-lg font-semibold">
                      {item?.first_name}
                    </span>
                    <span className="text-lg font-semibold">
                      {item?.last_name}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <span className="text-sm font-semibold">You dont friends</span>
              </div>
            )}
          </div>
        </section>
      </TabsContent>
    </Tabs>
  );
};

export default ChatOrFriendsTab;
