"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { FieldType } from "../types/control";

interface PhoneControlProps {
  value: FieldType["value"];
  onChange: FieldType["onChange"];
  inputClassName?: string;
}

function PhoneControl({ value, onChange, inputClassName }: PhoneControlProps) {
  return (
    <PhoneInput
      defaultCountry="dk"
      value={(value as string) || ""}
      onChange={onChange}
      inputClassName={cn(
        "bg-transparent! border-input! text-foreground!",
        inputClassName
      )}
      countrySelectorStyleProps={{
        buttonClassName: "bg-transparent! border-input! text-foreground!",
        dropdownStyleProps: {
          listItemClassName:
            "text-foreground! hover:bg-muted! bg-background! [&[aria-selected=true]]:bg-muted!",
          listItemDialCodeClassName: "text-muted-foreground!",
          className: "bg-background!",
        },
      }}
    />
  );
}

const MemorizedPhoneControl = memo(PhoneControl);

export default MemorizedPhoneControl;
