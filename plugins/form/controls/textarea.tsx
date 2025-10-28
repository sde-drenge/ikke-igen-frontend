"use client";

import { memo } from "react";

import { Textarea } from "@/components/ui/textarea";

import { FieldType } from "../types/control";

interface TextareaControlProps {
  value: FieldType["value"];
  onChange: FieldType["onChange"];
  placeholder?: string;
  className?: string;
}

function TextareaControl({
  value,
  onChange,
  placeholder,
  className,
}: TextareaControlProps) {
  return (
    <Textarea
      value={(value as string) || ""}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

const MemorizedTextareaControl = memo(TextareaControl);

export default MemorizedTextareaControl;
