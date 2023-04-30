import {
	createNumberFormatter,
	createNumberTextInputParamsParser,
	createNumberTextPropsObject,
	Formatter,
	getDecimalDigits,
	InputBindingPlugin,
	numberFromUnknown,
	parseNumber,
	parseRecord,
	ValueMap,
	VERSION,
	writePrimitive,
} from '@tweakpane/core';

import {RingController} from './controller/ring.js';
import {RingTextController} from './controller/ring-text.js';
import {createConstraint, RingInputParams, RingSeries} from './util.js';
import {RingUnit} from './view/ring.js';

function parseSeries(value: unknown): RingSeries | undefined {
	return value === 0 || value === 1 || value === 2 ? value : undefined;
}

function getRingSeries(series: RingSeries | undefined): string | null {
	return series !== undefined ? String(series) : '0';
}

function createRingFormatter(ringUnit: RingUnit): Formatter<number> {
	const f = createNumberFormatter(getDecimalDigits(ringUnit.value));
	return (value: number): string => {
		const text = f(value);
		const ch = text.substr(0, 1);
		const hasSign = ch === '-' || ch === '+';
		return text + (hasSign ? ' ' : '');
	};
}

export const RingInputPlugin: InputBindingPlugin<
	number,
	number,
	RingInputParams
> = {
	id: 'input-camerakit-ring',
	type: 'input',
	core: VERSION,
	css: '__css__',

	accept(exValue: unknown, params) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const result = parseRecord<RingInputParams>(params, (p) => ({
			...createNumberTextInputParamsParser(p),

			series: p.optional.custom(parseSeries),
			unit: p.optional.object({
				pixels: p.required.number,
				ticks: p.required.number,
				value: p.required.number,
			}),
			view: p.required.constant('cameraring'),
			wide: p.optional.boolean,
		}));
		return result
			? {
					initialValue: exValue,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => numberFromUnknown,
		constraint: (args) => createConstraint(args.params),
		writer: (_args) => writePrimitive,
	},
	controller(args) {
		const ringUnit = args.params.unit ?? {
			ticks: 5,
			pixels: 40,
			value: 10,
		};
		const ringFormatter = createRingFormatter(ringUnit);
		const textPropsObj = createNumberTextPropsObject(
			args.params,
			args.initialValue,
		);

		if (args.params.wide) {
			return new RingController(args.document, {
				formatters: {
					ring: ringFormatter,
					text: textPropsObj.formatter,
				},
				seriesId: getRingSeries(args.params.series) ?? '0',
				tooltipEnabled: true,
				unit: ringUnit,
				value: args.value,
				viewProps: args.viewProps,
			});
		}

		const textProps = ValueMap.fromObject(textPropsObj);
		return new RingTextController(args.document, {
			parser: parseNumber,
			ringFormatter: ringFormatter,
			ringUnit: ringUnit,
			seriesId: getRingSeries(args.params.series) ?? '0',
			textProps: textProps,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
