import { getPackages } from '@manypkg/get-packages';
import { type Package, RootTool } from '@manypkg/tools';
import { z } from 'zod';
import { projectInfoSchema } from './schema.js';

export const UserConfigSchema = z
	.object({
		isRoot: z
			.boolean()
			.optional()
			.describe('Whether this is the root directiry.'),
		operationMode: z
			.enum(['wp-monorepo', 'standalone'])
			.optional()
			.default('standalone')
			.describe('Whether this is a wp-monorepo or standalone project.'),
		projectTypes: z
			.array(z.enum(['plugins', 'themes', 'mu-plugins']))
			.optional()
			.default(['plugins', 'themes'])
			.describe(
				'The project types managed by this monorepo. Only used in wp-monorepo mode.',
			),
		projectType: projectInfoSchema.shape.projectType.describe(
			'The project type. Used for individual packages in a monorepo or for standalone projects.',
		),
		envFiles: z
			.array(z.string())
			.optional()
			.default([])
			.describe('The env files to load. Used only if isRoot is true.'),
	})
	.transform((value) => {
		if (value.operationMode !== 'wp-monorepo') {
			// 'projectTypes' is not used in standalone mode
			return {
				...value,
				projectTypes: [],
			};
		}

		return value;
	});

export type UserConfigInput = z.input<typeof UserConfigSchema>;

export type UserConfig = z.infer<typeof UserConfigSchema>;

export type PackageJSON = Package['packageJson'] & {
	wpdev?: UserConfigInput;
};

export type StandalonePackage = Omit<Package, 'packageJson'> & {
	packageJson: PackageJSON;
};

/**
 * Fix the type of the package json to include the wpdev config.
 */
export function fixPackageType(pkg: Package): StandalonePackage {
	return pkg;
}

export async function getStandalonePackage(dir: string) {
	const { packages } = await getPackages(dir, {
		tools: [RootTool],
	});

	// We need only the first package
	return fixPackageType(packages[0]);
}
