// components/common/UserAvatar.tsx
"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserAvatar({ name, image }: { name: string; image?: string }) {
  // Get initials from name - take first character if single word,
  // or first character of first and last word if multiple words
  const getInitials = () => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return name.charAt(0);
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`;
  };

  return (
    <Avatar className="border-2 border-purple-500 h-9 w-9">
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback className="bg-slate-800 text-pink-400 font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}

// Set default props
UserAvatar.defaultProps = {
  image: undefined,
};

export default UserAvatar;
