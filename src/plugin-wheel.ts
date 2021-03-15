import {createWheelInputParams} from 'params';
import {createConstraint} from 'plugin-ring';
import {InputParams} from 'tweakpane/lib/api/types';
import {forceCast} from 'tweakpane/lib/misc/type-util';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from 'tweakpane/lib/plugin/common/converter/number';
import {
	equalsPrimitive,
	writePrimitive,
} from 'tweakpane/lib/plugin/common/primitive';
import {TpError} from 'tweakpane/lib/plugin/common/tp-error';
import {InputBindingPlugin} from 'tweakpane/lib/plugin/input-binding';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from 'tweakpane/lib/plugin/util';

import {RingTextController} from './controller/ring-text';

export const WheelInputPlugin: InputBindingPlugin<number, number> = {
	id: 'input-camerakit-wheel',
	css: '__css__',
	accept(exValue: unknown, params: InputParams) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const p = createWheelInputParams(forceCast(params));
		if (!p) {
			return null;
		}
		if (p.view !== 'wheel') {
			return null;
		}

		return exValue;
	},
	binding: {
		reader: (_args) => numberFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: equalsPrimitive,
		writer: (_args) => writePrimitive,
	},
	controller(args) {
		const params = createWheelInputParams(forceCast(args.params));
		if (!params) {
			throw TpError.shouldNeverHappen();
		}

		const c = args.value.constraint;
		const draggingScale = getSuitableDraggingScale(c, args.initialValue);
		return new RingTextController(args.document, {
			baseStep: getBaseStep(c),
			draggingScale: draggingScale,
			formatters: {
				ring: createNumberFormatter(0),
				text: createNumberFormatter(
					getSuitableDecimalDigits(c, args.initialValue),
				),
			},
			parser: parseNumber,
			seriesId: 'w',
			ringUnit: {
				ticks: 10,
				pixels: 40,
				value: (params.amount ?? draggingScale) * 40,
			},
			value: args.value,
		});
	},
};
