"use client";

import { Button } from "@/components/ui/button";
import { reviewAction } from "../actions";
import { toast } from "sonner";

interface ActionButtonProps {
  reviewUuid: string;
}

export default function ActionButton({ reviewUuid }: ActionButtonProps) {
  const handleReview = async (verify: boolean) => {
    await reviewAction({ reviewUuid, verify });

    if (verify) {
      toast.success("Anmeldelse er blevet verificeret!");
    } else {
      toast.success("Anmeldelse er blevet afvist!");
    }
  };

  return (
    <div className="flex items-center gap-x-2 mt-auto">
      <Button
        variant="outline"
        onClick={() => handleReview(false)}
        className="rounded-full mt-auto cursor-pointer w-fit"
      >
        Afvis
      </Button>

      <Button
        onClick={() => handleReview(true)}
        className="rounded-full mt-auto cursor-pointer w-fit"
      >
        Verificer
      </Button>
    </div>
  );
}
