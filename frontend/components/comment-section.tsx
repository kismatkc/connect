import { Ellipsis, Loader2, Share, Share2Icon, TrashIcon } from "lucide-react";

import Like from "./like";
import { useEffect, useState } from "react";
import { comments } from "@/lib/axios-utils";
import { toast } from "sonner";
import useGetAllPostComments from "@/hooks/get-all-comment";
import { useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import { ViewMoreComment } from "./comment-sheet";
import ReadMore from "./read-more-text";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import useConfirmation from "./confirmation";
import AutoGrowTextarea from "./auto-grow-text-area-comments";
import { Post } from "@/types";
import { sharePost } from "@/lib/utils";
const CommentSection = ({
  userId,
  profilePictureUrl,
  fullName,
  post,
}: {
  userId: string;
  profilePictureUrl: string;
  post: Post;
  fullName: string;
}) => {
  const [description, setDescription] = useState<string>("");
  const { ConfirmationModel, decision: getDecision } = useConfirmation();
  const [open, setOpen] = useState<boolean>(false);
  const { data, error } = useGetAllPostComments(post.postId);
  useEffect(() => {}, [data]);
  const queryClient = useQueryClient();
  if (!data || error) {
    return (
      <div className="p-8 flex items-center justify-center w-full">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full mt-2 icon-bg-light dark:icon-bg-dark">
      <ConfirmationModel
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your
            comment and also remove it from our servers."
      />
      <div className="flex justify-between border-b-2 pb-3 items-center">
        <Like postId={post.postId} userId={userId} />

        <Share onClick={() => sharePost(post)} />
      </div>
      <div className="flex flex-col pt-2 pb-1">
        <ViewMoreComment
          showMoreButton={!(data && data.length > 1)}
          userId={userId}
          //@ts-ignore
          comments={data}
          postId={post.postId}
        />

        {data && data.length > 0 ? (
          <div
            className="flex justify-between items-start  gap-x-3"
            key={data[0].id}
          >
            <Image
              src={data[0].profilePictureUrl}
              alt={data[0].firstName[0].toLocaleUpperCase()}
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
            <div className="flex flex-col grow">
              <div className="flex justify-between pb-2 items-center">
                <div className="flex flex-nowrap ">
                  <span>{data[0].firstName}</span>
                  <span>{data[0].lastName}</span>
                </div>
                <div className=" dark:text-white dark:container-bg-dark container-bg-light    w-full flex justify-end ">
                  <div className="flex items-center gap-x-1 hover:bg-gray-200 dark:hover:bg-black p-1 rounded-md">
                    <TrashIcon size={16} />
                    <button
                      onClick={async () => {
                        try {
                          const decision = await getDecision();
                          const commentId = data[0].commentId;
                          if (!decision || !commentId) return;
                          setOpen(false);
                          const response = await comments.delete(commentId);
                          if (response) {
                            toast.success("Comment deleted successfully");

                            return queryClient.invalidateQueries({
                              queryKey: ["comments", post.postId],
                              exact: true,
                            });
                          }
                          return toast.error("Error deleting Comment");
                        } catch (error) {}
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <p className="grow bg-icon-bg-light dark:bg-icon-bg-dark rounded-lg text-left break-all p-3 hyphens-auto text-ellipsis">
                {data[0].description.length > 70 ? (
                  <ReadMore description={data[0].description} />
                ) : (
                  data[0].description
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full font-medium text-center py-2 px-1">
            <p>Be the first one to comment.</p>
          </div>
        )}

        <div className="flex gap-x-2 pt-4 items-center mt-1">
          <Image
            src={profilePictureUrl}
            alt={fullName[0].toLocaleUpperCase()}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />

          <AutoGrowTextarea
            placeholder={`Comment as ${fullName}`}
            postId={post.postId}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
