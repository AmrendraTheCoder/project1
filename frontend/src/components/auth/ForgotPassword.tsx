"use client";
import React, {
  useActionState,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { forgetPasswordAction } from "@/actions/authActions";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

interface ForgetPasswordState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
}

function ForgetPassword() {
  const initState: ForgetPasswordState = {
    status: 0,
    message: "",
    errors: {},
  };

  // Add useTransition hook
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState<ForgetPasswordState, FormData>(
    forgetPasswordAction,
    initState
  );

  // Show notifications based on state
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
    } else if (state.status === 422) {
      toast.error("Please fix validation errors");
    }
  }, [state]);

  useEffect(() => {
    console.log("Form state updated:", state);
  }, [state]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      // Basic validation
      const email = formData.get("email") as string;
      const errors: Record<string, string> = {};

      if (!email?.trim()) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Please enter a valid email address";
      }

      // If there are validation errors, update state locally
      if (Object.keys(errors).length > 0) {
        toast.error("Please fix validation errors");
        return;
      }

      // If validation passes, call the form action within startTransition
      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction, startTransition]
  );

  return (
    <>
      <Toaster position="top-center" />
      {state.status === 200 && (
        <div className="p-4 mb-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-md text-green-100">
          {state.message}
        </div>
      )}
      {(state.status === 422 || state.status === 500) && state.message && (
        <div className="p-4 mb-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-100">
          {state.message}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}
      >
        <div className="space-y-2 mt-4">
          <Label htmlFor="email" className="text-sm font-medium text-gray-100">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />
          {state.errors?.email && (
            <span className="text-sm text-red-300 font-medium">
              {state.errors.email}
            </span>
          )}
        </div>
        <div className="pt-4 mt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 flex justify-center items-center h-12"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-200">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default ForgetPassword;
