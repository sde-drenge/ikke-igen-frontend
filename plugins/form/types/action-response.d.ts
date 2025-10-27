interface ActionResponse<TData = unknown> {
  error?: string;
  success?: string;
  status: number;
  validationErrors?: {
    path: string[];
    message: string;
    code: string;
    validation;
  }[];
  redirect?: string;
  data?: TData;
}
