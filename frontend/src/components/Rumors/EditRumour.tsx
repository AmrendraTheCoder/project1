"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Plus, Clock, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RUMOUR_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import { toast } from "sonner";
import { RumourType } from "@/types";
import { clearCache } from "@/actions/CommonActions";

// Define types locally to avoid import issues
type RumourFormType = {
  title?: string;
  description?: string;
};

type RumourFormTypeError = {
  title?: string;
  description?: string;
  expire_at?: string;
  image?: string;
};

type CustomUser = {
  id: string;
  token?: string;
  // Add other user properties as needed
};

function EditRumor({
  token,
  rumour,
  open,
  setOpen,
}: {
  token: string;
  rumour: RumourType;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [rumourData, setRumourData] = useState<RumourFormType>({
    title: rumour?.title,
    description: rumour?.description,
  });
  // Parse the date safely
  const [date, setDate] = React.useState<Date | null>(() => {
    try {
      return rumour?.expire_at ? new Date(rumour.expire_at) : null;
    } catch (e) {
      console.error("Invalid date format:", e);
      return null;
    }
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RumourFormTypeError>({});

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});

    // Client-side validation
    let hasErrors = false;
    const newErrors: RumourFormTypeError = {};

    if (!rumourData.title) {
      newErrors.title = "Title is required";
      hasErrors = true;
    }

    if (!date) {
      newErrors.expire_at = "Expiration date is required";
      hasErrors = true;
    }

    if (!image) {
      newErrors.image = "Image is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", rumourData.title || "");
      formData.append("description", rumourData.description || "");
      formData.append("expire_at", date!.toISOString());
      formData.append("image", image!);

      const response = await axios.put(`${RUMOUR_URL}/${rumour.id}`, formData, {
        headers: {
          Authorization: token,
        },
      });

      setLoading(false);
      if (response.data?.message) {
        clearCache("dashboard");
        setRumourData({});
        setDate(null);
        setImage(null);
        setErrors({});
        toast.success(response.data?.message);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422 && error.response.data?.errors) {
          setErrors(error.response.data.errors);
        } else {
          toast.error(
            error.response?.data?.message ||
              "Something went wrong, please try again!"
          );
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        className="max-w-lg bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-0 shadow-2xl rounded-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Create New Rumour
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Fill in the details below to share your rumour with the world
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="w-1 h-4 bg-purple-500 rounded-full inline-block"></span>
              Title
            </Label>
            <input
              id="title"
              placeholder="Enter an attention-grabbing title..."
              type="text"
              value={rumourData.title || ""}
              onChange={(e) => {
                setRumourData({ ...rumourData, title: e.target.value });
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all duration-200"
            />
            {errors.title && (
              <span className="text-red-500">{errors.title}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="w-1 h-4 bg-blue-500 rounded-full inline-block"></span>
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Spill all the juicy details here..."
              value={rumourData.description || ""}
              onChange={(e) => {
                setRumourData({ ...rumourData, description: e.target.value });
              }}
              className="min-h-32 w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all duration-200 resize-none"
            />
            {errors.description && (
              <span className="text-red-500">{errors.description}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="image"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="w-1 h-4 bg-green-500 rounded-full inline-block"></span>
              Image
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <label
                htmlFor="image"
                className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-10 h-10 mb-3 text-slate-400 group-hover:text-purple-500 transition-colors duration-300" />
                  <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Drop your image here</span>{" "}
                    or click to browse
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                  {image && (
                    <p className="text-sm text-green-500 mt-2">{image.name}</p>
                  )}
                </div>
                <input
                  id="image"
                  placeholder="Enter your title here..."
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              {errors.image && (
                <span className="text-red-500">{errors.image}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="expireAt"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
              Expires On
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full px-4 py-6 justify-start text-left font-normal border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200",
                    !date && "text-slate-500 dark:text-slate-400"
                  )}
                >
                  <Clock className="mr-3 h-5 w-5 text-slate-400" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>When should this rumour expire?</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border-0 shadow-xl rounded-lg"
                align="center"
              >
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(date) => setDate(date)}
                  initialFocus
                  className="rounded-lg border-0 bg-white dark:bg-slate-800 p-3"
                />
              </PopoverContent>
            </Popover>
            {errors.expire_at && (
              <span className="text-red-500">{errors.expire_at}</span>
            )}
          </div>

          <DialogFooter className="pt-6 flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              {loading ? "Spreading..." : "Spread the Rumour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditRumor;
