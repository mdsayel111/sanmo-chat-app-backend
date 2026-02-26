import { ZodError } from "zod";
import { TErrorHandler } from "../interface/error";

// zod error handler
const zodErrorHandler: TErrorHandler = (err: ZodError) => {
  // last index of err.errors[0].path array's
  const lastPathIndx = err.errors[0].path.length - 1;

  // return errObj
  return {
    message: err.errors[0].message,
    errorMessages: [
      {
        path: err.errors[0].path[lastPathIndx] as string,
        message: err.errors[0].message,
      },
    ],
    stack: err.stack,
  };
};

export default zodErrorHandler;
