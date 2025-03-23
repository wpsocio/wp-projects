/**
 * Importable version of the pot-to-php script from `@wordpress/i18n/tools`
 */

import fs from 'node:fs';
import { type GetTextTranslation, po } from 'gettext-parser';

const TAB = '\t';
const NEWLINE = '\n';

const fileHeader =
	[
		'<?php',
		'/* THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY. */',
		'$generated_i18n_strings = array(',
	].join(NEWLINE) + NEWLINE;

const fileFooter =
	NEWLINE +
	[');', '/* THIS IS THE END OF THE GENERATED FILE */'].join(NEWLINE) +
	NEWLINE;

/**
 * Escapes single quotes.
 */
function escapeSingleQuotes(input: string) {
	return input.replace(/'/g, "\\'");
}

/**
 * Converts a translation parsed from the POT file to lines of WP PHP.
 */
function convertTranslationToPHP(
	translation: GetTextTranslation,
	textdomain: string,
	context = '',
) {
	let php = '';

	// The format of gettext-js matches the terminology in gettext itself.
	let original = translation.msgid;
	const comments = translation.comments;

	if (comments && Object.values(comments).length) {
		if (comments.reference) {
			// All references are split by newlines, add a // Reference prefix to make them tidy.
			php +=
				TAB +
				'// Reference: ' +
				comments.reference
					.split(NEWLINE)
					.join(NEWLINE + TAB + '// Reference: ') +
				NEWLINE;
		}

		if (comments.translator) {
			// All extracted comments are split by newlines, add a tab to line them up nicely.
			const translator = comments.translator
				.split(NEWLINE)
				.join(NEWLINE + TAB + '   ');

			php += TAB + `/* ${translator} */${NEWLINE}`;
		}

		if (comments.extracted) {
			php += TAB + `/* translators: ${comments.extracted} */${NEWLINE}`;
		}
	}

	if ('' !== original) {
		original = escapeSingleQuotes(original);

		if (!translation.msgid_plural) {
			if (!context) {
				php += TAB + `__( '${original}', '${textdomain}' )`;
			} else {
				php +=
					TAB +
					`_x( '${original}', '${translation.msgctxt}', '${textdomain}' )`;
			}
		} else {
			const plural = escapeSingleQuotes(translation.msgid_plural);

			if (!context) {
				php += TAB + `_n_noop( '${original}', '${plural}', '${textdomain}' )`;
			} else {
				php +=
					TAB +
					`_nx_noop( '${original}',  '${plural}', '${translation.msgctxt}', '${textdomain}' )`;
			}
		}
	}

	return php;
}

export type ConvertPOTToPHPOptions = {
	textDomain: string;
};

export function convertPOTToPHP(
	potFile: string,
	phpFile: string,
	options: ConvertPOTToPHPOptions,
) {
	const poContents = fs.readFileSync(potFile);
	const parsedPO = po.parse(poContents);

	let output: Array<string> = [];

	for (const context of Object.keys(parsedPO.translations)) {
		const translations = parsedPO.translations[context];

		const newOutput = Object.values(translations)
			.map((translation) =>
				convertTranslationToPHP(translation, options.textDomain, context),
			)
			.filter((php) => php !== '');

		output = [...output, ...newOutput];
	}

	const fileOutput =
		fileHeader + output.join(',' + NEWLINE + NEWLINE) + fileFooter;

	fs.writeFileSync(phpFile, fileOutput);
}
