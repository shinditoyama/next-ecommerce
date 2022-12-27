import { client } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = `*[_type == "category"] | order(_createdAt asc){
    _id,
    slug,
    title
  }`;

  const categories = await client.fetch(query);
  res.status(200).json({ categories });
}
