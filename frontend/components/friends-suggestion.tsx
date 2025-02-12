import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import useGetSearchedFriends from "@/hooks/get-searched-friends";
import Link from "next/link";
const FriendsSuggestion = () => {
  const { data, error, mutate: getFriends } = useGetSearchedFriends();
  const [friends, setFriends] = useState<
    {
      first_name: string;
      last_name: string;
      profile_picture_url: string;
      id: string;
    }[]
  >([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (data) {
      setFriends(data);
    }
  }, [data]);

  useEffect(() => {
    if (!query) {
      return setFriends([]);
    }
    const invokeGetFriends = setTimeout(() => getFriends(query), 400);
    return () => clearTimeout(invokeGetFriends);
  }, [query, getFriends]);
  return (
    <>
      <div className="flex relative pr-1">
        {!query && (
          <Search className="absolute top-1/4 left-2 size-4 md:top-[30%]" />
        )}
        <input
          type="text"
          className="bg-icon-bg-light dark:bg-icon-bg-dark rounded-full text-xs md:text-base pl-7 focus:outline-none focus:shadow-md"
          placeholder="Search friends"
          value={query}
          onChange={(e) => {
            if (e.target.value.startsWith(" ")) return;
            const typedQuery = e.target.value;
            setQuery(typedQuery);
          }}
        />
      </div>
      <div className="absolute  w-full top-full mt-2.5 z-50 container-bg-light dark:container-bg-dark">
        <ul className="flex flex-col">
          {friends.map((user) => (
            <Link
              href={`/${user.id}`}
              key={user.id}
              onClick={() => {
                setQuery("");
                setFriends([]);
              }}
            >
              <li key={user.id} className="flex gap-x-2 p-3">
                <Avatar className="size-8">
                  <AvatarImage src={user.profile_picture_url} />
                </Avatar>
                <div className="flex flex-nowrap gap-x-1">
                  <span>{user.first_name}</span>
                  <span>{user.last_name}</span>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default FriendsSuggestion;
