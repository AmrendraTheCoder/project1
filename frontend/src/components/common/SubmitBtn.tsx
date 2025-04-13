"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="mt-4">
      <Button
        disabled={pending}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        type="submit"
      >
        {pending ? "Processing.." : "Submit"}
      </Button>
    </div>
  );
}
