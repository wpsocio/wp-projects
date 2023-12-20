import { useFieldArray } from 'react-hook-form';

import {
	Button,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	IconButton,
	Text,
} from '@wpsocio/adapters';
import { SectionCard } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { AddIcon, CloseIcon } from '@wpsocio/icons';

import { FormField } from '../FormField';
import type {
	DataShape,
	FieldType,
	RenderRepeatableProps,
	RepeatableValue,
} from '../types';
import { ErrorMessage } from './ErrorMessage';

const DEFAULT_ITEM = { value: undefined };

export const RenderRepeatable = <
	TFieldType extends FieldType,
	TDataShape extends DataShape,
>(
	props: RenderRepeatableProps<TFieldType, TDataShape>,
): React.ReactNode => {
	const {
		addButtonLabel,
		after,
		afterRow: AfterRow,
		before,
		defaultItem = DEFAULT_ITEM,
		description,
		error,
		fieldType,
		initialLabel,
		label,
		name,
		renderAsSection,
		repeatableItemLabel,
		...rest
	} = props;

	const fieldArray = useFieldArray({ name });

	return (
		<div className="repeatable">
			<FormControl isInvalid={Boolean(error)}>
				<FormLabel>{label}</FormLabel>
				{description ? <FormHelperText>{description}</FormHelperText> : null}
				<ErrorMessage name={name} />
			</FormControl>
			{!fieldArray.fields.length ? (
				<Text fontWeight="bold" as="span">
					{initialLabel}&nbsp;
				</Text>
			) : null}
			{fieldArray.fields.map((field: RepeatableValue, index) => {
				if (!field) {
					return null;
				}
				const title = repeatableItemLabel?.(index) || `#${index + 1}`;

				const removeButton = (
					<IconButton
						aria-label="Remove Item"
						icon={<CloseIcon />}
						isRound
						onClick={() => fieldArray.remove(index)}
						size="sm"
						variant="ghost"
						ms={!renderAsSection ? '0.5em' : ''}
					/>
				);

				const fieldName = `${name}.${index}.value`;

				const formField = (
					<FormField
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						{...(rest as any)}
						defaultValue={field.value}
						name={fieldName}
						fieldType={fieldType}
					/>
				);

				return renderAsSection ? (
					<SectionCard
						title={
							<Flex alignItems="center" justifyContent="space-between">
								<Text>{title}</Text>
								{removeButton}
							</Flex>
						}
						key={field.id}
					>
						{before}
						{formField}
						{after}
						{AfterRow && <AfterRow name={fieldName} />}
					</SectionCard>
				) : (
					<Flex alignItems="baseline" key={field.id}>
						{formField} {removeButton}
					</Flex>
				);
			})}
			<Button
				mt="0.5em"
				className="add-item"
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				onClick={() => fieldArray.append(defaultItem as any)}
				leftIcon={<AddIcon />}
			>
				{addButtonLabel || __('Add')}
			</Button>
		</div>
	);
};
