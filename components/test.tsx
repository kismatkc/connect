import Image from "next/image";
import { useTheme } from "next-themes";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ThemeToggleButton from "./theme-toggler-button";
import FacebookMessengerIcon from "@/public/header/facebook-messeneger";
interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch = () => {},
  placeholder = "Search Connect",
}) => {
  const { theme } = useTheme();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchBar = useRef<HTMLInputElement>(null);

  // 2. Debounced search implementation
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  // 3. Keyboard accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSearchBar) {
        setShowSearchBar(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showSearchBar]);

  // 4. Extracted SearchInput component for better organization
  const SearchInput = () => (
    <div className="flex gap-x-5 grow justify-start items-center">
      <button
        onClick={() => setShowSearchBar(false)}
        aria-label="Back"
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <ArrowLeft width={20} height={20} />
      </button>
      <div className="flex relative -ml-3 w-full max-w-md">
        <Search
          stroke="gray"
          width={18}
          height={18}
          className={`absolute top-1/2 -translate-y-1/2 left-3 transition-opacity ${
            searchTerm ? "opacity-0" : "opacity-100"
          }`}
        />
        <input
          className="w-full border rounded-3xl py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          placeholder={placeholder}
          ref={searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search input"
        />
      </div>
    </div>
  );

  // 5. Extracted MainHeader component
  const MainHeader = () => (
    <div className="flex grow justify-between">
      <div className="flex gap-x-5 items-center">
        <Image
          className="size-[30px] scale-125"
          src={`/header/connect-logo-${
            theme === "light" ? "lighttheme" : "darktheme"
          }.png`}
          alt="connect logo"
          width={30}
          height={30}
          priority
        />
        <button
          className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowSearchBar(true)}
          aria-label="Open search"
        >
          <Search stroke="gray" width={20} height={20} />
        </button>
      </div>
      <div className="flex gap-x-2">
        <ThemeToggleButton />
        <button
          className="rounded-full bg-icon-bg-light dark:bg-icon-bg-dark p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open messenger"
        >
          <FacebookMessengerIcon />
        </button>
      </div>
    </div>
  );

  return showSearchBar ? <SearchInput /> : <MainHeader />;
};

export default SearchBar;
