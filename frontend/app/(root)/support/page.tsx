"use client";
import { ArrowLeft, Loader2, PhoneIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn, normalizeInput } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useSession } from "next-auth/react";
import AutoGrowTextarea from "@/components/auto-grow-text-area-chat";
import { useRouter } from "next/navigation";

const ChatWithBot = () => {
  const { data: senderUser } = useSession();
  const receiverId = process.env.NEXT_PUBLIC_BOTUUID;
  const messageContainer = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      message: string;
      senderId: string;
      receiverId: string;
      created_at: Date;
    }[]
  >([]);

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
    return () => {};
  }, [messages]);
  const router = useRouter();

  if (!messages || !senderUser)
    return (
      <section className="flex w-full h-screen justify-center items-center">
        <Loader2 className="animate-spin" />
      </section>
    );

  return (
    <section className="flex flex-col h-[85vh]  relative p-4">
      <div className="flex justify-between ">
        <button
          className="flex justify-end items-center"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={28} />
        </button>
        <div className="flex gap-x-1">
          <div>
            <Image
              //@ts-ignore

              src="/header/zaden.png"
              alt="z"
              width={36}
              height={36}
              className="rounded-full w-[36px] h-[36px] flex items-center justify-center"
              priority
            />
            <div className="flex flex-col justify-center"></div>
          </div>
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
                      //@ts-ignore

                      src={
                        message.senderId === senderUser.user.id
                          ? senderUser.user.image
                          : "/header/zaden.png"
                      }
                      alt={
                        message.senderId === senderUser.user.id
                          ? `${
                              senderUser.user.name && senderUser.user.name[0]
                            } `
                          : "Zaden"
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
        ) : (
          <div>
            <p className="w-full text-center">
              Don&apos;t reload.Dont expect good answer.
            </p>
          </div>
        )}
      </div>
      <AutoGrowTextarea
        placeholder="Type message"
        message={message}
        setMessage={async (message: string) => {
          setMessage(message);
        }}
        //@ts-ignore
        receiverId={receiverId}
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

export default ChatWithBot;
