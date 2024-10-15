import Select, { components } from 'react-select';
import type { DropdownIndicatorProps, GroupBase, Props } from 'react-select';
import AsyncSelect, { type AsyncProps } from 'react-select/async';
import { ChevronDown, Close } from '../icons/index.js';
import { cn } from '../lib/utils.js';
import { Spinner } from './spinner.js';

const controlStyles = {
	base: 'border rounded-md bg-transparent hover:cursor-pointer',
	focus: 'border-ring ring-1 ring-ring',
	nonFocus: 'border-border',
};
const placeholderStyles = 'pl-1 py-0.5';
const selectInputStyles = 'pl-1 py-0.5';
const valueContainerStyles = 'p-1 gap-1 data__values-container';
const singleValueStyles = 'leading-7 ml-1';
const multiValueStyles =
	'bg-accent rounded items-center py-0.5 pl-2 pr-1 gap-1.5 data__multi-value';
const multiValueLabelStyles = 'leading-6 py-0.5';
const multiValueRemoveStyles =
	'bg-transparent text-primary opacity-50 hover:opacity-100';
const indicatorsContainerStyles = 'p-1 gap-1';
const clearIndicatorStyles =
	'p-1 bg-transparent text-primary opacity-50 hover:opacity-100';
const indicatorSeparatorStyles = 'bg-border hidden';
const dropdownIndicatorStyles =
	'[&>svg]:w-4 [&>svg]:h-4 py-1 px-2 text-primary opacity-50';
const loadingIndicatorStyles = 'opacity-50';
const menuStyles = 'p-1 mt-2 border bg-background rounded-lg';
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-semibold text-sm';
const optionStyles = {
	base: 'hover:cursor-pointer px-3 py-2 rounded',
	focus: 'bg-accent active:bg-secondary',
};
const noOptionsMessageStyles =
	'p-2 bg-background border border-dashed rounded-sm';

const DropdownIndicator = (props: DropdownIndicatorProps) => {
	return (
		<components.DropdownIndicator {...props}>
			<ChevronDown />
		</components.DropdownIndicator>
	);
};

const ClearIndicator = (
	props: React.ComponentProps<typeof components.ClearIndicator>,
) => {
	return (
		<components.ClearIndicator {...props}>
			<Close />
		</components.ClearIndicator>
	);
};

const MultiValueRemove = (
	props: React.ComponentProps<typeof components.MultiValueRemove>,
) => {
	return (
		<components.MultiValueRemove {...props}>
			<Close />
		</components.MultiValueRemove>
	);
};

const LoadingIndicator = () => {
	return <Spinner className={loadingIndicatorStyles} />;
};

const customComponents: Props['components'] = {
	DropdownIndicator,
	ClearIndicator,
	MultiValueRemove,
	LoadingIndicator,
};

const styles: Props['styles'] = {
	input: (base) => ({
		...base,
		'input:focus': {
			boxShadow: 'none',
		},
	}),
	// On mobile, the label will truncate automatically, so we want to
	// override that behaviour.
	multiValueLabel: (base) => ({
		...base,
		whiteSpace: 'normal',
		overflow: 'visible',
	}),
	control: (base) => ({
		...base,
		transition: 'none',
	}),
};

const classNames: Props['classNames'] = {
	control: ({ isFocused }) =>
		cn(
			isFocused ? controlStyles.focus : controlStyles.nonFocus,
			controlStyles.base,
		),
	placeholder: (props) => {
		return cn(placeholderStyles, {
			'opacity-50': props.selectProps.isLoading,
		});
	},
	input: () => selectInputStyles,
	valueContainer: () => valueContainerStyles,
	singleValue: () => singleValueStyles,
	multiValue: () => multiValueStyles,
	multiValueLabel: () => multiValueLabelStyles,
	multiValueRemove: () => multiValueRemoveStyles,
	indicatorsContainer: () => indicatorsContainerStyles,
	clearIndicator: () => clearIndicatorStyles,
	indicatorSeparator: () => indicatorSeparatorStyles,
	dropdownIndicator: () => dropdownIndicatorStyles,
	menu: () => menuStyles,
	groupHeading: () => groupHeadingStyles,
	option: ({ isFocused }) =>
		cn(isFocused && optionStyles.focus, optionStyles.base),
	noOptionsMessage: () => noOptionsMessageStyles,
	loadingIndicator: () => loadingIndicatorStyles,
};

export function ReactSelect<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(props: Props<Option, IsMulti, Group>) {
	return (
		<Select
			closeMenuOnSelect={false}
			unstyled
			// it's fine because they are defined outside the component and thus are not aware of the generics
			// @ts-expect-error
			styles={styles}
			// @ts-expect-error
			components={customComponents}
			// @ts-expect-error
			classNames={classNames}
			{...props}
		/>
	);
}

export function ReactAsyncSelect<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(props: AsyncProps<Option, IsMulti, Group>) {
	return (
		<AsyncSelect
			closeMenuOnSelect={false}
			unstyled
			// it's fine to cast these as any because they are defined outside the component
			// @ts-expect-error
			styles={styles}
			// @ts-expect-error
			components={customComponents}
			// @ts-expect-error
			classNames={classNames}
			{...props}
		/>
	);
}
