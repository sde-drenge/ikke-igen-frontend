'use client';

import { memo } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';

interface OTPControlProps {
  maxLength: number;
  pattern?: string;
  value: string;
  onChange: (value: string) => void;
}

function OTPControl({ maxLength, pattern, value, onChange }: OTPControlProps) {
  const handleChange = (value: string) => {
    onChange(value);
  };

  pattern ??= 'REGEXP_ONLY_DIGITS_AND_CHARS';

  return (
    <InputOTP
      maxLength={maxLength}
      pattern={
        pattern === 'REGEXP_ONLY_DIGITS_AND_CHARS'
          ? REGEXP_ONLY_DIGITS_AND_CHARS
          : pattern
      }
      value={value}
      onChange={handleChange}
    >
      <InputOTPGroup className="w-full">
        {Array.from({ length: maxLength }, (_, index) => (
          <InputOTPSlot
            data-testid="otp-slot"
            key={index}
            index={index}
            className="aspect-square h-auto w-1/6 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

const MemorizedOTPControl = memo(OTPControl);

export default MemorizedOTPControl;