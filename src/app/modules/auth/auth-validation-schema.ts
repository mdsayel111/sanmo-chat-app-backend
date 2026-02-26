import z from "zod";

// const signupValidationSchema = z
//   .object({
//     name: z.string({ required_error: "Name is required !" }).min(1).max(100),
//     phone: z.string({ required_error: "Phone number must be exactly 11 digits" })
//       .length(11, "Phone number must be exactly 11 digits"),
//     address: z.string({ required_error: "Address is required !" }).min(5).max(255),
//     otp: z.string({ required_error: "OTP is required !" }).min(6).max(6),
//   });

// login validation schema
const loginValidationSchema = z.object({
  phone: z.string({ required_error: "Phone is required !" }).min(11).max(11),
  otp: z.string({ required_error: "OTP is required !" }).min(6).max(6),
});

// signup validation schema
const getOTPValidationSchema = loginValidationSchema.pick({ phone: true });

const authZodSchemas = {
  // signupValidationSchema,
  loginValidationSchema,
  getOTPValidationSchema,
};

export default authZodSchemas;
