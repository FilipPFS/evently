import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { fetchCategories } from "@/lib/actions/category.action";
import { fetchAllEvents } from "@/lib/actions/event.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { IEvent } from "@/lib/database/models/event.model";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams.page) || 1;
  const searchText = (searchParams.query as string) || "";
  const category = (searchParams.category as string) || "";

  const allEvents = await fetchAllEvents({
    query: searchText,
    category,
    limit: 6,
    page,
  });

  if (!allEvents) {
    return <div>Loading...</div>;
  }

  const categories: ICategory[] = await fetchCategories();

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Host, Connect, Celebrate. Your Events, Our Platform!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Book and learn helpful tips from 3,168+ mentors in world-class
              companies with our global community.
            </p>
            <Button size={"lg"} className="button w-full sm:w-fit">
              <Link href={"#events"}>Explore now</Link>
            </Button>
          </div>

          <Image
            src={"/assets/images/hero.png"}
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-w-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by <br /> Thousands of events
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Search placeholder="Search fon an event..." />
          <CategoryFilter categories={categories} />
        </div>

        <Collection
          data={allEvents?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Comeback later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={allEvents.totalPages}
        />
      </section>
    </>
  );
}
