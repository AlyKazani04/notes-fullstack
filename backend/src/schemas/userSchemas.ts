import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim().optional(),
  email: z.email('Invalid email format').optional(),
  currentPassword: z.string().min(1, 'Current password is required to make changes').optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long').optional(),
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
