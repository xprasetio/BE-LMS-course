import { ZodError } from "zod";

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map(
        (err) => `${err.path}: ${err.message}`
      );
      return res.status(500).json({
        error: "Invalid request",
        details: errorMessages,
      });
    }
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
