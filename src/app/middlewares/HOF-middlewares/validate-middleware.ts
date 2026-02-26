/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import { AnyZodObject, ZodEffects } from "zod";
import catchAsync from "./catch-async-middleware";

// HOF for validate req.body by zod schema
const validateRequestBody = (
  schema: AnyZodObject | ZodEffects<any, any, any>,
) => {
  // creat a middleware for validate function
  const validationHandler: RequestHandler = catchAsync(
    async (req, res, next) => {
      // parse data by zod schema
      const parseData = await schema.parseAsync(req.body);

      // set parse data to req.body
      req.body = parseData;

      next();
    },
  );

  // return validationHandler to use it as a middleware, and wrap it to catchAsync for catch async error
  return catchAsync(validationHandler);
};

export default validateRequestBody;
