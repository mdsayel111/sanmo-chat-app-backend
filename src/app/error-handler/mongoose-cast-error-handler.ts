import mongoose from "mongoose";
import { TErrorHandler } from "../interface/error";

// creat mongoose cast error handler
const mongooseCastErrorHandler: TErrorHandler = (
  err: mongoose.Error.CastError,
) => {
  // return errObj
  return {
    errorMessages: [{ path: "", message: "Invalid Id" }],
    message: "Invalid Id",
    stack: err.stack,
  };
};

export default mongooseCastErrorHandler;
