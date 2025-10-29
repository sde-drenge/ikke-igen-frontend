import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyIcon } from "lucide-react";

interface UuidProps {
  uuid: string;
  visableCharacters?: number;
}

export function Uuid({ uuid, visableCharacters }: UuidProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(uuid);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex items-center">
      <Tooltip open={isCopied} delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            role="button"
            variant={"link"}
            className="text-foreground gap-0 p-2 hover:no-underline"
          >
            <span>
              {visableCharacters
                ? uuid.slice(0, visableCharacters) + "..."
                : uuid}
            </span>

            <CopyIcon className="text-foreground/60 ml-2 size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          className="bg-background pointer-events-none border"
        >
          <p className="text-foreground text-sm">Kopieret!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
