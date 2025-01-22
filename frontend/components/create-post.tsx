"use client";
import React from "react";
import CreatePostDialog from "./create-post-dialog";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
const CreatePost = () => {
  const { data } = useSession();
  if (!data)
    return (
      <div className="w-full flex items-center justify-center pt-3">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  return (
    <section className="border-light rounded-md mt-6 mb-6 border-dark dark:container-bg-dark container-bg-light flex flex-col p-2 ">
      <div className="flex gap-x-2 p-2.5  ">
        <Image
          src={data?.user.image as string}
          //@ts-ignore
          alt={`${data?.user.name[0].toLocaleUpperCase()}  `}
          width={40}
          height={40}
          className="rounded-full flex items-center justify-center"
          priority
        />
        <CreatePostDialog data={data} />
      </div>
    </section>
  );
};

export default CreatePost;
