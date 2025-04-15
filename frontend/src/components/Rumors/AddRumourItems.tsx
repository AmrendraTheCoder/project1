"use client";
import { Upload } from "lucide-react";
import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { RumourItemForm } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { RUMOUR_ITEMS_URL } from "@/lib/apiEndPoints";

export default function AddRumourItems({
  token,
  rumourId,
}: {
  token: string;
  rumourId: number;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Array<RumourItemForm>>([
    { image: null },
    { image: null },
  ]);
  const [urls, setUrls] = useState<Array<string>>(["", ""]);
  const [errors, setErrors] = useState<Array<string>>([]);
  const imgRef1 = useRef<HTMLInputElement | null>(null);
  const imgRef2 = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedItems = [...items];
      updatedItems[index].image = file;
      setItems(updatedItems);

      const imageUrl = URL.createObjectURL(file);
      const updatedUrls = [...urls];
      updatedUrls[index] = imageUrl;
      setUrls(updatedUrls);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate both images are selected
      if (!items[0].image || !items[1].image) {
        toast.warning("Please upload both images");
        return;
      }

      const formData = new FormData();
      formData.append("id", rumourId.toString());

      // Add both images to form data
      items.forEach((item, index) => {
        if (item.image) {
          formData.append(`images[]`, item.image);
        }
      });

      setLoading(true);

      // Log formData contents for debugging
      console.log("Rumour ID:", rumourId);
      console.log("Images count:", items.filter((item) => item.image).length);

      const response = await axios.post(RUMOUR_ITEMS_URL, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      if (response.data?.message) {
        toast.success("Items added successfully!");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting rumour items:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          setErrors(error.response?.data?.errors || ["Validation error"]);
        } else if (error.response?.status === 404) {
          toast.error(error.response?.data?.message || "Not found");
        } else {
          toast.error(error.response?.data?.message || "Server error");
        }
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      {errors.length > 0 && (
        <div className="bg-red-500 text-white p-3 mb-4 rounded-md">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-x-10 lg:flex-nowrap justify-between items-center">
        {/* First Block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            ref={imgRef1}
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
          />
          <div
            className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px] cursor-pointer"
            onClick={() => imgRef1?.current?.click()}
          >
            {urls[0] ? (
              <Image
                src={urls[0]}
                width={500}
                height={500}
                alt="preview-1"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="text-white flex items-center space-x-2 text-xl">
                <Upload /> <span>Upload File</span>
              </h1>
            )}
          </div>
        </div>
        {/* VS Block */}
        <div className="flex w-full lg:w-auto justify-center items-center">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            VS
          </h1>
        </div>
        {/* Second Block */}
        <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
          <input
            type="file"
            className="hidden"
            ref={imgRef2}
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
          />

          <div
            className="w-full flex justify-center items-center rounded-md border-2 border-dashed p-2 h-[300px] cursor-pointer"
            onClick={() => imgRef2?.current?.click()}
          >
            {urls[1] ? (
              <Image
                src={urls[1]}
                width={500}
                height={500}
                alt="preview-2"
                className="w-full h-[300px] object-contain"
              />
            ) : (
              <h1 className="text-white flex items-center space-x-2 text-xl">
                <Upload /> <span>Upload File</span>
              </h1>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Button
          className="w-52 bg-amber-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
