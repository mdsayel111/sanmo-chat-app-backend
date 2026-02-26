import z from "zod";

// update validation schema
const updateUserValidationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  address: z.string().max(255).optional(),
  designation: z.string().max(100).optional(),
  image: z.union([z.string().max(255), z.instanceof(File)]).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(11).optional(),
  emergencyContactRelation: z.string().max(100).optional(),
});

const userZodSchemas = {
  updateUserValidationSchema,
};

export default userZodSchemas;
