import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await axios.post(
    `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/production`,
    {
      mutations: [
        {
          create: {
            _type: "order",
            ...req.body,
          },
        },
      ],
    },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
    }
  );

  res.status(200).json({ data });
}
