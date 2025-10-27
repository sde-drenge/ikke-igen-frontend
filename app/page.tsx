import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-116 border-b bg-accent flex">
      <div className="w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mt-20 px-6">
          Find en læreplads, du kan stole på
        </h1>

        <h2 className="text-2xl font-medium text-center mt-4 px-6">
          Find, læs og skriv anmeldelser
        </h2>

        <div className="px-13.5 mt-10">
          <div className="relative">
            <Input
              placeholder="Søg efter en læreplads"
              className="pl-6 pr-15 h-16 bg-background shadow-lg rounded-4xl md:text-base"
            />
            <Button
              variant="ghost"
              className="absolute cursor-pointer size-11 top-1/2 -translate-y-1/2 right-3 rounded-full bg-secondary/70 hover:bg-secondary/60 text-secondary-foreground!"
            >
              <SearchIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
