"use client";

import React, { useCallback } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";

import {
  ControlProperties,
  FieldType,
  InjectedFieldProps,
} from "./types/control";

export function Control<
  P extends object = React.InputHTMLAttributes<HTMLInputElement>
>(properties: ControlProperties<P>) {
  const {
    group,
    name,
    type,
    input: InputComponent,
    label,
    description = "",
    required = false,
    placeholder = "",
    wrapperClassName,
    labelClassName,
    defaultValue = "",
    ...rest
  } = properties;

  const { control, formState } = useFormContext();
  const { errors } = formState;

  const fieldName = group ? `${group}.${name}` : name;

  const effectiveType = (type ?? (InputComponent ? undefined : "text")) as
    | typeof type
    | undefined;

  const renderInput = useCallback(
    (field: FieldType) => {
      if (InputComponent) {
        const inputProps = rest as Omit<P, keyof InjectedFieldProps>;
        const Injected = InputComponent as React.ComponentType<
          Omit<P, keyof InjectedFieldProps> & InjectedFieldProps
        >;

        return (
          <Injected
            {...inputProps}
            {...(field as InjectedFieldProps)}
            placeholder={placeholder}
            required={required}
            id={fieldName}
          />
        );
      }

      const t = effectiveType ?? "text";

      return (
        <Input
          {...field}
          type={t}
          placeholder={placeholder}
          value={(field.value as string) ?? ""}
          onChange={field.onChange}
          {...rest}
        />
      );
    },
    [InputComponent, fieldName, placeholder, rest, effectiveType, required]
  );

  return (
    <FormField
      control={control}
      name={fieldName}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem
          className={cn("flex flex-col space-y-0 gap-y-2", wrapperClassName)}
        >
          {label && (
            <FormLabel className={"form-label " + labelClassName}>
              {label}

              {required && (
                <span className="form-required text-destructive">*</span>
              )}
            </FormLabel>
          )}

          <FormControl>{renderInput(field)}</FormControl>

          {description && (
            <FormDescription className="form-description">
              {description}
            </FormDescription>
          )}

          <ErrorMessage
            errors={errors}
            name={fieldName}
            render={({ message }) => (
              <FormMessage className="form-error">{message}</FormMessage>
            )}
          />
        </FormItem>
      )}
    />
  );
}
