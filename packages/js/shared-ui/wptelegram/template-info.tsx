import { __, isRTL, sprintf } from '@wpsocio/i18n';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wpsocio/ui-components/ui/collapsible.js';
import { Link } from '@wpsocio/ui-components/wrappers/link.js';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { Fragment } from 'react';
import { Code } from '../components/code.js';
import { VariableButton } from '../components/variable-button.jsx';

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
		<Collapsible>
			<CollapsibleTrigger>
				{sprintf(
					'%s %s',
					isRTL() ? '👈' : '👉',
					__('You can use any text, emojis or these variables in any order.'),
				)}
				&nbsp;({__('Click to copy')})
			</CollapsibleTrigger>
			<CollapsibleContent className="my-6">
				<div>
					<p>
						<b>{__('You can also use conditional logic in the template.')}</b>
						&nbsp;
						<Link href={docsLink} isExternal>
							{__('Learn more')}
						</Link>
					</p>
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
													return (
														<VariableButton
															key={key.toString()}
															content={macro}
														/>
													);
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
				</div>
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
};
