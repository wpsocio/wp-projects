import { __, isRTL, sprintf } from '@wpsocio/i18n';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@wpsocio/ui/components/collapsible';
import { ChevronDown, ChevronUp } from '@wpsocio/ui/icons';
import { cn } from '@wpsocio/ui/lib/utils';
import { Button } from '@wpsocio/ui/wrappers/button';
import { Link } from '@wpsocio/ui/wrappers/link';
import { createInterpolateElement } from '@wpsocio/utilities/createInterpolateElement.js';
import { useState } from 'react';
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
	const [isOpened, setIsOpened] = useState(false);

	return (
		<Collapsible open={isOpened} onOpenChange={setIsOpened}>
			<div className={'relative overflow-hidden'}>
				<CollapsibleContent
					forceMount
					className={cn(
						' p-4 pb-8 my-6 overflow-hidden border border-b-0 rounded-t',
						{
							'max-h-32 border-transparent': !isOpened,
							'border-zinc-700/30': isOpened,
						},
					)}
				>
					<div>
						{isOpened ? (
							<>
								<div className="mb-4 text-start leading-6">
									{sprintf(
										'%s %s',
										isRTL() ? '👈' : '👉',
										__(
											'You can use any text, emojis or these variables in any order.',
										),
									)}
									&nbsp;({__('Click to copy')})
								</div>
								<p>
									<b>
										{__('You can also use conditional logic in the template.')}
									</b>
									&nbsp;
									<Link href={docsLink} isExternal>
										{__('Learn more')}
									</Link>
								</p>
							</>
						) : null}
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
				<div
					className={cn(
						'absolute flex items-center justify-center bg-gradient-to-b from-zinc-700/30 to-zinc-700/90 p-2',
						isOpened
							? 'inset-x-0 bottom-4 h-12 border-x border-zinc-300/30'
							: 'rounded inset-0 inset-y-6',
					)}
				>
					<CollapsibleTrigger asChild>
						<Button variant="secondary" className="h-8">
							{isOpened ? __('Collapse') : __('Expand')}
							{isOpened ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
						</Button>
					</CollapsibleTrigger>
				</div>
			</div>
		</Collapsible>
	);
};
