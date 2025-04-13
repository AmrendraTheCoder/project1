"use client";

import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { registerAction } from "@/actions/authActions";
import { SubmitButton } from "@/components/common/SubmitBtn";
import { toast, Toaster } from "sonner";

interface RegisterState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
}

function RegisterForm(): React.ReactElement {
  const initState: RegisterState = {
    status: 0,
    message: "",
    errors: {},
  };

  const [state, formAction] = useActionState<RegisterState, FormData>(
    registerAction,
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

  // Log state changes to help with debugging
  useEffect(() => {
    console.log("Form state updated:", state);
  }, [state]);

  const handleSubmit = async (formData: FormData) => {
    // Log form data for debugging
    console.log("Form submitted with data:", {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")?.toString().substring(0, 3) + "...",
      confirm_password:
        formData.get("confirm_password")?.toString().substring(0, 3) + "...",
    });

    // Basic validation
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    const errors: Record<string, string> = {};

    if (!name?.trim()) {
      errors.name = "Name is required";
    }

    if (!email?.trim()) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (!confirm_password) {
      errors.confirm_password = "Confirm password is required";
    } else if (password !== confirm_password) {
      errors.confirm_password = "Passwords don't match";
    }

    // If there are validation errors, return early
    if (Object.keys(errors).length > 0) {
      return {
        status: 422,
        message: "Please fix validation errors",
        errors,
      };
    }

    // Otherwise, use the server action
    try {
      return formAction(formData);
    } catch (error) {
      console.error("Error during form submission:", error);
      return {
        status: 500,
        message: "An unexpected error occurred",
        errors: {},
      };
    }
  };

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

      <form action={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-100">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full p-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />
          {state.errors?.name && (
            <span className="text-sm text-red-300 font-medium">
              {state.errors.name}
            </span>
          )}
        </div>

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

        <div className="space-y-2 mt-4">
          <Label
            htmlFor="confirm_password"
            className="text-sm font-medium text-gray-100"
          >
            Confirm Password
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

export default RegisterForm;
