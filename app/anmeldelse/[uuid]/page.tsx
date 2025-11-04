import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { safeGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { auth } from "@/services/auth";
import { starColors } from "@/utils/stars";
import { PenIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ uuid: string }>;
  searchParams: Promise<{
    stars?: string;
  }>;
}

export default async function page({ params, searchParams }: PageProps) {
  const [{ uuid }, awaitedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const stars = awaitedSearchParams.stars;

  const [{ data: workplace }, { data: reviewsData }, session] =
    await Promise.all([
      safeGet<Workplace>(`/workplaces/${uuid}/`),
      safeGet<ReviewPagination>(
        `/workplaces/${uuid}/reviews/?${stars ? `stars=${stars}` : ""}`
      ),
      auth(),
    ]);

  if (!workplace) {
    return notFound();
  }

  const reviews = reviewsData ? reviewsData.results : [];

  const { star: starColor } = starColors(Number(workplace.stars));

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">{workplace.name}</h1>

        <span className="font-medium">{workplace.address}</span>

        <div className="flex items-center mt-1">
          <span className="text-muted-foreground">
            Anmeldelser {workplace.amountOfReviews}
          </span>

          <span className="mx-2 text-muted-foreground">•</span>

          <div className="flex gap-x-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const { star: color } = starColors(Number(workplace.stars));

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor:
                      index + 1 <= Number(workplace.stars) ? color : undefined,
                  }}
                  className="size-4 flex items-center justify-center bg-gray-300"
                >
                  <StarIcon color="white" fill="white" className="size-3" />
                </div>
              );
            })}
          </div>
        </div>

        {session?.user.role === "student" && (
          <Link
            href={ROUTES.EVALUATE(workplace.uuid)}
            className="rounded-full bg-primary text-primary-foreground h-9 px-4 py-2 has-[>svg]:px-3 hover:bg-primary/90 font-bold mt-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
          >
            <PenIcon />
            Skriv en anmeldelse
          </Link>
        )}

        <Separator className="my-6" />
      </div>

      <div className="flex flex-col lg:flex-row gap-14">
        <div className="">
          <span className="text-2xl font-bold flex items-center gap-2">
            <div
              style={{ backgroundColor: starColor }}
              className="size-8 flex items-center justify-center rounded-sm"
            >
              <StarIcon color="white" fill="white" className="size-5" />
            </div>

            {workplace.stars}
          </span>

          <h2 className="text-2xl font-medium my-4">Alle anmeldelser</h2>

          <p className="text-muted-foreground">
            Alle anmeldelser skal godkendes
          </p>

          <div className="border rounded-xl p-4 mt-4 flex flex-col gap-2">
            {Object.entries(workplace.starsProcentages)
              .reverse()
              .map(([star, percentage], index) => (
                <Link
                  key={index}
                  href={
                    ROUTES.REVIEW(workplace.uuid) +
                    (stars === star ? "" : `?stars=${star}`)
                  }
                  className="flex items-center"
                >
                  <Checkbox
                    id={`star-${star}`}
                    checked={stars === star}
                    className="size-6 cursor-pointer"
                  />

                  <Label
                    htmlFor={`star-${star}`}
                    className="ml-2 mr-4 cursor-pointer"
                  >
                    {star} stjerner
                  </Label>

                  <div className="h-3 flex-1 bg-muted rounded-full min-w-36">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="bg-foreground h-full rounded-full"
                    />
                  </div>

                  <span className="ml-4 w-10.5 text-right text-sm">
                    {percentage} %
                  </span>
                </Link>
              ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div
              key={review.uuid}
              className="p-4 border rounded-2xl col-span-1 flex flex-col h-fit"
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
                  const { star: color } = starColors(Number(review.stars));

                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor:
                          index + 1 <= Number(review.stars) ? color : undefined,
                      }}
                      className="size-4 flex bg-gray-300 items-center justify-center"
                    >
                      <StarIcon color="white" fill="white" className="size-3" />
                    </div>
                  );
                })}
              </div>

              <h3 className="mt-3 font-medium">{review.title}</h3>

              <p className="mt-4 max-h-38 overflow-hidden mb-6 text-sm">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
