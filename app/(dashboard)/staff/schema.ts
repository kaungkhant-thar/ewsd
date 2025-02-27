import { z } from "zod";

export const staffSchema = z.object({
  id: z.number().optional(),
  userName: z.string().min(1, "Username is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  email: z.string().email("Invalid email address"),
  phoneNo: z.string().min(1, "Phone number is required"),
  roleId: z.number().min(1, "Role is required"),
  departmentId: z.number().min(1, "Department is required"),
  remark: z.string().nullable(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
