import * as React from 'react';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	Select as SelectUI,
	SelectValue,
} from '../components/select.js';
import { cn } from '../lib/utils.js';
import { Spinner } from './spinner.js';
import type { OptionProps } from './types.js';

export type SelectOptionGroup = { label: string; options: Array<OptionProps> };

export type SelectOptions = Array<OptionProps | SelectOptionGroup>;

export type SelectProps = React.ComponentProps<typeof SelectUI> & {
	options: SelectOptions;
	placeholder?: string;
	id?: string;
	'aria-label'?: string;
	triggerClassName?: string;
	isLoading?: boolean;
	portalContainer?: HTMLElement;
};

declare global {
	interface Window {
		__WPSOCIO_UI_ROOT_SELECTOR?: string;
	}
}

function getPortalContainer() {
	const portalSelector = window.__WPSOCIO_UI_ROOT_SELECTOR;
	if (typeof portalSelector === 'string' && portalSelector) {
		return document.querySelector<HTMLElement>(portalSelector) || undefined;
	}
}

const Select = React.forwardRef(
	(
		{
			options,
			placeholder = '...',
			id,
			'aria-label': ariaLabel,
			triggerClassName,
			isLoading,
			portalContainer,
			...props
		}: SelectProps,
		ref: React.Ref<HTMLButtonElement>,
	) => {
		return (
			<SelectUI {...props} key={props.value}>
				<SelectTrigger
					className={cn('w-45', triggerClassName)}
					id={id}
					aria-label={ariaLabel}
					ref={ref}
				>
					{isLoading ? (
						<div className="flex items-center justify-between w-full">
							<SelectValue placeholder={placeholder} />
							<Spinner className="opacity-50 me-2" />
						</div>
					) : (
						<SelectValue placeholder={placeholder} />
					)}
				</SelectTrigger>
				<SelectContent
					portalContainer={portalContainer || getPortalContainer()}
				>
					{options.map((option) => (
						<React.Fragment key={JSON.stringify(option)}>
							{(() => {
								if ('options' in option && Array.isArray(option.options)) {
									return (
										<SelectGroup>
											<SelectLabel>{option.label}</SelectLabel>
											{option.options.map((item, index) => (
												<SelectItem
													key={`${item.value}:${item.label}:${index}`}
													{...item}
													value={item.value}
													className="ms-2"
												>
													{item.label}
												</SelectItem>
											))}
										</SelectGroup>
									);
								}
								if ('value' in option) {
									return (
										<SelectItem {...option} value={option.value}>
											{option.label}
										</SelectItem>
									);
								}
								return null;
							})()}
						</React.Fragment>
					))}
				</SelectContent>
			</SelectUI>
		);
	},
) as React.ForwardRefExoticComponent<
	SelectProps & React.RefAttributes<HTMLButtonElement>
>;

Select.displayName = 'Select';

export { Select };
