"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

type Props = {
  page: number | string;
  urlParamName?: string;
  totalPages: number;
};

const Pagination = ({ page, urlParamName, totalPages }: Props) => {
  console.log("TOTAL PAGES", totalPages);

  const searchParams = useSearchParams();
  const router = useRouter();

  const onClick = (btnType: string) => {
    const pageValue = btnType === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageValue.toString(),
    });

    router.push(newUrl, { scroll: false });
  };
  return (
    <div className="flex gap-2">
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-28"
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size={"lg"}
        variant={"outline"}
        className="w-28"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
