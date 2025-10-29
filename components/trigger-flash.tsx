"use client";

import { useCallback, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { toast } from "sonner";

export default function TriggerFlash() {
  const searchParams = useSearchParams();

  const handleFlash = useCallback(
    (flashType: "error" | "success" | null) => {
      if (!flashType) return;

      const message = searchParams.get(flashType);

      if (message) {
        if (flashType === "error") {
          toast.error(message);
        } else if (flashType === "success") {
          toast.success(message);
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete(flashType);
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}?${params.toString()}`
        ); // useRouter will trigger a re-render, so we use this
      }
    },
    [searchParams]
  );

  useEffect(() => {
    const flashType = searchParams.get("error")
      ? "error"
      : searchParams.get("success")
      ? "success"
      : null;

    handleFlash(flashType);
  }, [searchParams, handleFlash]);

  return null;
}
