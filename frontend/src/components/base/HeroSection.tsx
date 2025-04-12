import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function HeroSection() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div>
        <Image
          src="/banner_img.svg"
          width={600}
          height={600}
          alt="bannerimg"
        ></Image>
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Rumors
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl font-bold">
          Ratify them!
        </p>
        <Link href="/login">
          <Button className="cursor-pointer hover:scale-120 mt-2 bg-gradient-to-br from-pink-400 to-purple-500 text-white font-medium">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
