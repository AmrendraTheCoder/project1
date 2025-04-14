"use server";

import {
  CHECK_CREDENTIALS_URL,
  FORGET_PASSWORD_URL,
  LOGIN_URL,
  RESET_PASSWORD_URL,
  REGISTER_URL,
} from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";

interface RegisterState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
}

interface LoginState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
  data: {
    email?: string;
    password?: string;
  };
}

interface ForgetPasswordState {
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

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  console.log("🚀 Login server action triggered");

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("📝 Form data received:", { email });

    // Validate input data
    if (!email || !password) {
      console.log("❌ Validation failed: Missing email or password");
      return {
        status: 422,
        message: "Email and password are required",
        errors: {
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
        },
        data: {},
      };
    }

    // Prepare the data for API request
    const data = {
      email,
      password,
    };

    console.log("📡 Using login endpoint:", CHECK_CREDENTIALS_URL);
    console.log(
      "✅ Validation passed, sending data to:",
      CHECK_CREDENTIALS_URL
    );

    // Make the API request
    const response = await axios({
      method: "post",
      url: CHECK_CREDENTIALS_URL,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🎉 Login successful:", response.data);

    // Return success state with user credentials for signIn
    return {
      status: 200,
      message: response.data?.message || "Login successful!",
      errors: {},
      data: {
        email: email,
        password: password,
      },
    };
  } catch (error) {
    console.log("❌ Login error:", error);

    // Handle specific error responses from the API
    if (axios.isAxiosError(error) && error.response) {
      console.log("🔍 Axios error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
        code: error.code,
      });

      // Return validation errors from the API
      if (error.response.status === 422) {
        return {
          status: 422,
          message: error.response.data?.message || "Invalid credentials",
          errors: error.response.data?.errors || {},
          data: {},
        };
      }

      // Return auth failure
      if (error.response.status === 401) {
        return {
          status: 401,
          message: error.response.data?.message || "Authentication failed",
          errors: {},
          data: {},
        };
      }
    }

    // Generic error return
    return {
      status: 500,
      message: "Something went wrong. Please try again later.",
      errors: {},
      data: {},
    };
  }
}

export async function forgetPasswordAction(
  prevState: ForgetPasswordState,
  formData: FormData
): Promise<ForgetPasswordState> {
  console.log("🚀 Forget Password server action triggered");

  try {
    const email = formData.get("email") as string;

    console.log("📝 Form data received:", { email });

    // Validate input data
    if (!email) {
      console.log("❌ Validation failed: Missing email");
      return {
        status: 422,
        message: "Email is required",
        errors: {
          email: !email ? "Email is required" : undefined,
        },
      };
    }

    // Prepare the data for API request
    const data = {
      email,
    };

    console.log("📡 Using Forget Password endpoint:", FORGET_PASSWORD_URL);
    console.log("✅ Validation passed, sending data to:", FORGET_PASSWORD_URL);

    // Make the API request
    const response = await axios({
      method: "post",
      url: FORGET_PASSWORD_URL,
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("🎉 Password reset email sent:", response.data);

    // Return success state
    return {
      status: 200,
      message:
        response.data?.message ||
        "We have emailed you the password reset link!",
      errors: {},
    };
  } catch (error) {
    console.log("❌ Forget Password error:", error);

    // Handle specific error responses from the API
    if (axios.isAxiosError(error) && error.response) {
      console.log("🔍 Axios error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
        code: error.code,
      });

      // Return validation errors from the API
      if (error.response.status === 422) {
        return {
          status: 422,
          message: error.response.data?.message || "Invalid email",
          errors: error.response.data?.errors || {},
        };
      }

      // Return email not found error
      if (error.response.status === 404) {
        return {
          status: 404,
          message: error.response.data?.message || "Email not found",
          errors: {
            email: "No account found with this email address",
          },
        };
      }
    }

    // Generic error return
    return {
      status: 500,
      message: "Something went wrong. Please try again later.",
      errors: {},
    };
  }
}

// Define a more specific interface for reset password state
export interface ResetPasswordState {
  status: number;
  message: string;
  errors: Record<string, string | undefined>;
  success?: boolean;
  redirectTo?: string;
  tokenValid?: boolean;
}

export async function resetPasswordAction(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  // Debug output to server console
  console.log("🚀 Reset Password server action triggered");
  console.log("📡 Using reset password endpoint:", RESET_PASSWORD_URL);

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirm_password") as string;
    const token = formData.get("token") as string;

    console.log("📝 Form data received:", { email });

    // Input validation
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!email?.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!confirm_password) {
      errors.confirm_password = "Confirm password is required";
      isValid = false;
    } else if (password !== confirm_password) {
      errors.confirm_password = "Passwords don't match";
      isValid = false;
    }

    if (!token) {
      errors.token = "Reset token is missing";
      isValid = false;
    }

    if (!isValid) {
      console.log("❌ Validation failed:", errors);
      return {
        status: 422,
        message: "Please correct the validation errors",
        errors,
        success: false,
        tokenValid: !!token,
      };
    }

    console.log("✅ Validation passed, sending data to:", RESET_PASSWORD_URL);

    // Make the API request with detailed configuration
    const response = await axios({
      method: "post",
      url: RESET_PASSWORD_URL,
      data: {
        email,
        password,
        confirm_password,
        token,
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, // For CORS with credentials
      timeout: 10000, // Timeout after 10 seconds
    });

    console.log(
      "🎉 Password reset successful:",
      response.status,
      response.data
    );

    return {
      status: 200,
      message:
        response.data?.message ||
        "Password has been reset successfully. Please login now.",
      errors: {},
      success: true,
      redirectTo: "/login",
      tokenValid: true,
    };
  } catch (error) {
    console.error("❌ Password reset error:", error);

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

      // Handle token validation errors
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        return {
          status: axiosError.response?.status,
          message:
            axiosError.response?.data?.message ||
            "Invalid or expired reset token",
          errors: {
            token:
              "This password reset link is invalid or has expired. Please request a new one.",
          },
          success: false,
          tokenValid: false,
          redirectTo: "/forgot-password",
        };
      }

      // Handle validation errors from the API
      if (axiosError.response?.status === 422) {
        return {
          status: 422,
          message: axiosError.response?.data?.message || "Validation failed",
          errors: axiosError.response?.data?.errors || {},
          success: false,
          tokenValid: true,
        };
      }

      // Handle network-related errors
      if (axiosError.code === "ECONNREFUSED") {
        return {
          status: 500,
          message:
            "Could not connect to the server. Please check if your backend is running.",
          errors: {},
          success: false,
          tokenValid: true,
        };
      }

      if (axiosError.code === "ENOTFOUND") {
        return {
          status: 500,
          message:
            "Server not found. Please check your BACKEND_APP_URL configuration.",
          errors: {},
          success: false,
          tokenValid: true,
        };
      }

      if (axiosError.code === "ETIMEDOUT") {
        return {
          status: 500,
          message:
            "Request timed out. The server might be overloaded or unreachable.",
          errors: {},
          success: false,
          tokenValid: true,
        };
      }
    }

    // Generic error handler
    return {
      status: 500,
      message:
        "Something went wrong with the password reset. Please try again later.",
      errors: {},
      success: false,
      tokenValid: true,
    };
  }
}
