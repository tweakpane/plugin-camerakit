import {
	createNumberFormatter,
	getBaseStep,
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
import {createConstraint, WheelInputParams} from './util';

export const WheelInputPlugin: InputBindingPlugin<
	number,
	number,
	WheelInputParams
> = {
	id: 'input-camerakit-wheel',
	type: 'input',
	css: '__css__',
	accept(exValue: unknown, params: InputParams) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<WheelInputParams>(params, {
			view: p.required.constant('camerawheel'),

			amount: p.optional.number,
			max: p.optional.number,
			min: p.optional.number,
			step: p.optional.number,
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
		const c = args.constraint;
		const draggingScale = getSuitableDraggingScale(c, args.initialValue);
		const formatters = {
			ring: createNumberFormatter(0),
			text: createNumberFormatter(
				getSuitableDecimalDigits(c, args.initialValue),
			),
		};

		if (args.params.wide) {
			return new RingController(args.document, {
				formatters: formatters,
				seriesId: 'w',
				tooltipEnabled: true,
				unit: {
					ticks: 10,
					pixels: 40,
					value: (args.params.amount ?? draggingScale) * 40,
				},
				value: args.value,
				viewProps: args.viewProps,
			});
		}

		return new RingTextController(args.document, {
			baseStep: getBaseStep(c),
			draggingScale: draggingScale,
			formatters: formatters,
			parser: parseNumber,
			seriesId: 'w',
			ringUnit: {
				ticks: 10,
				pixels: 40,
				value: (args.params.amount ?? draggingScale) * 40,
			},
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
