import { Api } from "@/lib/axios-utils";
import { useQuery } from "@tanstack/react-query";
import { friendsWithStatus } from "./get-friends";
const useGetLastMessages = (
  user: any | null,
  friends: friendsWithStatus[] | undefined
) =>
  useQuery({
    queryKey: ["lastMessages"],
    queryFn: async (): Promise<
      {
        message: string;
        firstName: string;
        profilePictureUrl: string;
        lastName: string;
        id: string;
        createdAt: string;
        status: string;
      }[]
    > => {
      const senderId = user.user.id;
      const chatDetails: { senderId: string; receiverId: string }[] = (
        friends as friendsWithStatus[]
      ).map((item) => ({
        senderId: senderId as string,
        receiverId: item.id,
      }));
      const messages: {
        message: string;
        firstName: string;
        profilePictureUrl: string;
        lastName: string;
        id: string;
        createdAt: string;
        status: string;
      }[] = await Api.post("/get-last-messages", chatDetails);
      
      //@ts-ignore
const filteredData = messages.data.data.filter((item) => {
  return !(item.id === senderId);
})

      //@ts-ignore
      const pastMesssages = filteredData.sort(
        //@ts-ignore

        ({ createdAt: a }, { createdAt: b }) => {
          const dateA = new Date(a); // Ensure `a` is a Date object
          const dateB = new Date(b); // Ensure `b` is a Date object
          return dateA.getTime() - dateB.getTime();
        }
      );

      return pastMesssages;
    },
    enabled: !!(friends && friends.length > 0 && user),
  });

export default useGetLastMessages;
