import AppError from "../custom-error/app-error";
import { TErrorHandler } from "../interface/error";

// creat AppError handler
const appErrorHandler: TErrorHandler = (err: AppError) => {
  // return errObj
  return {
    errorMessages: [{ path: "", message: err.message }],
    message: err.message,
    stack: err.stack || "",
  };
};

export default appErrorHandler;
