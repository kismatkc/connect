import { Api, friendRequest } from "@/lib/axios-utils";
import { useQuery } from "@tanstack/react-query";
export type friendsWithStatus = {
  id: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string;
  status: string;
};
const useGetFriends = (userId: string | undefined) =>
  useQuery({
    queryKey: ["friends", userId],

    queryFn: async (): Promise<friendsWithStatus[]> => {
      const friendsDetails = await Api.get("/get-friends", {
        params: {
          query: userId,
        },
      });
      const friends = friendsDetails.data.data;
      const ids =
        friends.length > 0
          ? friends.map((item: friendsWithStatus) => item.id)
          : friends;
      const response = await Api.get("/friends-status", {
        params: { ids },
      });
      const friendsWithStatus =
        friends.length > 0
          ? friends.map((item: friendsWithStatus) => ({
              ...item,
              status: response.data.data[item.id],
            }))
          : [];
      return friendsWithStatus;
    },
    enabled: !!userId,
  });

export default useGetFriends;
