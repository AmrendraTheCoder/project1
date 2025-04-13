"use server";

import { REGISTER_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";

interface RegisterState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
}

export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  // Debug output to server console
  console.log("🚀 Server action triggered");
  console.log("📡 Using registration endpoint:", REGISTER_URL);

  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;

    console.log("📝 Form data received:", { name, email });

    // Input validation
    if (!name || !email || !password || !confirm_password) {
      const errors: Record<string, string> = {};
      if (!name) errors.name = "Name is required";
      if (!email) errors.email = "Email is required";
      if (!password) errors.password = "Password is required";
      if (!confirm_password)
        errors.confirm_password = "Confirm password is required";

      console.log("❌ Validation failed:", errors);
      return {
        status: 422,
        message: "All fields are required",
        errors,
      };
    }

    if (password !== confirm_password) {
      console.log("❌ Passwords don't match");
      return {
        status: 422,
        message: "Passwords do not match",
        errors: {
          confirm_password: "Passwords do not match",
        },
      };
    }

    console.log("✅ Validation passed, sending data to:", REGISTER_URL);

    // Make the API request with detailed configuration
    const response = await axios({
      method: "post",
      url: REGISTER_URL,
      data: {
        name,
        email,
        password,
        confirm_password,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // For CORS with credentials
      withCredentials: true,
      // Timeout after 10 seconds
      timeout: 10000,
    });

    console.log("🎉 Registration successful:", response.status, response.data);

    return {
      status: 200,
      message: response.data?.message || "Account created successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("❌ Registration error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string>;
      }>;

      // Detailed error logging
      console.error("🔍 Axios error details:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        code: axiosError.code,
      });

      if (axiosError.response?.status === 422) {
        return {
          status: 422,
          message: axiosError.response?.data?.message || "Validation failed",
          errors: axiosError.response?.data?.errors || {},
        };
      }

      if (axiosError.code === "ECONNREFUSED") {
        return {
          status: 500,
          message:
            "Could not connect to the server. Please check if your backend is running.",
          errors: {},
        };
      }

      if (axiosError.code === "ENOTFOUND") {
        return {
          status: 500,
          message:
            "Server not found. Please check your BACKEND_APP_URL configuration.",
          errors: {},
        };
      }

      if (axiosError.code === "ETIMEDOUT") {
        return {
          status: 500,
          message:
            "Request timed out. The server might be overloaded or unreachable.",
          errors: {},
        };
      }
    }

    return {
      status: 500,
      message:
        "Something went wrong with the registration. Please try again later.",
      errors: {},
    };
  }
}
