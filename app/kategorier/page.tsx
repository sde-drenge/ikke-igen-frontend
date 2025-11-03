import { safeGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function page() {
  const { data } = await safeGet<TopCategory[]>("/workplaces/categories/");

  if (!data) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto py-14 px-6">
      <h1 className="text-3xl font-bold mb-10">
        Udforsk lærepladser ud fra kategorier
      </h1>

      <div className="columns-4 gap-x-4">
        {data.map((topCategory) => (
          <div
            key={topCategory.uuid}
            className="mb-4 rounded-md overflow-hidden border break-inside-avoid"
          >
            <div
              style={{ backgroundColor: topCategory.color + "66" }}
              className="px-4 py-6 text-center font-medium"
            >
              {topCategory.name}
            </div>

            <div className="p-6 flex flex-col">
              {topCategory.categories.map((category) => (
                <Link
                  key={category.uuid}
                  href={ROUTES.SPECIFIC_CATEGORY(category.uuid)}
                  className="py-3 text-sm first:pt-0 hover:text-primary hover:underline last:pb-2 not-first:border-t"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
