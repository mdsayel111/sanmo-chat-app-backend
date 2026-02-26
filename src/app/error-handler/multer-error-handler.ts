
import { TErrorHandler } from "../interface/error";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const multerErrorHandler: TErrorHandler = (err: any) => {
    // Multer specific errors
    switch (err.code) {
        case "LIMIT_FILE_SIZE":
            return {
                errorMessages: [
                    { path: "", message: "File size exceeds allowed limit." },
                ],
                message: "File too large.",
                redirectPath: "",
                stack: err.stack,
            };

        case "LIMIT_FILE_COUNT":
            return {
                errorMessages: [
                    { path: "", message: "Too many files uploaded." },
                ],
                message: "File upload limit exceeded.",
                redirectPath: "",
                stack: err.stack,
            };

        case "LIMIT_UNEXPECTED_FILE":
            return {
                errorMessages: [
                    { path: "", message: "Unexpected file field." },
                ],
                message: "Invalid file field.",
                redirectPath: "",
                stack: err.stack,
            };

        default:
            return {
                errorMessages: [
                    { path: "", message: err.message },
                ],
                message: "File upload error.",
                redirectPath: "",
                stack: err.stack,
            };
    }
};

export default multerErrorHandler;