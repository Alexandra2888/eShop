import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
});
