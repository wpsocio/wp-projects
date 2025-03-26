import { __, isRTL, sprintf } from '@wpsocio/i18n';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wpsocio/ui/components/collapsible';
import { Link } from '@wpsocio/ui/wrappers/link';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { VariableButton } from '../components/variable-button.js';

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
			<CollapsibleTrigger className="text-start leading-6">
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
					<div className="flex flex-col gap-8 my-4">
						{Object.values(macros).map((group, i) => {
							const { label, macros = [], info } = group;
							return (
								<section key={i.toString()} className="flex flex-col gap-3">
									<div className="grid gap-2 grid-cols-1 xl:grid-cols-5">
										<h4 className="text-md font-semibold col-span-1">
											{label}
										</h4>
										<div className="col-span-4">
											{macros.map((macro, key) => {
												return (
													<VariableButton
														key={key.toString()}
														content={macro}
													/>
												);
											})}
										</div>
									</div>
									{info ? (
										<p className="text-foreground/70">
											{createInterpolateElement(
												info.replaceAll('\n', '<br />'),
												{
													code: <VariableButton />,
													br: <br />,
												},
											)}
										</p>
									) : null}
								</section>
							);
						})}
					</div>
				</div>
				{children}
			</CollapsibleContent>
		</Collapsible>
	);
};
