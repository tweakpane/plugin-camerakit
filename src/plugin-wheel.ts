import {RingController} from 'controller/ring';
import {createWheelInputParams} from 'params';
import {createConstraint} from 'plugin-ring';
import {InputParams} from 'tweakpane/lib/blade/common/api/types';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from 'tweakpane/lib/common/converter/number';
import {writePrimitive} from 'tweakpane/lib/common/primitive';
import {TpError} from 'tweakpane/lib/common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from 'tweakpane/lib/common/util';
import {InputBindingPlugin} from 'tweakpane/lib/input-binding/plugin';
import {forceCast} from 'tweakpane/lib/misc/type-util';

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
		writer: (_args) => writePrimitive,
	},
	controller(args) {
		const params = createWheelInputParams(forceCast(args.params));
		if (!params) {
			throw TpError.shouldNeverHappen();
		}

		const c = args.constraint;
		const draggingScale = getSuitableDraggingScale(c, args.initialValue);
		const formatters = {
			ring: createNumberFormatter(0),
			text: createNumberFormatter(
				getSuitableDecimalDigits(c, args.initialValue),
			),
		};

		if (params.wide) {
			return new RingController(args.document, {
				formatters: formatters,
				seriesId: 'w',
				tooltipEnabled: true,
				unit: {
					ticks: 10,
					pixels: 40,
					value: (params.amount ?? draggingScale) * 40,
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
				value: (params.amount ?? draggingScale) * 40,
			},
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
