import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
import { Post } from "@/types";
import { toast } from "sonner";
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken } as {
  accessToken: string;
});
export const getGeocodeSuggestions = async (query: string) => {
  if (!query) return [];
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query,
        autocomplete: true,
        limit: 4,
      })
      .send();
    return response.body.features || [];
  } catch (error) {
    console.error("Error fetching geocode:", error);
    return [];
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeInput(input: string): string {
  return input.trim(); // Remove spaces from the start and end
}

export function truncuateTillKeyword(
  string: string,
  keyword: string
): string | null {
  if (!(string || keyword)) return null;
  const desiredStringLength = string.indexOf(keyword) + keyword.length;
  const desiredString = string.slice(0, desiredStringLength);
  return desiredString;
}

export function sharePost(post: Post) {
  if (navigator.share) {
    navigator
      .share({
        title: `${post.user.firstName} image`,
        url: `${post.pictureLink}`,
        text: `${post.description}`,
      })
      .then(() => console.log("Content shared successfully!"))
      .catch((err) => console.error("Error sharing:", err));
  } else {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(post.pictureLink);
    toast.success("Picture link copied");
  }
}
