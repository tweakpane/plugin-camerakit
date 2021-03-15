import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {
	PointerHandler,
	PointerHandlerEvent,
} from 'tweakpane/lib/plugin/common/view/pointer-handler';

import {RingUnit, RingView} from '../view/ring';

interface Config {
	formatter: Formatter<number>;
	seriesId: string;
	unit: RingUnit;
	value: Value<number>;
}

export class RingController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: RingView;
	private readonly unit_: RingUnit;
	private ox_ = 0;
	private ov_ = 0;

	constructor(doc: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);

		this.value = config.value;
		this.unit_ = config.unit;

		this.view = new RingView(doc, {
			formatter: config.formatter,
			seriesId: config.seriesId,
			unit: config.unit,
			value: this.value,
		});

		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onPointerDown_);
		ptHandler.emitter.on('move', this.onPointerMove_);
	}

	private onPointerDown_(ev: PointerHandlerEvent) {
		const data = ev.data;
		if (!data.point) {
			return;
		}

		this.ox_ = data.point.x;
		this.ov_ = this.value.rawValue;
	}

	private onPointerMove_(ev: PointerHandlerEvent) {
		const data = ev.data;
		if (!data.point) {
			return;
		}

		const dx = data.point.x - this.ox_;
		const uw = this.unit_.pixels;
		const uv = this.unit_.value;
		this.value.rawValue = this.ov_ - (dx / uw) * uv;
	}
}
