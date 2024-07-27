import { z } from 'zod';

export const schema = z.object({
	validate: z.array(
		z.object({
			paths: z.array(z.string()),
			rules: z.array(
				z.object({
					value: z.union([z.literal('EXISTS'), z.literal('NOT_EXISTS')]),
					message: z.string().optional(),
				}),
			),
		}),
	),
});
