import { TErrorHandler } from "../interface/error";

// creat mongoose cast error handler
const mongooseDuplicateKeyErrorHandler: TErrorHandler = (err) => {
  // duplicate feild anem
  const dupFeildName = Object.keys(err.keyPattern)[0];

  // creat message
  const message = dupFeildName + " is already exist";

  // return errObj
  return {
    message,
    errorMessages: [{ path: `${dupFeildName}`, message }],
    stack: err.stack,
  };
};

export default mongooseDuplicateKeyErrorHandler;
