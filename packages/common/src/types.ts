import {z} from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string()
});

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const createRoomSchema = z.object({
    slug: z.string()
});
