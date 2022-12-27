import { client } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session_email } = req.query;
  const query = `*[_type == "user" && email == "${session_email}"][0]{
    _id,
  }`;

  const userId = await client.fetch(query);
  res.status(200).json({ userId });
}
