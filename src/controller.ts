import {ValueController} from 'tweakpane/lib/plugin/common/controller/value';
import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {constrainRange} from 'tweakpane/lib/plugin/common/number-util';
import {
	PointerHandler,
	PointerHandlerEvent,
} from 'tweakpane/lib/plugin/common/view/pointer-handler';

import {PluginView} from './view';

interface Config {
	value: Value<number>;
}

// Custom controller class should implement `ValueController` interface
export class PluginController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: PluginView;

	constructor(doc: Document, config: Config) {
		this.onPoint_ = this.onPoint_.bind(this);

		// Receive the bound value from the plugin
		this.value = config.value;

		// Create a custom view
		this.view = new PluginView(doc, {
			value: this.value,
		});

		// You can use `PointerHandler` to handle pointer events in the same way as Tweakpane do
		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onPoint_);
		ptHandler.emitter.on('move', this.onPoint_);
		ptHandler.emitter.on('up', this.onPoint_);
	}

	private onPoint_(ev: PointerHandlerEvent) {
		const data = ev.data;
		if (!data.point) {
			return;
		}

		// Update the value by user input
		const dx =
			constrainRange(data.point.x / data.bounds.width + 0.05, 0, 1) * 10;
		const dy = data.point.y / 10;
		this.value.rawValue = Math.floor(dy) * 10 + dx;
	}
}
