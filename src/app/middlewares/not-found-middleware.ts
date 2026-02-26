import { RequestHandler } from "express";

// not found route middleware
const notFound: RequestHandler = (req, res) => {
  res.status(404).send({
    success: false,
    statusCode: 404,
    message: "Not Found",
  });
};

export default notFound;
