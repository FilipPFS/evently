"use client";

import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";

type Props = {
  event: IEvent;
  isMyEvent: boolean;
  isOrdered?: boolean;
};

const CheckoutButton = ({ event, isMyEvent, isOrdered }: Props) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Sorry, tickets are no longer awailable
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size={"lg"}>
              <Link href={"/sign-in"}>Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            {!isMyEvent && (
              <Checkout event={event} userId={userId} isOrdered={isOrdered} />
            )}
            {isMyEvent && (
              <Button asChild className="button rounded-full" size={"lg"}>
                <Link href={`/orders/?eventId=${event._id}`}>See Orders</Link>
              </Button>
            )}
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
