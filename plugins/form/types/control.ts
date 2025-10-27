import { ControllerRenderProps } from "react-hook-form";

export type FieldType = ControllerRenderProps<Record<string, unknown>, string>;

export type InjectedFieldProps = {
  value?: unknown;
  onChange?: (value: unknown) => void;
  name?: string;
  id?: string;
  ref?: React.Ref<unknown>;
};

export type ControlProperties<
  P extends Partial<InjectedFieldProps> &
    object = React.InputHTMLAttributes<HTMLInputElement> &
    Partial<InjectedFieldProps>
> = Omit<P, keyof InjectedFieldProps> & {
  group?: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  input?: React.ComponentType<P>;
  label?: string | React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  wrapperClassName?: React.HTMLAttributes<HTMLDivElement>["className"];
  labelClassName?: React.HTMLAttributes<HTMLLabelElement>["className"];
  disabled?: boolean;
  defaultValue?: P extends { value?: infer V } ? V : unknown;
  tabIndex?: number;
};
