import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

// createToken function
export const createToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, config.secretKey as string, {
    expiresIn: "1d",
  });
  return token;
};

// creat deoded data function
export const getDecodedData = async (tokenFromHeader: string) => {
  // extact token from  Bearer JWT_TOKEN this format
  const extactOrginalToken = tokenFromHeader.split(" ")[1];
  const decoded = jwt.verify(
    extactOrginalToken,
    config.secretKey as string,
  ) as JwtPayload;
  return decoded;
};
