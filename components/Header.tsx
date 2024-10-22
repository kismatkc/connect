"use client";

import React, { useEffect, useState } from "react";

import { Bell } from "lucide-react";
import SearchBar from "./search-bar";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <header className="flex justify-between bg-container-bg-light dark:bg-container-bg-dark  p-2 border-[1px] border-[rgb(0,0,0,.2)] dark:border-[rgb(255,255,255,.2)] gap-x-2">
      <SearchBar />
      <div className="flex gap-x-2 justify-end items-center ">
        <button className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark size-10 pl-2.5">
          <Bell width={20} height={20} fill="black" />
        </button>
        <button className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark size-10 pl-2.5">
          <Bell width={20} height={20} fill="black" />
        </button>
      </div>
    </header>
  );
};

export default Header;
