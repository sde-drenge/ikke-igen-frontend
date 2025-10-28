import { safeGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import ActionButton from "./components/action-button";

export default async function page() {
  const { data } = await safeGet<ReviewPagination>(
    "/workplaces/unverified-reviews/"
  );

  if (!data) {
    return null;
  }

  const starColors = (stars: number): string => {
    if (stars >= 4) {
      return "bg-green-400";
    }

    if (stars >= 3) {
      return "bg-yellow-400";
    }

    if (stars >= 2) {
      return "bg-orange-400";
    }

    return "bg-red-400";
  };

  return (
    <div className="max-w-6xl mx-auto py-10 grid grid-cols-4 gap-4">
      {data.results.map((review) => (
        <div
          key={review.uuid}
          className="p-4 border rounded-2xl col-span-1 flex flex-col"
        >
          <div className="flex flex-col gap-1">
            <span className="font-semibold">
              {review.author.firstName + " " + review.author.lastName}
            </span>

            <span className="text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("da-DK", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex gap-x-0.5 mt-4">
            {Array.from({ length: 5 }).map((_, index) => {
              const color = starColors(Number(review.stars));

              return (
                <div
                  key={index}
                  className={cn(
                    "size-4 flex items-center justify-center",
                    index + 1 <= Number(review.stars) ? color : "bg-gray-300"
                  )}
                >
                  <StarIcon color="white" fill="white" className="size-3" />
                </div>
              );
            })}
          </div>

          <h3 className="mt-3 font-medium">{review.title}</h3>

          <p className="mt-4 max-h-38 overflow-hidden mb-6">{review.comment}</p>

          <ActionButton reviewUuid={review.uuid} />
        </div>
      ))}
    </div>
  );
}
