import { RUMOUR_URL } from "@/lib/apiEndPoints";

export async function RumoursFetch(token: string) {
  const res = await fetch(RUMOUR_URL, {
    headers: {
      Authorization: token, // Fixed typo here: "Authorization" instead of "Authorizarion"
    },
    next: {
      revalidate: 60 * 60,
      tags: ["dashboard"],
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const response = await res.json();
  if (response?.data) {
    return response?.data;
  }

  return [];
}
