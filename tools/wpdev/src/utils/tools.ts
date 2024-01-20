import { getPackages } from '@manypkg/get-packages';
import { Package, RootTool } from '@manypkg/tools';
import { z } from 'zod';

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
			.array(z.enum(['plugins', 'themes']))
			.optional()
			.default(['plugins', 'themes'])
			.describe(
				'The project types managed by this monorepo. Only used in wp-monorepo mode.',
			),
		belongsTo: z
			.enum(['plugins', 'themes'])
			.optional()
			.describe(
				'The project type this project belongs to. Used for individual packages in a monorepo or for standalone projects.',
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

export type ProjectType = NonNullable<UserConfigInput['projectTypes']>[number];

export type PackageJSON = Package['packageJson'] & {
	wpdev?: UserConfigInput;
};

export type WPProject = Omit<Package, 'packageJson'> & {
	packageJson: PackageJSON;
};

/**
 * Fix the type of the package json to include the wpdev config.
 */
export function fixPackage(pkg: Package): WPProject {
	if ('wpdev' in pkg.packageJson && pkg.packageJson.wpdev) {
		const wpdev = UserConfigSchema.parse(pkg.packageJson.wpdev);

		return {
			...pkg,
			packageJson: {
				...pkg.packageJson,
				wpdev,
			},
		};
	}
	return pkg;
}

export async function getStandalonePackage(dir: string) {
	const { packages } = await getPackages(dir, {
		tools: [RootTool],
	});

	const [pkg] = packages;

	return pkg ? fixPackage(pkg) : pkg;
}
