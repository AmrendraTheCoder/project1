"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isPending?: boolean;
  text?: string;
}

export function LoginButton({
  isPending = false,
  text = "Login",
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full py-2 bg-pink-600 hover:bg-pink-700 transition-colors rounded-lg font-medium text-white"
      disabled={isPending}
    >
      {isPending ? "Please wait..." : text}
    </Button>
  );
}
