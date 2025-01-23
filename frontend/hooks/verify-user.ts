import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { SignInForm } from "@/types/index";
import { Api } from "@/lib/axios-utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const verifyUser = async (input: SignInForm) => {
  try {
    const response = await Api.post("/verify_user", input);
    return response.data;
  } catch (error: unknown) {
    throw new Error("Error verifying credentials");
  }
};

// export default function useVerifyUser() {
//   return useMutation({
//     mutationFn: verifyUser,
//     onSuccess: (user, variables) => {
//       signIn("credentials", {
//         ...user.data,

//         redirect: false,
//       });
//     },

//     onError: () => {
//       toast.error("Error verifying credentials");
//     },
//   });
// }

export default function useVerifyUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyUser,
    onSuccess: async (user, variables) => {
      try {
        const response = await signIn("credentials", {
          ...user.data,
          redirect: false,
        });

        if (response?.ok) {
          router.prefetch("/"); // Prefetch the root route
          router.refresh(); // Ensure state is synchronized
          router.push("/"); // Navigate to root
        } else {
          toast.error("Sign-in failed: " + response?.error);
        }
      } catch (error) {
        console.error("Error during sign-in:", error);
        toast.error("An error occurred during sign-in.");
      }
    },
    onError: () => {
      toast.error("Error verifying credentials");
    },
  });
}
