import { client } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = `*[_type == "product"] | order(_createdAt desc) [0...8]{
    ...,
    category->{title},
    genres[]->{title}
  }`;

  const products = await client.fetch(query);
  res.status(200).json({ products });
}
