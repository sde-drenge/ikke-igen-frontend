import { z } from "zod/v3";

export const emailSchema = () => z.string().email({ message: "Invalid email" });

export const passwordSchema = () =>
  z
    .string()
    .min(8, { message: "Password må være minst 8 tegn" })
    .max(100, { message: "Password må ikke overstige 100 tegn" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
      message:
        "Password skal indeholde mindst et stort bogstav, et lille bogstav og et tal",
    });

export const postalCodeSchema = z
  .string()
  .regex(/^\d{5}(-\d{4})?$/, { message: "Ugyldig postnummer" });

export const usernameSchema = z
  .string()
  .min(3, { message: "Brugernavn må være minst 3 tegn" })
  .max(20, { message: "Brugernavn må ikke overstige 20 tegn" })
  .regex(/^[\dA-Za-z]+$/, { message: "Brugernavn er invalid" });

export const telSchema = z
  .string()
  .length(8, { message: "Telefonnummeret skal være præcist 8 cifre" })
  .regex(/^\d{8}$/, { message: "Telefonnummeret må kun indeholde cifre" })
  .refine(
    (value) => {
      const firstChar = value[0];
      return [...value].some((char) => char !== firstChar);
    },
    {
      message: "Telefonnummeret må ikke bestå af kun ét gentaget ciffer",
    }
  );

export const objectIdSchema = z.string().regex(/^[a-f0-9]{32}$/, "Invalid id");

export const vatNoSchema = z
  .string()
  .min(1, "Påkrævet")
  .refine((val) => /^[A-Za-z]+/.test(val), {
    message: "Mangler landekode",
  })
  .refine((val) => /[0-9]+$/.test(val), {
    message: "Mangler momsnummer",
  });

function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function isBlob(value: unknown): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

function isUint8Array(value: unknown): value is Uint8Array {
  return typeof Uint8Array !== "undefined" && value instanceof Uint8Array;
}

function hasNumericSize(value: unknown): value is { size: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "size" in value &&
    typeof (value as { size?: unknown }).size === "number"
  );
}

function isBlobPreviewUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("blob:");
}

export const blobSchema = (required = true) =>
  z.unknown().refine((val) => {
    if (!val) {
      return !required;
    }

    if (isBlobPreviewUrl(val)) {
      return true;
    }

    if (isFile(val)) {
      return val.size > 0;
    }

    if (isBlob(val)) {
      return val.size > 0;
    }

    if (isUint8Array(val)) {
      return val.byteLength > 0;
    }

    if (hasNumericSize(val)) {
      return val.size > 0;
    }

    return false;
  }, "Ugyldig billede");

export const typeSchemas = {
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  calender: z.date(),
  url: z.string().url("Invalid URL"),
  text: z.string(),
  number: z.coerce.number(),
  checkbox: z.boolean(),
  select: z.string(),
  selectWithLogo: z.string(),
  radio: z.string(),
  textarea: z.string(),
  date: z.date(),
  time: z.string(),
  datetime: z.date(),
  file: z.string(),
  image: z.string(),
  video: z.string(),
  audio: z.string(),
  tel: telSchema,
};
