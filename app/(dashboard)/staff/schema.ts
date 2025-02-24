import { z } from "zod";

export const staffSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  remark: z.string().optional(),
});

export type Staff = z.infer<typeof staffSchema>;
