import userModel from "../models/user_model.js";
import sharp from "sharp";
import { deletePictures, uploadPicture, } from "../lib/picture-supabase-utils.js";
import support from "../lib/get-support.js";
const userController = {
    create: async (req, res) => {
        try {
            const userDetails = req.body;
            const user = await userModel.create(userDetails);
            if (user.status === 201) {
                res
                    .status(user.status)
                    .json({ success: true, data: user.data, message: user.message });
            }
            else {
                console.log(user.error);
                res.status(user.status).json({ success: false, message: user.message });
            }
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    verify: async (req, res) => {
        try {
            const userDetails = req.body;
            const user = await userModel.verify(userDetails);
            if (user.status === 200) {
                res
                    .status(user.status)
                    .json({ success: true, data: user.data, message: user.message });
            }
            else {
                console.log(user.error);
                res.status(user.status).json({ success: false, message: user.message });
            }
        }
        catch (error) {
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getPeople: async (req, res) => {
        try {
            const query = req.query.query;
            const response = await userModel.getPeople(query);
            res.status(response.status).json({
                success: true,
                data: response.data,
                message: response.message,
            });
        }
        catch {
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getUserDetails: async (req, res) => {
        try {
            const id = req.query.query;
            const response = await userModel.getUserDetails(id);
            res.status(response.status).json({
                success: true,
                data: response.data,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    sendFriendRequest: async (req, res) => {
        try {
            const friendRequestDetails = req.body;
            const response = await userModel.sendFriendRequest(friendRequestDetails);
            res.status(response.status).json({
                success: true,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getPendingRequests: async (req, res) => {
        try {
            const recipientId = req.query.recipientId;
            const response = await userModel.getPendingRequests(recipientId);
            const data = response.data.map((item) => {
                const { id, requester_id, requester } = item;
                return { id, requester_id, ...requester };
            });
            res.status(response.status).json({
                success: true,
                data: data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    deletePendingRequest: async (req, res) => {
        try {
            const id = req.query.friendRequestId;
            const response = await userModel.deletePendingRequest(id);
            res.status(response.status).json({
                success: true,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    acceptPendingRequest: async (req, res) => {
        try {
            const id = req.body.friendRequestId;
            const response = await userModel.acceptPendingRequest(id);
            res.status(response.status).json({
                success: true,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getFriendshipStatus: async (req, res) => {
        try {
            const friendshipDetails = req.query.friendshipDetails;
            const response = await userModel.getFriendshipStatus(friendshipDetails);
            res.status(response.status).json({
                success: true,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    createGeneralNotifications: async (req, res) => {
        try {
            const notificationDetails = req.body;
            const notification = await userModel.createGeneralNotifications(notificationDetails);
            res.status(notification.status).json({
                success: true,
                data: notification.data || null,
                error: notification.error || null,
                message: notification.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getGeneralNotifications: async (req, res) => {
        try {
            const notificationDetails = req.query;
            const notification = await userModel.getGeneralNotification(notificationDetails);
            if (notification?.data && notification.data.length > 0) {
                const data = notification.data.map((item) => {
                    return {
                        notification_description: item.notification_description,
                        ...item.notification_from,
                    };
                });
                console.log(data);
                res.status(notification.status).json({
                    success: true,
                    data: data || null,
                    error: notification.error || null,
                    message: notification.message,
                });
            }
            else {
                res.status(notification.status).json({
                    success: true,
                    data: notification.data || null,
                    error: notification.error || null,
                    message: notification.message,
                });
            }
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getFriendsDetails: async (req, res) => {
        try {
            const userId = req.query.query;
            const response = await userModel.getFriendsDetails(userId);
            const data = response.data.map((item) => {
                const { fk_recipient, fk_requester } = item;
                //@ts-ignore
                return fk_recipient.id === userId ? fk_requester : fk_recipient;
            });
            res.status(response.status).json({
                success: true,
                data: data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    createPost: async (req, res) => {
        try {
            const description = req.body.description;
            const file = req.file;
            const userId = req.body.userId;
            if (!(file && description))
                throw new Error("No file or description provided");
            const uuid = crypto.randomUUID();
            const images = [{ width: 680, fileName: `680-${uuid}-${userId}photo` }];
            const [urlWithoutSize] = await Promise.all(images.map(async (image) => {
                const buffer = await sharp(file.buffer)
                    .resize({ width: image.width })
                    .toBuffer();
                const response = await uploadPicture(image.fileName, buffer);
                return response;
            }));
            const response = await userModel.createPost(urlWithoutSize, description, userId);
            res.status(response.status).json({
                response: response.success,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = req.query.postId;
            const response = await userModel.deletePost(postId);
            const deleted = await deletePictures(response.data.post_picture_link);
            res.status(response.status).json({
                success: true,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getYourPosts: async (req, res) => {
        try {
            const userId = req.query.userId;
            const response = await userModel.getYourPosts(userId);
            const posts = response.data.map((post) => {
                return {
                    user: {
                        firstName: post.user_id.first_name,
                        lastName: post.user_id.last_name,
                        avatarLink: post.user_id.profile_picture_url,
                        userId: post.user_id.id,
                    },
                    postId: post.id,
                    description: post.description,
                    pictureLink: post.post_picture_link,
                };
            });
            res.status(response.status).json({
                response: response.success,
                data: posts || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    getFriendsPosts: async (req, res) => {
        try {
            const userId = req.query.userId;
            const friendsResponse = await userModel.getFriendsDetails(userId);
            const friendsDetails = friendsResponse.data.map((item) => {
                const { fk_recipient, fk_requester } = item;
                //@ts-ignore
                return fk_recipient.id === userId ? fk_requester : fk_recipient;
            });
            const friendIds = friendsDetails.map((friend) => friend.id);
            const response = await userModel.getFriendsPosts(friendIds);
            const posts = response.data.map((post) => {
                return {
                    user: {
                        firstName: post.user_id.first_name,
                        lastName: post.user_id.last_name,
                        avatarLink: post.user_id.profile_picture_url,
                        userId: post.user_id.id,
                    },
                    postId: post.id,
                    description: post.description,
                    pictureLink: post.post_picture_link,
                };
            });
            const data = res.status(response.status).json({
                response: response.success,
                data: posts || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    createLike: async (req, res) => {
        try {
            const likeDetails = req.body;
            const response = await userModel.createLike(likeDetails);
            res.status(response.status).json({
                response: response.success,
                data: response.data,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    likeStatus: async (req, res) => {
        try {
            const likeDetails = req.query;
            const response = await userModel.likeStatus(likeDetails);
            res.status(response.status).json({
                response: response.success,
                data: response.data || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    deleteLike: async (req, res) => {
        try {
            const likeId = req.params.likeId;
            console.log(likeId);
            const response = await userModel.deleteLike(likeId);
            res.status(response.status).json({
                response: response.success,
                data: null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getPeopleWhoLikedThePost: async (req, res) => {
        try {
            const postId = req.params.postId;
            const response = await userModel.getPeopleWhoLikedThePost(postId);
            const data = 
            //@ts-ignore
            response.data.length > 0
                ? //@ts-ignore
                    response.data.map((like) => ({
                        id: like.user_details.id,
                        firstName: like.user_details.first_name,
                        lastName: like.user_details.last_name,
                        profilePictureUrl: like.user_details.profile_picture_url,
                    }))
                : response.data;
            res.status(response.status).json({
                response: response.success,
                data,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    createComment: async (req, res) => {
        try {
            const commentDetails = req.body;
            const response = await userModel.createComment(commentDetails);
            res.status(response.status).json({
                response: response.success,
                error: response.message || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getAllComments: async (req, res) => {
        try {
            const postId = req.params.postId;
            const response = await userModel.getAllComments(postId);
            const data = 
            //@ts-ignore
            response.data.length > 0
                ? //@ts-ignore
                    response.data.map((comment) => ({
                        id: comment.user_details.id,
                        firstName: comment.user_details.first_name,
                        lastName: comment.user_details.last_name,
                        profilePictureUrl: comment.user_details.profile_picture_url,
                        description: comment.description,
                        commentId: comment.id,
                    }))
                : response.data;
            res.status(response.status).json({
                response: response.success,
                data,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error", error });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const response = await userModel.deleteComment(commentId);
            res.status(response.status).json({
                response: response.success,
                data: null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    createMessages: async (req, res) => {
        try {
            const message = req.body;
            const messagesInSnakeCasing = {
                message: message.message,
                sender_id: message.senderId,
                receiver_id: message.receiverId,
                created_at: message.created_at,
            };
            const response = await userModel.createMessages(messagesInSnakeCasing);
            res.status(response.status).json({
                response: response.success,
                data: null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getChats: async (req, res) => {
        try {
            const ids = req.query;
            const response = await userModel.getChats(ids);
            res.status(response.status).json({
                response: response.success,
                data: response.snakeToCamel || null,
                error: response.error || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getLastMessages: async (req, res) => {
        try {
            const ids = req.body;
            console.log(ids);
            const responses = (await Promise.allSettled(ids.map(async (chat) => {
                const response = (await userModel.getLastMessages(chat));
                return response;
            })));
            const data = responses
                .map((response) => response.value)
                .filter((chat) => !!chat);
            const response = {
                status: 200,
                message: "chats found",
                snakeToCamel: data,
                success: true,
            };
            res.status(response.status).json({
                response: response.success,
                data: response.snakeToCamel || null,
                message: response.message,
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
    getSupport: async (req, res) => {
        try {
            const { message } = req.body;
            const response = await support(message);
            const generatedText = response[0].generated_text;
            console.log(generatedText);
            res.status(200).json({
                response: true,
                data: generatedText,
                message: "response received",
            });
        }
        catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
};
export default userController;
