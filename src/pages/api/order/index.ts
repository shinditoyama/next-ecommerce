import { client } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id } = req.query;
  const query = `*[_type == "order" && references("${user_id}")] | order(_createdAt desc){
    ...,
  }`;

  const orders = await client.fetch(query);
  res.status(200).json({ orders });
}
