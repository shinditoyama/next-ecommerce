import { client } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  const query = `*[_type == "product" && slug.current == $slug][0]{
    ...,
    category->{title},
    genres[]->{title}
  }`;

  const product = await client.fetch(query, { slug });
  res.status(200).json({ product });
}
