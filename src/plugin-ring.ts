import {RingController} from 'controller/ring';
import {createRingInputParams, RingInputParams} from 'params';
import {InputParams} from 'tweakpane/lib/blade/common/api/types';
import {CompositeConstraint} from 'tweakpane/lib/common/constraint/composite';
import {Constraint} from 'tweakpane/lib/common/constraint/constraint';
import {Formatter} from 'tweakpane/lib/common/converter/formatter';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from 'tweakpane/lib/common/converter/number';
import {getDecimalDigits} from 'tweakpane/lib/common/number-util';
import {writePrimitive} from 'tweakpane/lib/common/primitive';
import {TpError} from 'tweakpane/lib/common/tp-error';
import {
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
} from 'tweakpane/lib/common/util';
import {
	createRangeConstraint,
	createStepConstraint,
} from 'tweakpane/lib/input-binding/number/plugin';
import {InputBindingPlugin} from 'tweakpane/lib/input-binding/plugin';
import {forceCast} from 'tweakpane/lib/misc/type-util';

import {RingTextController} from './controller/ring-text';
import {RingUnit} from './view/ring';

function getRingSeries(series: RingInputParams['series']): string | null {
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

export function createConstraint(params: InputParams): Constraint<number> {
	const constraints = [];
	const cr = createRangeConstraint(params);
	if (cr) {
		constraints.push(cr);
	}
	const cs = createStepConstraint(params);
	if (cs) {
		constraints.push(cs);
	}
	return new CompositeConstraint(constraints);
}

export const RingInputPlugin: InputBindingPlugin<number, number> = {
	id: 'input-camerakit-ring',
	css: '__css__',
	accept(exValue: unknown, params: InputParams) {
		if (typeof exValue !== 'number') {
			return null;
		}

		const p = createRingInputParams(forceCast(params));
		if (!p) {
			return null;
		}
		if (p.view !== 'ring') {
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
		const params = createRingInputParams(forceCast(args.params));
		if (!params) {
			throw TpError.shouldNeverHappen();
		}

		const ringUnit = params.unit ?? {
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

		if (params.wide) {
			return new RingController(args.document, {
				formatters: formatters,
				seriesId: getRingSeries(params.series) ?? '0',
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
			seriesId: getRingSeries(params.series) ?? '0',
			ringUnit: ringUnit,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
