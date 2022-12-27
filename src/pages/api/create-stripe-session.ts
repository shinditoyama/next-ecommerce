import { urlFor } from "@/lib/client";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { items, email } = req.body;

    const transformedItems = items.map((item: Product) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.title,
          images: [urlFor(item.image[0]).url()],
          description: `Jogo - ${item.category.title}`,
        },
        unit_amount: Number(item.price),
      },
      quantity: item.quantity,
    }));

    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        customer_email: email,
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        line_items: transformedItems,
        shipping_address_collection: {
          allowed_countries: ["BR"],
        },
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
