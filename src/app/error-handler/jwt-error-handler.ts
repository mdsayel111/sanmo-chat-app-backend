import { TErrorHandler } from "../interface/error";
import jwt from "jsonwebtoken";

// creat jwt token expire error handler
const jwtErrorHandler: TErrorHandler = (err: jwt.TokenExpiredError) => {
  // return errObj
  return {
    errorMessages: [{ path: "", message: "You have to login!" }],
    message: "You have to login!",
    redirectPath: "/login",
    stack: err.stack,
  };
};

export default jwtErrorHandler;
