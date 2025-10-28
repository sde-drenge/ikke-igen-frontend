"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

  const starColors = (stars: number): string => {
    if (stars >= 4) {
      return "bg-green-400!";
    }

    if (stars >= 3) {
      return "bg-yellow-400!";
    }

    if (stars >= 2) {
      return "bg-orange-400!";
    }

    return "bg-gray-400!";
  };

  return (
    <div onMouseLeave={() => setHoveredStars(0)} className="gap-1 flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <Button
          key={index}
          type="button"
          onClick={() => handleSelectStars(index + 1)}
          onMouseEnter={() => setHoveredStars(index + 1)}
          className={cn(
            "size-7 rounded-none bg-gray-300 cursor-pointer",
            (hoveredStars || selectedStars) > index &&
              starColors(hoveredStars || selectedStars)
          )}
        >
          <StarIcon color="white" fill="white" className="size-4.5" />
        </Button>
      ))}
    </div>
  );
}
