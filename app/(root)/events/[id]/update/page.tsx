import EventForm from "@/components/shared/EventForm";
import { getSingleEvent } from "@/lib/actions/event.actions";
import { UpdateEventParams } from "@/types";
import { auth } from "@clerk/nextjs/server";

const UpdateEvent = async ({ params: { id } }: { params: { id: string } }) => {
  const { sessionClaims } = auth();

  const event = await getSingleEvent(id);

  const userId = sessionClaims?.userId as string;
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>
      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          type="Update"
          eventId={event._id}
          event={event}
        />
      </div>
    </>
  );
};

export default UpdateEvent;
