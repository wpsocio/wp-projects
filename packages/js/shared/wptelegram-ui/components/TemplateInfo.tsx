import { Fragment } from 'react';

import { Box, Link, Text } from '@wpsocio/adapters';
import { Code, Collapse } from '@wpsocio/components';
import { __, isRTL, sprintf } from '@wpsocio/i18n';
import { createInterpolateElement } from '@wpsocio/utilities';

export interface TemplateMacro {
	label: string;
	macros: Array<string>;
	info?: string;
}

export type Macros = {
	[key: string]: TemplateMacro;
};

export interface TemplateInfoProps {
	macros: Macros;
	docsLink: string;
}

export const TemplateInfo: React.FC<
	React.PropsWithChildren<TemplateInfoProps>
> = ({ children, docsLink, macros }) => {
	return (
		<Collapse
			title={sprintf(
				'%s %s',
				isRTL() ? '👈' : '👉',
				__('You can use any text, emojis or these macros in any order.'),
			)}
		>
			<Box>
				<Text>
					<b>{__('You can also use conditional logic in the template.')}</b>
					&nbsp;
					<Link href={docsLink} color="blue.500" isExternal>
						{__('Learn more')}
					</Link>
				</Text>
				<table className="form-table">
					<tbody>
						{Object.values(macros).map((group, i) => {
							const { label, macros = [], info } = group;
							return (
								<Fragment key={i.toString()}>
									<tr>
										<th>{label}</th>
										<td>
											{macros.map((macro, key) => {
												return <Code key={key.toString()}>{macro}</Code>;
											})}
										</td>
									</tr>
									{info ? (
										<tr>
											<td colSpan={2}>
												<span>
													{createInterpolateElement(info, { code: <Code /> })}
												</span>
											</td>
										</tr>
									) : null}
								</Fragment>
							);
						})}
					</tbody>
				</table>
			</Box>
			{children}
		</Collapse>
	);
};
