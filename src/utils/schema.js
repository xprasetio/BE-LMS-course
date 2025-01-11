import { z } from "zod";
export const exampleSchema = z.object({
  name: z.string(),
  age: z.number(),
});

export const signUpSchema = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});
