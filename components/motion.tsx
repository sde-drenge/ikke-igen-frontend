"use client";

import React from "react";

import { MotionProps, m } from "framer-motion";

interface CustomMotionProps
  extends Omit<MotionProps, "style">,
    Omit<
      React.HTMLProps<HTMLDivElement>,
      "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"
    > {
  className?: string;
  children: React.ReactNode;
}

export const Motion = ({
  className,
  children,
  ...props
}: CustomMotionProps) => {
  return (
    <m.div className={className} {...props}>
      {children}
    </m.div>
  );
};
