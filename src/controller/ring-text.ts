import {
	Formatter,
	NumberTextController,
	NumberTextProps,
	Parser,
	Value,
	ValueController,
	ViewProps,
} from '@tweakpane/core';

import {RingUnit} from '../view/ring.js';
import {RingTextView} from '../view/ring-text.js';
import {RingController} from './ring.js';

interface Config {
	parser: Parser<number>;
	ringFormatter: Formatter<number>;
	ringUnit: RingUnit;
	seriesId: string;
	textProps: NumberTextProps;
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
			formatters: {
				ring: config.ringFormatter,
				text: config.textProps.get('formatter'),
			},
			seriesId: config.seriesId,
			tooltipEnabled: false,
			unit: config.ringUnit,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.tc_ = new NumberTextController(doc, {
			parser: config.parser,
			props: config.textProps,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new RingTextView(doc, {
			ringView: this.rc_.view,
			textView: this.tc_.view,
		});
	}
}
