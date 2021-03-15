import {Value} from 'tweakpane/lib/plugin/common/model/value';
import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {ValueView} from 'tweakpane/lib/plugin/common/view/value';
import {NumberTextView} from 'tweakpane/lib/plugin/input-bindings/number/view/number-text';

import {RingView} from './ring';

interface Config {
	ringView: RingView;
	textView: NumberTextView;
	value: Value<number>;
}

const className = ClassName('ckrtxt');

export class RingTextView implements ValueView<number> {
	public readonly element: HTMLElement;
	public readonly value: Value<number>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const ringElem = doc.createElement('div');
		ringElem.classList.add(className('r'));
		ringElem.appendChild(config.ringView.element);
		this.element.appendChild(ringElem);

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		textElem.appendChild(config.textView.element);
		this.element.appendChild(textElem);
	}

	public update(): void {}
}
