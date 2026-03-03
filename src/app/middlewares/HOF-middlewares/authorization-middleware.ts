import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../custom-error/app-error";
import { TRole } from "../../modules/user/user-interfaces";
import { getDecodedData } from "../../../lib/jwt";
import { Socket } from "socket.io";

// creat authorization HOF
export const authorizeApiMiddleware = (...role: TRole[]) => {
  // creat authorize middleware
  const authorizeMiddleware: RequestHandler = async (req, res, next) => {
    try {
      const { authorization: tokenFromHeader } = req.headers;
      // if token didn't send in req headers
      if (!tokenFromHeader) {
        throw new AppError(401, "You have no access to this route");
      }

      // get decoded data
      const decoded = await getDecodedData(tokenFromHeader as string);

      // if decoded is null or decoded.role not include in the role param array throw error
      if (!decoded || !role.includes((decoded as JwtPayload).role)) {
        throw new AppError(401, "You have no access to this route");
      }
      // put the decoded data to req.user
      req.user = decoded;

      // if user is authorize
      next();
    } catch (error) {
      // if any error occur
      next(error);
    }
  };

  // return validationHandler to use it as a middleware, and wrap it to catchAsync for catch async error
  return authorizeMiddleware;
};

export const authorizeSocketMiddleware =
  (...roles: TRole[]) =>
    async (socket: Socket, next: (err?: Error) => void) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) {
          return next(new Error("Authentication required"));
        }

        // 🔥 reuse same API logic
        const decoded = await getDecodedData(token);

        if (!decoded || !roles.includes((decoded as JwtPayload).role)) {
          return next(new Error("You have no access to this socket"));
        }

        // attach to socket
        socket.user = decoded;

        next();
      } catch (error) {
        console.log(error)
        next(new Error("Invalid or expired token"));
      }
    };
