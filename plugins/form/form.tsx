"use client";

import React, { ReactNode, createContext, useMemo, useState } from "react";

import { Form as ShadcnForm } from "@/components/ui/form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z, { ZodTypeAny } from "zod/v3";

import { processAndEncryptFields } from "./crypt/client";
import { SchemaName, schemaMap } from "./schema-registry";
import "./styles.css";

type FactoryOf<Name extends SchemaName> = (typeof schemaMap)[Name];
type SchemaOf<Name extends SchemaName> = FactoryOf<Name> extends ZodTypeAny
  ? FactoryOf<Name>
  : ZodTypeAny;
type ValuesOf<Name extends SchemaName> = z.infer<SchemaOf<Name>>;

type FormValues<Name extends SchemaName> = ValuesOf<Name> &
  Record<string, unknown>;

type EncryptedKeysOf<Name extends SchemaName> = Extract<
  keyof ValuesOf<Name>,
  string
>;

type SubmitValues<
  Name extends SchemaName,
  K extends EncryptedKeysOf<Name> | never = never
> = ValuesOf<Name> &
  (K extends never
    ? { encryptedFields?: string }
    : { encryptedFields: string });

interface FormContextType {
  isSubmitting: boolean;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  triggerSubmit: () => Promise<void>;
}

export const FormContext = createContext<FormContextType | undefined>(
  undefined
);

interface FormProperties {
  "data-testid"?: string;
  children?: ReactNode;
  method?: string;
  action?: string;
  enctype?: string;
  idPrefix?: string;
  redirect?: string;
  style?: React.CSSProperties;
  className?: string;
  multiStep?: boolean;
  defaultStep?: number;
  steps?: React.JSX.Element[];
  autoCloseDialog?: string;
}

export const Form = <
  Name extends SchemaName,
  EncryptedKeys extends EncryptedKeysOf<Name> | never = never,
  Action extends (
    data: SubmitValues<Name, EncryptedKeys>
  ) => Promise<ActionResponse> = (
    data: SubmitValues<Name, EncryptedKeys>
  ) => Promise<ActionResponse>
>({
  "data-testid": dataTestId,
  children,
  onSubmit,
  schemaKey,
  context,
  method = "post",
  action = "",
  enctype = "application/x-www-form-urlencoded",
  idPrefix,
  redirect,
  style,
  className,
  multiStep = false,
  defaultStep = 0,
  steps,
  stepActions = [],
  encryptedFields = [],
  uploadFields = [],
  autoCloseDialog,
}: FormProperties & {
  schemaKey: Name;
  onSubmit?: Action;
  context?: "translations" extends keyof ValuesOf<Name>
    ? Partial<Omit<ValuesOf<Name>, "translations" | "encryptedFields">> & {
        translations: ValuesOf<Name>["translations"];
      }
    : Partial<Omit<ValuesOf<Name>, "encryptedFields">>;
  encryptedFields?: readonly EncryptedKeys[];
  uploadFields?: Array<Extract<keyof ValuesOf<Name>, string>>;
  stepActions?: Action[];
}) => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(defaultStep);

  const factory = schemaMap[schemaKey] as FactoryOf<Name>;

  const schema = useMemo(() => factory, [factory]) as ZodTypeAny;

  const methods = useForm<FormValues<Name>>({
    mode: "onSubmit",
    resolver: zodResolver(schema),
    defaultValues: context as DefaultValues<FormValues<Name>> | undefined,
  });

  const totalSteps = steps?.length || 1;

  const handleFormSubmit: SubmitHandler<FormValues<Name>> = async (data) => {
    try {
      const submitAction = stepActions[currentStep] || onSubmit;
      if (!submitAction) return;

      let processedData: SubmitValues<Name, EncryptedKeys> &
        Record<string, unknown> = {
        ...(data as ValuesOf<Name>),
      } as SubmitValues<Name, EncryptedKeys> & Record<string, unknown>;

      if (uploadFields?.length) {
        for (const fieldName of uploadFields) {
          const fieldValue = data[fieldName as keyof FormValues<Name>];
          if (
            typeof fieldValue === "string" &&
            fieldValue.startsWith("blob:")
          ) {
            const response = await fetch(fieldValue);
            const blob = await response.blob();
            (processedData as Record<string, unknown>)[fieldName] = blob;
          }
        }
      }

      if ((encryptedFields?.length ?? 0) > 0) {
        const keys = [...encryptedFields] as (keyof ValuesOf<Name>)[];

        processedData = (await processAndEncryptFields(
          processedData as ValuesOf<Name>,
          keys
        )) as SubmitValues<Name, EncryptedKeys> & Record<string, unknown>;
      }

      const response: ActionResponse = await submitAction({
        ...context,
        ...processedData,
      });

      if (response.error) {
        if (response.validationErrors) {
          for (const error of response.validationErrors) {
            methods.setError(error.path.join(".") as Path<FormValues<Name>>, {
              type: "server",
              message: error.message,
            });
          }
        }

        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : "Noget gik galt";

        toast.error(errorMessage);
        return;
      }

      if (autoCloseDialog) {
        const closeButton = document.getElementById(
          autoCloseDialog
        ) as HTMLElement;

        if (closeButton) {
          closeButton.click();
        }
      }

      if (response.success) {
        toast.success(response.success);
      }

      const redirectUrl = response.redirect || redirect;

      if (multiStep) {
        if (currentStep < totalSteps - 1) {
          setCurrentStep((previous) => previous + 1);
        }
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      }

      router.refresh();

      if (!context) {
        methods.reset();
      }
    } catch {
      toast.error("Noget gik galt");
    }
  };

  const triggerSubmit = async () => {
    await methods.handleSubmit(handleFormSubmit)();
  };

  return (
    <FormContext.Provider
      value={{
        isSubmitting: methods.formState.isSubmitting,
        currentStep,
        setCurrentStep,
        triggerSubmit,
      }}
    >
      <ShadcnForm {...methods}>
        <form
          data-testid={dataTestId}
          onSubmit={methods.handleSubmit(handleFormSubmit)}
          method={context ? "patch" : method}
          action={action}
          encType={enctype}
          style={style}
          className={`form-wrapper ${className}`}
          id={idPrefix ? `form-${idPrefix}` : undefined}
        >
          {multiStep && steps && steps[currentStep]}

          {children}
        </form>
      </ShadcnForm>
    </FormContext.Provider>
  );
};
