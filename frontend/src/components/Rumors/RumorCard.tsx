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
    <Card className="overflow-hidden border border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 bg-slate-900/60 backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg"></div>

      <CardHeader className="pb-2 pt-4 px-4 relative">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-purple-500/20">
              <AvatarImage src={rumour.user?.image || ""} alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">
                {rumour.user?.name?.charAt(0) || "R"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">
                {rumour.user?.name || "Anonymous"}
              </p>
              <p className="text-xs text-slate-400">
                {rumour.created_at && formatDate(rumour.created_at)}
              </p>
            </div>
          </div>
          <RumorCardMenu rumour={rumour} token={token} />
        </div>
        <CardTitle className="text-xl font-bold text-white">
          {rumour.title}
        </CardTitle>
        <div className="flex gap-2 mt-1">
          <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 border-0">
            Rumor
          </Badge>
          {rumour.tags?.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-slate-800/60 border-slate-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2 relative">
        {rumour?.image && (
          <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-0 group-hover:opacity-30 transition-opacity z-10"></div>
            <Image
              src={getImageURL(rumour.image)}
              fill
              alt={rumour.title || "Rumor image"}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <p className="text-slate-300 mb-4 line-clamp-3">{rumour.description}</p>

        <div className="flex items-center text-xs text-slate-400 gap-1 mt-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Expires: {rumour.expire_at && formatDate(rumour.expire_at)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-800 px-4 py-3 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className={`text-slate-300 hover:text-white hover:bg-slate-800 ${
              liked ? "text-pink-500 hover:text-pink-400" : ""
            }`}
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-pink-500" : ""}`} />
            <span>Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Comment</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
