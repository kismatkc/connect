import Image from "next/image";
import { useTheme } from "next-themes";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ThemeToggleButton from "./theme-toggler-button";
import FacebookMessengerIcon from "@/public/header/facebook-messeneger";
const SearchBar = () => {
  const { theme } = useTheme();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [typing, setTyping] = useState(false);
  const searchBar = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showSearchBar) {
      searchBar.current?.focus();
    }
  }, [showSearchBar]);

  if (showSearchBar)
    return (
      <div className="flex gap-x-5 grow justify-start items-center">
        <ArrowLeft
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={() => {
            setShowSearchBar(false);
          }}
        />
        <div className="flex relative -ml-3 cursor-pointer">
          <Search
            stroke="gray"
            width={18}
            height={18}
            className={`absolute top-[23%] left-3 z-50 ${
              typing && "!invisible"
            }`}
          />
          <input
            className="border grow rounded-3xl py-1.5 text-center focus:outline-none "
            placeholder="Search Connect"
            ref={searchBar}
            onInput={() => {
              setTyping(true);
            }}
          />
        </div>
      </div>
    );
  return (
    <div className="flex grow justify-between ">
      <div className="flex gap-x-5 items-center">
        <Image
          className="size-[30px] scale-125"
          src={
            theme === "light"
              ? "/header/connect-logo-lighttheme.png"
              : "/header/connect-logo-darktheme.png"
          }
          alt="connect logo"
          width={30}
          height={30}
          priority
        />
        <button
          className="rounded-full bg-icon-bg-light pl-2.5 dark:bg-icon-bg-dark size-10 cursor-pointer"
          onClick={() => setShowSearchBar(true)}
        >
          <Search stroke="gray" width={20} height={20} />
        </button>
      </div>
      <div className="flex gap-x-2">
        <ThemeToggleButton />
        <button className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark size-10 pb-1 pl-[2.5px] ">
          <FacebookMessengerIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
