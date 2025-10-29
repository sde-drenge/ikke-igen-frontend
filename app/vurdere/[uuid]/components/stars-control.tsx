"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { starColors } from "@/utils/stars";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function StarsControl() {
  const { setValue } = useFormContext();

  const [selectedStars, setSelectedStars] = useState<number>(0);
  const [hoveredStars, setHoveredStars] = useState<number>(0);

  const handleSelectStars = (stars: number) => {
    setSelectedStars(stars);
    setValue("stars", stars);
  };

  return (
    <div onMouseLeave={() => setHoveredStars(0)} className="gap-1 flex">
      {Array.from({ length: 5 }).map((_, index) => {
        const { star: color } =
          (hoveredStars || selectedStars) > index
            ? starColors(hoveredStars || selectedStars)
            : { star: "" };

        return (
          <Button
            key={index}
            type="button"
            onClick={() => handleSelectStars(index + 1)}
            onMouseEnter={() => setHoveredStars(index + 1)}
            className={cn(
              "size-7 rounded-none bg-gray-300 cursor-pointer",
              color
            )}
          >
            <StarIcon color="white" fill="white" className="size-4.5" />
          </Button>
        );
      })}
    </div>
  );
}
