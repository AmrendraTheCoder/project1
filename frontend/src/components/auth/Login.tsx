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
import { loginAction } from "@/actions/authActions";
import { toast, Toaster } from "sonner";
import { signIn } from "next-auth/react";
import { LoginButton } from "../common/LoginButton";

interface LoginState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
  data: {
    email?: string;
    password?: string;
  };
}

function Login() {
  const initState: LoginState = {
    status: 0,
    message: "",
    errors: {},
    data: {},
  };

  // Add useTransition hook
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState<LoginState, FormData>(
    loginAction,
    initState
  );

  // Show notifications based on state
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      // Use the data from state to sign in
      if (state.data.email && state.data.password) {
        signIn("credentials", {
          email: state.data.email,
          password: state.data.password,
          redirect: true,
          callbackUrl: "/", // Redirect after successful login
        });
      }
    } else if (state.status === 422) {
      toast.error("Please fix validation errors");
    }
  }, [state]);

  // Log state changes to help with debugging
  useEffect(() => {
    console.log("Form state updated:", state);
  }, [state]);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      // Basic validation
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const errors: Record<string, string> = {};

      if (!email?.trim()) {
        errors.email = "Email is required";
      }
      if (!password) {
        errors.password = "Password is required";
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
        <div className="space-y-2 mt-4">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-100"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />
          {state.errors?.password && (
            <span className="text-sm text-red-300 font-medium">
              {state.errors.password}
            </span>
          )}
        </div>
        <div className="text-right font-medium mt-2">
          <Link
            href="/forget-password"
            className="text-pink-400 hover:text-pink-300 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="pt-4 mt-4">
          <LoginButton isPending={isPending} />
        </div>
      </form>
    </>
  );
}

export default Login;
