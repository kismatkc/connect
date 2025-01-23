import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { SignInForm } from "@/types/index";
import { Api } from "@/lib/axios-utils";
import { signIn } from "next-auth/react";

const verifyUser = async (input: SignInForm) => {
  try {
    const response = await Api.post("/verify_user", input);
    return response.data;
  } catch (error: unknown) {
    throw new Error("Error verifying credentials");
  }
};

export default function useVerifyUser() {
  return useMutation({
    mutationFn: verifyUser,
    onSuccess: (user, variables) => {
      signIn("credentials", {
        ...user.data,

        redirect: false,
      });
    },

    onError: () => {
      toast.error("Error verifying credentials");
    },
  });
}
