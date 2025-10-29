import { safeGet } from "@/lib/api";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import ActionButton from "./components/action-button";
import TriggerFlash from "@/components/trigger-flash";
import { starColors } from "@/utils/stars";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

export default async function page() {
  const { data } = await safeGet<ReviewPagination>(
    "/workplaces/unverified-reviews/"
  );

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Verificer anmeldelser
        </h1>

        {data.results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.results.map((review) => (
              <div
                key={review.uuid}
                className="p-4 border rounded-2xl col-span-1 flex flex-col"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">
                    {review.author.firstName + " " + review.author.lastName} -{" "}
                    <Link
                      href={ROUTES.REVIEW(review.workplace.uuid)}
                      className="text-muted-foreground text-sm underline"
                    >
                      {review.workplace.name}
                    </Link>
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
                    const { star: color } = starColors(Number(review.stars));

                    return (
                      <div
                        key={index}
                        className={cn(
                          "size-4 flex items-center justify-center",
                          index + 1 <= Number(review.stars)
                            ? color
                            : "bg-gray-300"
                        )}
                      >
                        <StarIcon
                          color="white"
                          fill="white"
                          className="size-3"
                        />
                      </div>
                    );
                  })}
                </div>

                <h3 className="mt-3 font-medium">{review.title}</h3>

                <p className="mt-4 max-h-38 overflow-hidden mb-6 text-sm">
                  {review.comment}
                </p>

                <ActionButton reviewUuid={review.uuid} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Ingen anmeldelser at verificere.
          </p>
        )}
      </div>

      <TriggerFlash />
    </>
  );
}
