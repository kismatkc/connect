import React, { useState, useRef } from "react";
import { toast } from "sonner";

import { Send, SmileIcon } from "lucide-react";
import { socketInstance } from "@/lib/web-sockets";
import { Api } from "@/lib/axios-utils";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { normalizeInput } from "@/lib/utils";
const getSupport = async (message: string) => {
  try {
    const response = await Api.post("/get-support", {
      message,
    });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};
async function createMessages(message: {
  message: string;
  senderId: string;
  receiverId: string;
  created_at: Date;
}): Promise<boolean> {
  try {
    await Api.post("/create-messages", message);
    return true;
  } catch (error) {
    console.log("error fetching past conversations");
    return false;
  }
}
const AutoGrowTextarea = ({
  placeholder,
  senderId,
  receiverId,
  message,
  setMessage,
  setMessages,
}: {
  placeholder: string;
  senderId: string;
  receiverId: string;
  message: string | undefined;
  setMessage: (message: string) => void;
  setMessages: (message: {
    message: string;
    senderId: string;
    receiverId: string;
    created_at: Date;
  }) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Adjust height dynamically based on content
    textarea.style.height = "auto"; // Reset height first
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to match content
    setMessage(textarea.value);
  };

  const submitMessage = async () => {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      return toast.error("Oops, you forgot to write!");
    }

    try {
      // Emit the message

      // Update local messages state
      setMessages({
        message: trimmedMessage,
        senderId,
        receiverId,
        created_at: new Date(),
      });
      setMessage("");

      // Save to backend
      if (!(process.env.NEXT_PUBLIC_BOTUUID === receiverId)) {
        console.log("not bot", process.env.NEXT_PUBLIC_BOTUUID, receiverId);

        socketInstance.emit("sendMessage", {
          receiverId,
          message: trimmedMessage,
        });

        createMessages({
          message: trimmedMessage,
          senderId,
          receiverId,
          created_at: new Date(),
        });
      } else {
        console.log(" bot", process.env.NEXT_PUBLIC_BOTUUID, receiverId);

        const response = await getSupport(trimmedMessage);
        const messageDetails = {
          message: normalizeInput(response),
          senderId: receiverId as string,
          receiverId: senderId as string,
          created_at: new Date(),
        };
        setMessages(messageDetails);
      }

      // Clear the message

      textareaRef.current!.style.height = "auto";
    } catch (error: any) {
      toast.error(error.message || "Failed to send the message");
    }
  };

  return (
    <div className="flex flex-col w-full mt-4 ">
      <textarea
        id="message"
        ref={textareaRef}
        onInput={handleInput}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter") {
            e.preventDefault(); // Prevent newline behavior
            submitMessage(); // Submit the message
          }
        }}
        value={message}
        rows={1}
        placeholder={placeholder}
        className="w-full pb-7 pt-3 pl-2.5 text-baserounded-lg resize-none overflow-hidden focus:outline-none  bg-icon-bg-light dark:bg-icon-bg-dark rounded-lg h-full mb-7 text-left"
      />
      <div className="flex justify-between -mt-14 pt-1 px-1">
        <DropdownMenu
          open={openEmoji}
          onOpenChange={(state) => setOpenEmoji(state)}
        >
          <DropdownMenuTrigger asChild>
            <div className="[&>svg]:stroke-[1.5px] dark:[&>svg]:stroke-[1px] [&>svg]:stroke-gray-700 dark:[&>svg]:stroke-white ">
              <SmileIcon className="cursor-pointer " />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="pl-14 pt-2">
            <EmojiPicker
              open={openEmoji}
              reactionsDefaultOpen
              allowExpandReactions={false}
              emojiStyle={EmojiStyle.NATIVE}
              onEmojiClick={({ emoji }) => {
                const textarea = textareaRef.current as HTMLTextAreaElement;
                const { selectionStart: emojiPosition } = textarea;
                const beforeEmoji = textarea.value.substring(0, emojiPosition);
                const afterEmoji = textarea.value.substring(emojiPosition);
                const newDescription = beforeEmoji + emoji + afterEmoji;
                setMessage(newDescription);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <Send
          className="stroke-[1.5px] dark:stroke-[1px] stroke-gray-700 dark:stroke-white cursor-pointer"
          onClick={submitMessage}
        />
      </div>
    </div>
  );
};

export default AutoGrowTextarea;
