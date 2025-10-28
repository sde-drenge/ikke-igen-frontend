"use client";

import React, { useContext } from "react";

import { Button as ButtonUi } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { m } from "framer-motion";

import { FormContext } from "./form";
import { Spinner } from "@/components/ui/spinner";

const Motion = m.create(ButtonUi);

interface ButtonProperties {
  text: string | React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProperties> = ({
  text = "Submit",
  className,
}) => {
  const { isSubmitting } = useContext(FormContext) || {};

  if (isSubmitting === undefined) {
    console.error("DynamicButton must be used within a FormContext.Provider");
    return;
  }

  return (
    <Motion
      type="submit"
      whileTap={{ scale: 0.95 }}
      disabled={isSubmitting}
      style={{
        opacity: isSubmitting ? "0.5" : "1",
      }}
      className={cn("gap-1.5 cursor-pointer", className)}
    >
      {isSubmitting && <Spinner />}

      {text}
    </Motion>
  );
};
