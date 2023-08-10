import {
	BaseInputParams,
	CompositeConstraint,
	Constraint,
	createRangeConstraint,
	createStepConstraint,
	NumberTextInputParams,
} from '@tweakpane/core';

import {RingUnit} from './view/ring.js';

export type RingSeries = 0 | 1 | 2;

export interface RingInputParams
	extends BaseInputParams,
		NumberTextInputParams {
	view: 'cameraring';

	series?: RingSeries;
	unit?: RingUnit;
	wide?: boolean;
}

export interface WheelInputParams
	extends BaseInputParams,
		NumberTextInputParams {
	view: 'camerawheel';

	amount?: number;
	wide?: boolean;
}

export function createConstraint(
	params: RingInputParams | WheelInputParams,
): Constraint<number> {
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
