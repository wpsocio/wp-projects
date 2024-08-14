import * as React from 'react';
import { cn } from '../lib/utils.js';
import { Input as InputUI } from '../ui/input.js';

export type InputProps = React.ComponentProps<typeof InputUI> & {
	addonStart?: React.ReactNode;
	addonEnd?: React.ReactNode;
	wrapperClassName?: string;
	isInvalid?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ addonStart, addonEnd, className, wrapperClassName, isInvalid, ...props },
		ref,
	) => {
		const classNames = cn(
			{
				'border-destructive': isInvalid,
				'bg-slate-100': props.readOnly,
			},
			className,
		);

		if (addonEnd || addonStart) {
			return (
				<div className={cn('flex h-10 w-full items-stretch', wrapperClassName)}>
					{addonStart ? (
						<div className="flex h-10 rounded-s-md border border-e-0 border-input bg-secondary px-3 py-2 text-sm">
							{addonStart}
						</div>
					) : null}
					<InputUI
						ref={ref}
						className={cn(
							{
								'rounded-none': true,
								'rounded-s-md': !addonStart,
								'rounded-e-md': !addonEnd,
							},
							classNames,
						)}
						aria-invalid={isInvalid}
						{...props}
					/>
					{addonEnd ? (
						<div className="flex h-10 rounded-e-md border border-s-0 border-input bg-secondary px-3 py-2 text-sm">
							{addonEnd}
						</div>
					) : null}
				</div>
			);
		}

		return (
			<InputUI
				ref={ref}
				className={classNames}
				aria-invalid={isInvalid}
				{...props}
			/>
		);
	},
);

Input.displayName = 'Input';
