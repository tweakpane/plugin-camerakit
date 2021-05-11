import {
	BaseInputParams,
	CompositeConstraint,
	Constraint,
	createRangeConstraint,
	createStepConstraint,
} from '@tweakpane/core';

import {RingUnit} from './view/ring';

export type RingSeries = 0 | 1 | 2;

export interface RingInputParams extends BaseInputParams {
	view: 'cameraring';

	max?: number;
	min?: number;
	series?: RingSeries;
	step?: number;
	unit?: RingUnit;
	wide?: boolean;
}

export interface WheelInputParams extends BaseInputParams {
	view: 'camerawheel';

	amount?: number;
	max?: number;
	min?: number;
	step?: number;
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
