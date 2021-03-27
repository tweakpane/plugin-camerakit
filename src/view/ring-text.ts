import {ClassName} from 'tweakpane/lib/plugin/common/view/class-name';
import {View} from 'tweakpane/lib/plugin/common/view/view';
import {NumberTextView} from 'tweakpane/lib/plugin/input-bindings/number/view/number-text';

import {RingView} from './ring';

interface Config {
	ringView: RingView;
	textView: NumberTextView;
}

const className = ClassName('ckrtxt');

export class RingTextView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document, config: Config) {
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
}
