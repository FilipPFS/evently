"use server";

import {
  CreateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
} from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { connect } from "http2";
import { revalidatePath } from "next/cache";

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

export const getSingleEvent = async (eventId: string) => {
  try {
    await connectToDatabase();

    const event = await Event.findById(eventId)
      .populate({
        path: "organizer",
        select: "firstName lastName",
      })
      .populate({
        path: "category",
        select: "name", // Only select the name field from the category
      });

    if (!event) {
      throw new Error("No event with this ID was found.");
    }

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
};

export const fetchAllEvents = async ({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) => {
  try {
    await connectToDatabase();

    const conditions = {};

    const eventsQuery = await Event.find(conditions)
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(limit)
      .populate({
        path: "organizer",
        select: "firstName lastName",
      })
      .populate({
        path: "category",
        select: "name",
      });

    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(eventsQuery)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

export const deleteEventById = async ({ eventId, path }: DeleteEventParams) => {
  try {
    await connectToDatabase();

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (deletedEvent) {
      revalidatePath(path);
    }
  } catch (error) {
    handleError(error);
  }
};
