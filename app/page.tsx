import TriggerFlash from "@/components/trigger-flash";
import SearchWorkplace from "./components/search-workplace";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<></>}>
      <div className="min-h-116 border-b bg-accent flex">
        <div className="w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center mt-20 px-6">
            Find en læreplads, du kan stole på
          </h1>

          <h2 className="text-2xl font-medium text-center mt-4 px-6">
            Find, læs og skriv anmeldelser
          </h2>

          <SearchWorkplace />
        </div>
      </div>

      <TriggerFlash />
    </Suspense>
  );
}
