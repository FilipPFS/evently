"use server";

import { CreateEventParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Event from "../database/models/event.model";
import { redirect } from "next/navigation";
import User from "../database/models/user.model";

export const createEvent = async ({
  event,
  userId,
  path,
}: CreateEventParams) => {
  try {
    await connectToDatabase();

    console.log("USER ID", userId);

    const organizer = await User.findById(userId);

    console.log("ORGANIZER", organizer);

    if (!organizer) {
      throw new Error("Unathorized.");
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: userId,
    });

    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};
