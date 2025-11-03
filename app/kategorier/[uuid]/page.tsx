import { Separator } from "@/components/ui/separator";
import { safeGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { starColors } from "@/utils/stars";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default async function page({ params }: PageProps) {
  const { uuid } = await params;

  const [{ data }, { data: categoryData }] = await Promise.all([
    safeGet<WorkplacePagination>(`/workplaces/find/?categoryUuid=${uuid}`),
    safeGet<Category & { topCategory: Omit<TopCategory, "categories"> }>(
      `/workplaces/categories/${uuid}/`
    ),
  ]);

  if (!data || !categoryData) {
    return notFound();
  }

  const workplaces = data.results;

  return (
    <div className="max-w-7xl mx-auto py-14 px-6">
      <h1 className="text-3xl font-bold mb-8">{categoryData.name}</h1>

      <Separator className="absolute w-full left-0" />

      <h2 className="text-sm font-medium pt-6">Lærepladser ({data.count})</h2>

      <div className="w-2/3 mt-2">
        {workplaces.map((workplace) => {
          const colors = starColors(Number(workplace.stars));

          return (
            <Link
              key={workplace.uuid}
              href={ROUTES.REVIEW(workplace.uuid)}
              className="py-6 flex items-center justify-between not-first:border-t"
            >
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-lg font-bold">{workplace.name}</h4>

                <div className="text-sm text-muted-foreground truncate">
                  <span className="font-medium">{workplace.address}</span>

                  {workplace.amountOfReviews ? (
                    <>
                      <span className="mx-2">•</span>
                      <span>{workplace.amountOfReviews} anmeldelser</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "p-1 gap-1 flex rounded-sm items-center",
                  colors.background
                )}
              >
                <div
                  className={cn(
                    "size-4 flex items-center justify-center",
                    colors.star
                  )}
                >
                  <StarIcon color="white" fill="white" className="size-3" />
                </div>

                <h4 className="text-sm font-medium">{workplace.stars}</h4>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
