import z from "zod";

// update validation schema
const updateUserValidationSchema = z.object({
    name: z.string().min(1).max(100),
    address: z.string().max(255),
    designation: z.string().min(1).max(100),
    image: z
        .union([
            z.string().min(1).max(255),
            z.instanceof(File)
        ])
        .optional(),
});





const userZodSchemas = {
    updateUserValidationSchema,
};

export default userZodSchemas;
