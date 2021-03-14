import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {mapRange} from 'tweakpane/lib/plugin/common/number-util';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';

interface Config {
	value: Value<number>;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('tmp');

// Custom view class should implement `ValueView` interface
export class PluginView implements ValueView<number> {
	public readonly element: HTMLElement;
	public readonly value: Value<number>;
	private dotElems_: HTMLElement[] = [];
	private textElem_: HTMLElement;

	constructor(doc: Document, config: Config) {
		// Create a root element for the plugin
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		// Receive the bound value from the controller
		this.value = config.value;
		// Handle 'change' event of the value
		this.value.emitter.on('change', this.onValueChange_.bind(this));

		// Create child elements
		this.textElem_ = doc.createElement('div');
		this.textElem_.classList.add(className('text'));
		this.element.appendChild(this.textElem_);

		// Apply the initial value
		this.update();
	}

	// Use this method to apply the current value to the view
	public update(): void {
		const rawValue = this.value.rawValue;

		this.textElem_.textContent = rawValue.toFixed(2);

		while (this.dotElems_.length > 0) {
			const elem = this.dotElems_.shift();
			if (elem) {
				this.element.removeChild(elem);
			}
		}

		const doc = this.element.ownerDocument;
		const dotCount = Math.floor(rawValue);
		for (let i = 0; i < dotCount; i++) {
			const dotElem = doc.createElement('div');
			dotElem.classList.add(className('dot'));

			if (i === dotCount - 1) {
				const fracElem = doc.createElement('div');
				fracElem.classList.add(className('frac'));
				const frac = rawValue - Math.floor(rawValue);
				fracElem.style.width = `${frac * 100}%`;
				fracElem.style.opacity = String(mapRange(frac, 0, 1, 1, 0.2));
				dotElem.appendChild(fracElem);
			}

			this.dotElems_.push(dotElem);
			this.element.appendChild(dotElem);
		}
	}

	private onValueChange_() {
		this.update();
	}
}
