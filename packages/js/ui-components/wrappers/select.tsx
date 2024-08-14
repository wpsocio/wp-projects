import * as React from 'react';

import { cn } from '../lib/utils.js';
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	Select as SelectUI,
	SelectValue,
} from '../ui/select.js';
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
	portalContainer?: HTMLElement | null;
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
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
		},
		ref,
	) => {
		return (
			<SelectUI {...props}>
				<SelectTrigger
					className={cn('w-[180px]', triggerClassName)}
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
				<SelectContent portalContainer={portalContainer}>
					{options.map((option) => (
						<React.Fragment key={option.label}>
							{(() => {
								if ('options' in option && Array.isArray(option.options)) {
									return (
										<SelectGroup>
											<SelectLabel>{option.label}</SelectLabel>
											{option.options.map((item) => (
												<SelectItem
													key={item.value}
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
);
