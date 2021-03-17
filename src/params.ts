import {BaseInputParams} from 'tweakpane/lib/api/types';

import {RingUnit} from './view/ring';

// TODO: Move them to core
type PropertyFinder<T> = (
	params: Record<string, unknown>,
	key: string,
) => T | undefined;

function createParamFinder<T>(
	test: (value: unknown) => value is T,
): PropertyFinder<T> {
	return (params, key) => {
		if (!(key in params)) {
			return;
		}
		const value = params[key];
		return test(value) ? value : undefined;
	};
}

export const findBooleanParam = createParamFinder<boolean>(
	(value): value is boolean => typeof value === 'boolean',
);

export const findNumberParam = createParamFinder<number>(
	(value): value is number => typeof value === 'number',
);

export const findStringParam = createParamFinder<string>(
	(value): value is string => typeof value === 'string',
);

function isObject(value: unknown): value is Record<string, unknown> {
	if (value === null) {
		return false;
	}
	return typeof value === 'object';
}

export const findObjectParam = createParamFinder<Record<string, unknown>>(
	isObject,
);

type RingSeries = 0 | 1 | 2;

export interface RingInputParams extends BaseInputParams {
	plugin: 'camerakit';
	view: string;

	max?: number;
	min?: number;
	series?: RingSeries;
	step?: number;
	unit?: RingUnit;
	wide?: boolean;
}

const findSeries = createParamFinder<RingSeries>(
	(value): value is RingSeries => value === 1 || value === 2 || value === 3,
);

function createUnit(
	params: Record<string, unknown>,
	key: string,
): RingUnit | undefined {
	const value = findObjectParam(params, key);
	if (!isObject(value)) {
		return;
	}

	const pixels = findNumberParam(value, 'pixels');
	const ticks = findNumberParam(value, 'ticks');
	const unitValue = findNumberParam(value, 'value');
	if (pixels === undefined || ticks === undefined || unitValue === undefined) {
		return;
	}
	return {
		pixels,
		ticks,
		value: unitValue,
	};
}

export function createRingInputParams(
	params: Record<string, unknown>,
): RingInputParams | null {
	const plugin = findStringParam(params, 'plugin');
	const view = findStringParam(params, 'view');
	if (plugin !== 'camerakit' || view === undefined) {
		return null;
	}

	return {
		max: findNumberParam(params, 'max'),
		min: findNumberParam(params, 'min'),
		series: findSeries(params, 'series'),
		step: findNumberParam(params, 'step'),
		plugin: plugin,
		unit: createUnit(params, 'unit'),
		view: view,
		wide: findBooleanParam(params, 'wide'),
	};
}

export interface WheelInputParams extends BaseInputParams {
	plugin: 'camerakit';
	view: string;

	amount?: number;
	max?: number;
	min?: number;
	step?: number;
	wide?: boolean;
}

export function createWheelInputParams(
	params: Record<string, unknown>,
): WheelInputParams | null {
	const plugin = findStringParam(params, 'plugin');
	const view = findStringParam(params, 'view');
	if (plugin !== 'camerakit' || view === undefined) {
		return null;
	}

	return {
		amount: findNumberParam(params, 'amount'),
		max: findNumberParam(params, 'max'),
		min: findNumberParam(params, 'min'),
		step: findNumberParam(params, 'step'),
		plugin: plugin,
		view: view,
		wide: findBooleanParam(params, 'wide'),
	};
}
