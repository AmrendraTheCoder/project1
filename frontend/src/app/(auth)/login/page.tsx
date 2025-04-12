import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function login() {
  return (
    <div
      className="flex justify-center items-center h-screen"
    >
      <div className="w-[550px] bg-white rounded-2xl shadow-amber-50 py-8 px-10">
        <h1 className="text-6xl text-center font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Rumors
        </h1>
        <div className="mt-6">
          <h1 className="font-bold text-2xl text-center">Log In</h1>
          <p className="text-center">Welcome, back!</p>
          <form action="">
            <div className="mt-4">
              <Label htmlFor="email" className="text-[17px] mb-1">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email.."
              ></Input>
            </div>
            <div className="mt-4">
              <Label htmlFor="password" className="text-[17px] mb-1">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
              ></Input>
            </div>
            <div className="text-right font-medium mt-2">
              <Link href="forget-password">Forget Password?</Link>
            </div>
            <div className="mt-4">
              <Button
                className="w-full cursor-pointer mt-2 bg-gradient-to-br from-pink-400 to-purple-500 text-white font-medium"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </form>
          <div className="text-center my-2">
            <p>
              Don't have an account?{" "}
              <strong>
                <Link href="/register">Register!</Link>
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
