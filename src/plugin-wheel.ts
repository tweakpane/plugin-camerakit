import {
	createNumberFormatter,
	createNumberTextInputParamsParser,
	createNumberTextPropsObject,
	createPlugin,
	InputBindingPlugin,
	numberFromUnknown,
	parseNumber,
	parseRecord,
	ValueMap,
	writePrimitive,
} from '@tweakpane/core';

import {RingController} from './controller/ring.js';
import {RingTextController} from './controller/ring-text.js';
import {createConstraint, WheelInputParams} from './util.js';

export const WheelInputPlugin: InputBindingPlugin<
	number,
	number,
	WheelInputParams
> = createPlugin({
	id: 'input-wheel',
	type: 'input',

	accept(exValue: unknown, params) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const result = parseRecord<WheelInputParams>(params, (p) => ({
			...createNumberTextInputParamsParser(p),

			amount: p.optional.number,
			view: p.required.constant('camerawheel'),
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
		const ringFormatter = createNumberFormatter(0);
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
				seriesId: 'w',
				tooltipEnabled: true,
				unit: {
					ticks: 10,
					pixels: 40,
					value: (args.params.amount ?? textPropsObj.pointerScale) * 40,
				},
				value: args.value,
				viewProps: args.viewProps,
			});
		}

		return new RingTextController(args.document, {
			parser: parseNumber,
			ringFormatter: ringFormatter,
			ringUnit: {
				ticks: 10,
				pixels: 40,
				value: (args.params.amount ?? textPropsObj.pointerScale) * 40,
			},
			seriesId: 'w',
			textProps: ValueMap.fromObject(textPropsObj),
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
