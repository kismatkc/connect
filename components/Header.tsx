"use client";

import Image from "next/image";
import React from "react";
import ThemeToggleButton from "./theme-toggler-button";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className="flex justify-between p-2">
      <div className="flex">
        <Image
          className="size-[30px]"
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
      </div>
      <div className="flex">
        <ThemeToggleButton />
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-[rgb(228,230,235)] dark:bg-[rgb(255,255,255,.1)] pr-1 pb-1"
        >
          <Image
            src="/header/facebook-messenger.svg"
            alt="messenger icon"
            width={24}
            height={24}
            className="h-8 w-8"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
