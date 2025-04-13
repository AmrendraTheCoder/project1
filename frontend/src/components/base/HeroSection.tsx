import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center py-12 px-4">
      {/* Image container with animation */}
      <div className="mb-6 transform transition-all duration-700 hover:scale-105">
        <Image
          src="/banner_img.svg"
          width={600}
          height={600}
          alt="Rumors Banner"
          className="drop-shadow-2xl"
          priority
        />
      </div>

      {/* Text and button container */}
      <div className="flex flex-col justify-center items-center gap-5 text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text tracking-tight">
          Rumors
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 mb-2">
          Ratify them!
        </p>

        <Link href="/login">
          <Button className="mt-4 px-8 py-6 text-lg bg-gradient-to-br from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-medium rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20">
            Login
          </Button>
        </Link>

        {/* Optional: Register link */}
        <p className="mt-4 text-gray-300">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-pink-400 hover:text-pink-300 transition-colors"
          >
            Register now
          </Link>
        </p>
      </div>

      {/* Decorative particles/elements similar to login page */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
    </div>
  );
}

export default HeroSection;
