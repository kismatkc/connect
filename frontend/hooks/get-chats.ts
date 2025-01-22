import { Api } from "@/lib/axios-utils";
import { useQuery } from "@tanstack/react-query";

const useGetChats = (
  senderId: string | undefined,
  recieverId: string | undefined
) =>
  useQuery({
    queryKey: ["chats", senderId, recieverId],
    queryFn: async (): Promise<
      {
        message: string;
        senderId: string;
        receiverId: string;
        created_at: Date;
      }[]
    > => {
      const chats = await Api.get("/get-chats", {
        params: {
          sender_id: senderId,
          receiver_id: recieverId,
        },
      });
      return chats.data.data;
    },
    enabled: !!senderId || !!recieverId,
  });

export default useGetChats;
