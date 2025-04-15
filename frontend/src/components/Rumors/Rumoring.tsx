"use client";
import { RumourType } from "@/types";
import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { getImageURL } from "@/lib/utils";
import CountUp from "react-countup";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import socket from "@/lib/socket";
import { toast } from "sonner";

export default function Rumoring({ rumour }: { rumour: RumourType }) {
  const [rumourItems, setRumourItems] = useState(rumour.RumourItem);
  const [rumourComments, setRumourComments] = useState(rumour.RumourComment);
  const [comments, setComments] = useState("");
  const [hideVote, setHideVote] = useState(false);

  const handleVote = (id: number) => {
    if (rumourItems && rumourItems.length > 0) {
      setHideVote(true);
      updateCounter(id);
      // socket list
      socket.emit(`rumouring-${rumour.id}`, {
        rumourId: rumour.id,
        rumourItemId: id,
      });
    }
  };

  const updateCounter = (id: number) => {
    if (rumourItems) {
      const items = [...rumourItems];
      const findIndex = rumourItems.findIndex((item) => item.id === id);
      if (findIndex !== -1) {
        items[findIndex].count += 1;
      }
      setRumourItems(items);
    }
  };

  const updateComment = (payload: any) => {
    if (rumourComments && rumourComments.length > 0) {
      setRumourComments([payload, ...rumourComments!]);
    } else {
      setRumourComments([payload]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (comments.length > 2) {
      const payload = {
        id: rumour.id,
        comment: comments,
        created_at: new Date().toDateString(),
      };
      socket.emit(`rumouring_comment-${rumour.id}`, payload);
      updateComment(payload);
      setComments("");
    } else {
      toast.warning("Please type at least 2 words 😊");
    }
  };

  useEffect(() => {
    socket.on(`rumouring-${rumour.id}`, (data) => {
      updateCounter(data?.rumourItemId);
    });
    socket.on(`rumouring_comment-${rumour.id}`, (data) => {
      updateComment(data);
    });
  });

  return (
    <div className="mt-10">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
        {rumourItems &&
          rumourItems.length > 0 &&
          rumourItems.map((item, index) => {
            return (
              <Fragment key={index}>
                {/* First Block */}
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                  <div className="w-full flex justify-center items-center  p-2 h-[300px]">
                    <Image
                      src={getImageURL(item.image)}
                      width={500}
                      height={500}
                      alt="preview-1"
                      className="w-full h-[300px] object-contain rounded-xl"
                    />
                  </div>
                  {hideVote ? (
                    <CountUp
                      start={0}
                      end={item.count}
                      duration={0.5}
                      className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    />
                  ) : (
                    <Button onClick={() => handleVote(item.id)}>
                      <span className="mr-2 text-lg">Vote</span>
                      <ThumbsUp />
                    </Button>
                  )}
                </div>

                {/* VS Block */}
                {index % 2 === 0 && (
                  <div className="flex w-full lg:w-auto justify-center items-center">
                    <h1 className="text-7xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                      VS
                    </h1>
                  </div>
                )}
              </Fragment>
            );
          })}
      </div>

      <form className="mt-4 w-full" onSubmit={handleSubmit}>
        <Textarea
          placeholder="type your suggestions"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <Button className="w-full mt-2">Submit Comment</Button>
      </form>
      {/* Display comments */}
      <div className="mt-4">
        {rumourComments &&
          rumourComments.length > 0 &&
          rumourComments.map((item, index) => (
            <div
              className="w-full md:w-[600px] rounded-lg p-4 bg-muted mb-4"
              key={index}
            >
              <p className="font-bold">{item.comment}</p>
              <p>{new Date(item.create_at).getMinutes()}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
