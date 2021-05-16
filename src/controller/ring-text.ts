import {
	Formatter,
	NumberTextController,
	Parser,
	Value,
	ValueController,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

import {RingUnit} from '../view/ring';
import {RingTextView} from '../view/ring-text';
import {RingController} from './ring';

interface Config {
	baseStep: number;
	draggingScale: number;
	formatters: {
		ring: Formatter<number>;
		text: Formatter<number>;
	};
	parser: Parser<number>;
	seriesId: string;
	ringUnit: RingUnit;
	value: Value<number>;
	viewProps: ViewProps;
}

export class RingTextController
	implements ValueController<number, RingTextView>
{
	public readonly value: Value<number>;
	public readonly view: RingTextView;
	public readonly viewProps: ViewProps;
	private readonly rc_: RingController;
	private readonly tc_: NumberTextController;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.rc_ = new RingController(doc, {
			formatters: config.formatters,
			seriesId: config.seriesId,
			tooltipEnabled: false,
			unit: config.ringUnit,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.tc_ = new NumberTextController(doc, {
			baseStep: config.baseStep,
			parser: config.parser,
			props: ValueMap.fromObject({
				draggingScale: config.draggingScale,
				formatter: config.formatters.text,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new RingTextView(doc, {
			ringView: this.rc_.view,
			textView: this.tc_.view,
		});
	}
}
