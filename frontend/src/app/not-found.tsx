import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Image src="/404.svg" alt="404 Error" height={500} width={500}></Image>

      <Link href="/">
        <Button className="cursor-pointer hover:scale-120 mt-2 bg-gradient-to-br from-pink-400 to-purple-500 text-white font-medium">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
