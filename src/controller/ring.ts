import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Formatter} from 'tweakpane/lib/plugin/common/converter/formatter';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ViewProps} from 'tweakpane/lib/plugin/common/model/view-props';
import {
	PointerHandler,
	PointerHandlerEvent,
} from 'tweakpane/lib/plugin/common/view/pointer-handler';

import {RingUnit, RingView} from '../view/ring';

interface Config {
	formatters: {
		ring: Formatter<number>;
		text: Formatter<number>;
	};
	tooltipEnabled: boolean;
	seriesId: string;
	unit: RingUnit;
	value: Value<number>;
	viewProps: ViewProps;
}

export class RingController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: RingView;
	public readonly viewProps: ViewProps;
	private readonly unit_: RingUnit;
	private readonly showsTooltip_: Value<boolean>;
	private readonly tooltipEnabled_: boolean;
	private ox_ = 0;
	private ov_ = 0;

	constructor(doc: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;
		this.tooltipEnabled_ = config.tooltipEnabled;
		this.unit_ = config.unit;

		this.showsTooltip_ = new Value<boolean>(false);
		this.view = new RingView(doc, {
			formatters: config.formatters,
			seriesId: config.seriesId,
			showsTooltip: this.showsTooltip_,
			unit: config.unit,
			value: this.value,
			viewProps: this.viewProps,
		});

		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onPointerDown_);
		ptHandler.emitter.on('move', this.onPointerMove_);
		ptHandler.emitter.on('up', this.onPointerUp_);
	}

	private onPointerDown_(ev: PointerHandlerEvent) {
		const data = ev.data;
		if (!data.point) {
			return;
		}

		this.ox_ = data.point.x;
		this.ov_ = this.value.rawValue;
		if (this.tooltipEnabled_) {
			this.showsTooltip_.rawValue = true;
		}
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

	private onPointerUp_() {
		this.showsTooltip_.rawValue = false;
	}
}
