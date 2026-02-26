import mongoose from "mongoose";
import { TErrorHandler } from "../interface/error";

// function for extact the feild name from error message.
function extractFeildName(input: string): string | null {
  const match = input.match(/`([^`]+)`/);
  return match ? match[1] : null;
}

// creat mongose validation error handler
const mongooseValidationErrorHandler: TErrorHandler = (
  err: mongoose.Error.ValidationError,
) => {
  // extact feild name from err.message
  const feildName = extractFeildName(err.message) || "";

  // creat an reasonable message by concate extact feildName and "is required"
  const message = feildName + " is required";

  // return the err obj
  return {
    message,
    errorMessages: [{ path: feildName, message }],
    stack: err.stack,
  };
};

export default mongooseValidationErrorHandler;
