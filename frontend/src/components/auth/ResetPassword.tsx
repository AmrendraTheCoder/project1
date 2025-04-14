"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { resetPasswordAction, ResetPasswordState } from "@/actions/authActions";
import { SubmitButton } from "@/components/common/SubmitBtn";
import { toast, Toaster } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

interface ResetPasswordFormProps {
  onSuccess?: (email: string | null) => void;
}

function ResetPasswordForm({
  onSuccess,
}: ResetPasswordFormProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Initialize state with proper typing
  const initState: ResetPasswordState = {
    status: 0,
    message: "",
    errors: {},
    success: false,
    tokenValid: true,
  };

  const [state, formAction] = useActionState(resetPasswordAction, initState);

  // Handle redirect after successful password reset
  useEffect(() => {
    if (state.success && state.redirectTo) {
      // Call onSuccess if provided
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(email);
      }

      const redirectTimer = setTimeout(() => {
        router.push(state.redirectTo as string);
      }, 2000); // Give user time to see success message

      return () => clearTimeout(redirectTimer);
    }
  }, [state.success, state.redirectTo, router, onSuccess, email]);

  // Handle token validation errors
  useEffect(() => {
    if (state.tokenValid === false && state.redirectTo) {
      toast.error(state.message);
      const redirectTimer = setTimeout(() => {
        router.push(state.redirectTo as string);
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [state.tokenValid, state.redirectTo, state.message, router]);

  // Handle toast notifications
  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      setTimeout(() => {
        router.replace("/login")
      })
    } else if (state.status === 422) {
      toast.error("Please fix validation errors");
    }
  }, [state.status, state.message]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      toast.error(
        "Missing reset token. Please request a new password reset link."
      );
      router.push("/forgot-password");
    }
  }, [token, router]);

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

      <form action={formAction}>
        <input type="hidden" name="token" value={token || ""} />

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
            readOnly
            value={email || ""}
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
            New Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
            minLength={8}
          />
          {state.errors?.password && (
            <span className="text-sm text-red-300 font-medium">
              {state.errors.password}
            </span>
          )}
          <p className="text-xs text-gray-400">
            Password must be at least 8 characters
          </p>
        </div>

        <div className="space-y-2 mt-4">
          <Label
            htmlFor="confirm_password"
            className="text-sm font-medium text-gray-100"
          >
            Confirm New Password
          </Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />
          {state.errors?.confirm_password && (
            <span className="text-sm text-red-300 font-medium">
              {state.errors.confirm_password}
            </span>
          )}
        </div>

        <div className="pt-4 mt-4">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}

export default ResetPasswordForm;
