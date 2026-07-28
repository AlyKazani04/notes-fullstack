import { z } from 'zod';

export const insertUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim(),
  email: z.email('Invalid email format'),
  password: z.string().min(8, "Password must be atleast 8 characters long")
})

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim().optional(),
  email: z.email('Invalid email format').optional(),
  currentPassword: z.string().min(8, 'Current password is required to make changes').optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long').optional(),
}).refine(data => {

  // If users are trying to set a new password, they MUST provide their current password for security
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
});
