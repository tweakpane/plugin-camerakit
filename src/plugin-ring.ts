import {
	createNumberFormatter,
	Formatter,
	getBaseStep,
	getDecimalDigits,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
	InputBindingPlugin,
	InputParams,
	numberFromUnknown,
	ParamsParsers,
	parseNumber,
	parseParams,
	writePrimitive,
} from '@tweakpane/core';

import {RingController} from './controller/ring';
import {RingTextController} from './controller/ring-text';
import {createConstraint, RingInputParams, RingSeries} from './util';
import {RingUnit} from './view/ring';

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
	css: '__css__',
	accept(exValue: unknown, params: InputParams) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<RingInputParams>(params, {
			view: p.required.constant('cameraring'),

			max: p.optional.number,
			min: p.optional.number,
			series: p.optional.custom(parseSeries),
			step: p.optional.number,
			unit: p.optional.object({
				pixels: p.required.number,
				ticks: p.required.number,
				value: p.required.number,
			}),
			wide: p.optional.boolean,
		});
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
		const c = args.constraint;
		const formatters = {
			ring: createRingFormatter(ringUnit),
			text: createNumberFormatter(
				getSuitableDecimalDigits(c, args.initialValue),
			),
		};

		if (args.params.wide) {
			return new RingController(args.document, {
				formatters: formatters,
				seriesId: getRingSeries(args.params.series) ?? '0',
				tooltipEnabled: true,
				unit: ringUnit,
				value: args.value,
				viewProps: args.viewProps,
			});
		}

		return new RingTextController(args.document, {
			baseStep: getBaseStep(c),
			draggingScale: getSuitableDraggingScale(c, args.initialValue),
			formatters: formatters,
			parser: parseNumber,
			seriesId: getRingSeries(args.params.series) ?? '0',
			ringUnit: ringUnit,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
