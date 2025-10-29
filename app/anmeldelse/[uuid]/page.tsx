import { Separator } from "@/components/ui/separator";
import { safeGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { starColors } from "@/utils/stars";
import { ExternalLinkIcon, PenIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function page({ params }: PageProps) {
  const { uuid } = await params;

  const [{ data: workplace }, { data: reviewsData }] = await Promise.all([
    safeGet<Workplace>(`/workplaces/${uuid}/`),
    safeGet<ReviewPagination>(`/workplaces/${uuid}/reviews/`),
  ]);

  if (!workplace) {
    return notFound();
  }

  const reviews = reviewsData ? reviewsData.results : [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div>
        <h1 className="text-3xl font-bold">{workplace.name}</h1>

        <div className="flex items-center">
          <span>Anmeldelser {workplace.amountOfReviews}</span>

          <span className="mx-2">•</span>

          <div className="flex gap-x-0.5">
            {Array.from({ length: 5 }).map((_, index) => {
              const { star: color } = starColors(Number(workplace.stars));

              return (
                <div
                  key={index}
                  className={cn(
                    "size-4 flex items-center justify-center",
                    index + 1 <= Number(workplace.stars) ? color : "bg-gray-300"
                  )}
                >
                  <StarIcon color="white" fill="white" className="size-3" />
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href={ROUTES.EVALUATE(workplace.uuid)}
          className="rounded-full bg-primary text-primary-foreground h-9 px-4 py-2 has-[>svg]:px-3 hover:bg-primary/90 font-bold mt-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
        >
          <PenIcon />
          Skriv en anmeldelse
        </Link>

        {workplace.website && (
          <Link
            href={workplace.website}
            target="_blank"
            className="rounded-full ml-2 border border-primary hover:text-primary-foreground text-primary h-9 px-4 py-2 has-[>svg]:px-3 hover:bg-primary/90 font-bold mt-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
          >
            <ExternalLinkIcon />
            Besøg hjemmeside
          </Link>
        )}

        <Separator className="mt-8" />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">
        {reviews.map((review) => (
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
                const { star: color } = starColors(Number(review.stars));

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

            <p className="mt-4 max-h-38 overflow-hidden mb-6 text-sm">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
