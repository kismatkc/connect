import { EnumLike } from "zod";
import { create } from "zustand";
interface MobileChatSheetStore {
  openMobileChatSheet: boolean;
  showIndividualChat: boolean;
  lastTab: string | null;
  receiveruser: {
    id: string;
    name: string;
    profilePicture: string;
    status: "online" | "offline";
  } | null;
  botDetails: {
    id: string;
    name: string;
    profilePicture: string;
    status: "online" | "offline";
  };
  setLastTab: (lastTab: string) => void;

  setOpenMobileChatSheet: (value: boolean) => void;
  setShowIndividualChat: (value: boolean) => void;
  setUser: (
    receiveruser: {
      id: string;
      name: string;
      profilePicture: string;
      status: "online" | "offline";
    } | null
  ) => void;
 
}

export const useMobileChatSheetStore = create<MobileChatSheetStore>((set) => ({
  openMobileChatSheet: false,
  showIndividualChat: false,
  receiveruser: null,
  lastTab: null,
  botDetails: {id: "123",name: "Zaden",profilePicture: "/header/zaden.png",status: "online"},
  setUser: (receiveruser) => set(() => ({ receiveruser })),
  setLastTab: (lastTab) => set(() => ({ lastTab })),

  setOpenMobileChatSheet: (value) =>
    set(() => ({ openMobileChatSheet: value })),
  setShowIndividualChat: (value) => set(() => ({ showIndividualChat: value })),
}));
