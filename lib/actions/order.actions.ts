"use server";

import { CheckoutOrderParams, CreateOrderParams } from "@/types";
import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import Stripe from "stripe";
import { metadata } from "@/app/layout";
import { redirect } from "next/navigation";
import Order from "../database/models/order.models";

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const price = order.isFree ? 0 : Number(order.price) * 100;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    throw error;
  }
};

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    if (!order.stripeId) {
      throw new Error("Order not found.");
    }

    const newOrder = await Order.create({
      ...order,
      buyer: order.buyerId,
      event: order.eventId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};
