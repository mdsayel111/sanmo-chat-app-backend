/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint @typescript-eslint/no-explicit-any: "error" */
export type TErrorObj = {
  statusCode?: number;
  message: string;
  errorMessages: { path: string; message: string }[];
  redirectPath?: string;
  stack: string | undefined;
};

// define error handler type
export type TErrorHandler = (err: any) => TErrorObj;
