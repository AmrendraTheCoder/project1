"use client";
import { RumourType } from "@/types";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { getImageURL } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar, Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RumorCardMenu from "./RumorCardMenu";
import Link from "next/link";

export default function RumorCard({
  rumour,
  token,
}: {
  rumour: RumourType;
  token: string;
}) {
  const [liked, setLiked] = React.useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

    return (
    <Card>
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle>{rumour.title}</CardTitle>
        <RumorCardMenu rumour={rumour} token={token} />
      </CardHeader>
      <CardContent className="h-[300px]">
        {rumour?.image && (
          <Image
            src={getImageURL(rumour?.image!)}
            width={500}
            height={500}
            alt={rumour?.title!}
            className="rounded-md w-full h-[220px] object-contain"
          />
        )}
        <p>{rumour?.description}</p>
        <p>
          <strong>Expire At :-</strong>{" "}
          {new Date(rumour?.expire_at!).toDateString()}
        </p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Link href={`/rumour/items/${rumour.id}`}>
          <Button>Items</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}