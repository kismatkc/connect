import { Loader2, PhoneIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import AutoGrowTextarea from "./auto-grow-text-area-chat";
import { useMobileChatSheetStore } from "@/hooks/global-zustand-hooks";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { cn, normalizeInput } from "@/lib/utils";
import { socketInstance } from "@/lib/web-sockets";
import useGetChats from "@/hooks/get-chats";
import { formatDate } from "date-fns";

const IndividualChat = () => {
  const { receiveruser } = useMobileChatSheetStore();
  const messageContainer = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const { data: senderUser } = useSession();
  const { data: chats } = useGetChats(senderUser?.user.id, receiveruser?.id);
  const [messages, setMessages] = useState<
    {
      message: string;
      senderId: string;
      receiverId: string;
      created_at: Date;
    }[]
  >(chats || []);

  useEffect(() => {
    if (!chats) return;
    setMessages(chats);
  }, [chats]);

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
    return () => {};
  }, [messages]);

  useEffect(() => {
    const handleIncomingMessage = (message: string) => {
      const messageDetails = {
        message: normalizeInput(message),
        senderId: receiveruser?.id as string,
        receiverId: senderUser?.user.id as string,
        created_at: new Date(),
      };
      setMessages((old) => {
        return [messageDetails, ...old];
      });
    };

    socketInstance.on("receiveMessage", handleIncomingMessage);

    return () => {
      socketInstance.off("receiveMessage", handleIncomingMessage);
    };
    //@ts-ignore
  }, [senderUser?.user.id, receiveruser?.id]);

  if (!receiveruser || !senderUser || !socketInstance || !messages)
    return (
      <section className="flex w-full h-full justify-center items-center">
        <Loader2 className="animate-spin" />
      </section>
    );

  return (
    <section className="flex flex-col h-[92%] relative ">
      <div className="flex justify-between ">
        <div className="flex gap-x-1">
          <Image
            //@ts-ignore

            src={receiveruser?.profilePicture || botDetails.profilePicture}
            alt={`${receiveruser.name[0]} `}
            width={36}
            height={36}
            className="rounded-full w-[36px] h-[36px] flex items-center justify-center"
            priority
          />
          <div className="flex flex-col justify-center">
            <span className="text-base font-semibold">
              {
                //@ts-ignore
                receiveruser?.name
              }
            </span>
          </div>
        </div>

        <div className="flex gap-x-4">
          <PhoneIcon />
          <VideoIcon />
        </div>
      </div>

      <div
        className="flex  overflow-y-scroll flex-col gap-y-5 pt-6 grow"
        ref={messageContainer}
      >
        {messages && messages.length > 1 ? (
          messages
            .slice()
            .sort(({ created_at: a }, { created_at: b }) => {
              const dateA = new Date(a); // Ensure `a` is a Date object
              const dateB = new Date(b); // Ensure `b` is a Date object
              return dateA.getTime() - dateB.getTime();
            })
            .map((message) => {
              return (
                <div
                  key={message.senderId}
                  className={`flex gap-x-1 items-stretch  ${
                    !(message.senderId === senderUser.user.id) &&
                    "flex-row-reverse"
                  }`}
                >
                  <div
                    className={` px-2 w-full   bg-icon-bg-light dark:bg-icon-bg-dark rounded-lg   break-words font-semibold text-lg flex items-center ${
                      message.senderId === senderUser.user.id
                        ? "justify-end"
                        : "justiy-start"
                    }`}
                  >
                    {message.message}
                  </div>
                  <div className="flex flex-col">
                    <Image
                      src={
                        (message.senderId === senderUser.user.id
                          ? senderUser.user.image
                          : receiveruser?.profilePicture) as string
                      }
                      alt={
                        message.senderId === senderUser.user.id
                          ? `${
                              senderUser.user.name && senderUser.user.name[0]
                            } `
                          : `${receiveruser.name[0]} `
                      }
                      width={36}
                      height={36}
                      className="rounded-full w-[36px] h-[36px] flex items-center justify-center"
                      priority
                    />
                    <span
                      className={` text-[10px] font-medium
                      ${
                        message.senderId === senderUser.user.id
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {formatDate(message.created_at, "h:maaa ")}
                    </span>
                  </div>
                </div>
              );
            })
        ) : messages.length > 0 ? (
          <div
            className={cn("w-full text-left my-3", {
              "text-right": messages[0].senderId === senderUser.user.id,
            })}
            key={messages[0].senderId}
          >
            <span className=" bg-icon-bg-light dark:bg-icon-bg-dark rounded-lg px-3 py-3 ">
              {messages[0].message}
            </span>
          </div>
        ) : null}
      </div>
      <AutoGrowTextarea
        placeholder="Type message"
        message={message}
        setMessage={(message: string) => {
          setMessage(message);
        }}
        //@ts-ignore
        receiverId={receiveruser.id}
        senderId={senderUser.user.id}
        setMessages={(message: {
          message: string;
          senderId: string;
          receiverId: string;
          created_at: Date;
        }) => {
          setMessages((old) => [message, ...old]);
        }}
      />
    </section>
  );
};

export default IndividualChat;
