import { createGeneralNotificationsType, Post, PostDetailsType } from "@/types";
import axios from "axios";
const ApiOptions = () => {
  const options = {
    withCredentials: true,
    baseURL: "https://connectbackend.unfiltereddopamine.com/api",
  };

  return options;
};

export const friendRequest = {
  send: async (requestDetails: {
    requesterId: string;
    recipientId: string;
  }) => {
    try {
      const response = await Api.post("/send-friend-request", requestDetails);
      console.log(response.data);

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (recipientId: string) => {
    try {
      const response = await Api.get("/delete-friend-request", {
        params: recipientId,
      });

      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};

export const notifications = {
  getPendingRequest: async (recipientId: string) => {
    try {
      const response = await Api.get("/get-pending-request", {
        params: { recipientId },
      });

      return response.data.data;
    } catch (error) {
      console.log("notiffcation fetchign errors");
    }
  },
  deletePendingRequest: async (friendRequestId: string): Promise<boolean> => {
    try {
      const response = await Api.delete("/delete-pending-request", {
        params: { friendRequestId },
      });

      return response.data.success;
    } catch (error) {
      console.log("deleting request errors");
      return false;
    }
  },
  acceptPendingRequest: async (friendRequestId: string): Promise<boolean> => {
    try {
      const response = await Api.patch("/accept-pending-request", {
        friendRequestId,
      });

      return response.data.success;
    } catch (error) {
      console.log("Error accepting request");
      return false;
    }
  },
  getFriendshipStatus: async (friendshipDetails: {
    userId: string;
    friendId: string;
  }): Promise<{ status: string } | undefined> => {
    try {
      const response = await Api.get("/get-friendship-status", {
        params: { friendshipDetails },
      });
      if (!response) return;
      return response.data.data;
    } catch (error) {}
  },
  createGeneralNotification: async (
    notificationsDetails: createGeneralNotificationsType
  ) => {
    try {
      const response = await Api.post(
        "/create-general-notification",
        notificationsDetails
      );

      return response.data.data;
    } catch (error) {
      console.log("General notification error", error);
    }
  },
  getGeneralNotifications: async (notificationsDetails: {
    notificationFor: string;
    notificationType: string;
  }) => {
    try {
      const response = await Api.get("/get-general-notifications", {
        params: notificationsDetails,
      });

      return response.data.data;
    } catch (error) {
      console.log("General notification fetching error", error);
    }
  },
  getFriendsDetails: async (friendsDetails: { userId: string }) => {
    try {
      const response = await Api.get("/get-friends", {
        params: friendsDetails,
      });

      return response.data.data;
    } catch (error) {
      console.log("error getting friends details", error);
    }
  },
};

export const posts = {
  createPost: async ({
    description,
    picture,
    userId,
  }: PostDetailsType): Promise<boolean> => {
    try {
      const formData = new FormData();

      formData.append("picture", picture);
      formData.append("description", description);
      formData.append("userId", userId);
      const response = await Api.post("/create-post", formData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  deletePost: async (postId: string): Promise<boolean> => {
    try {
      const response = await Api.delete("/delete-post", {
        params: { postId },
      });

      return response.data.success;
    } catch (error) {
      console.log("deleting request errors");
      return false;
    }
  },
  getYourPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await Api.get("/get-your-posts", {
        params: { userId },
      });

      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getFriendsPosts: async (userId: string): Promise<Post[]> => {
    try {
      const response = await Api.get("/get-friends-posts", {
        params: { userId },
      });

      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export const like = {
  create: async (
    postId: string,
    userId: string
  ): Promise<{ id: string } | undefined> => {
    try {
      const response = await Api.post("/create-like", { postId, userId });
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  status: async (
    postId: string,
    userId: string
  ): Promise<{ id: string }[] | undefined> => {
    try {
      const response = await Api.get("/get-like-status", {
        params: { postId, userId },
      });

      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (likeId: string): Promise<boolean> => {
    try {
      const response = await Api.delete(`/delete-like/${likeId}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getPeopleWhoLikedThePost: async (
    postId: string
  ): Promise<
    | {
        id: string;
        firstName: string;
        lastName: string;
        profilePictureUrl: string;
      }[]
    | undefined
  > => {
    try {
      const response = await Api.get(
        `/get-people-who-liked-the-post/${postId}`
      );
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  },
};

export const comments = {
  create: async (commentDetails: {
    postId: string;
    userId: string;
    description: string;
  }): Promise<boolean | Error> => {
    try {
      const response = await Api.post("/create-comment", commentDetails);
      return response.data.success;
    } catch (error) {
      console.log(error);
      throw new Error("Couldnot create comment");
    }
  },
  getAllComments: async (
    postId: string
  ): Promise<
    | {
        id: string;
        firstName: string;
        lastName: string;
        profilePictureUrl: string;
        description: string;
        commentId: string;
      }[]
  > => {
    try {
      const response = await Api.get(`/get-all-comments/${postId}`);

      return response.data.data;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  },
  delete: async (commentId: string): Promise<boolean> => {
    try {
      const response = await Api.delete(`/delete-comment/${commentId}`);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
export const Api = axios.create(ApiOptions());
