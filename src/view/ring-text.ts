import {ClassName, NumberTextView, View} from '@tweakpane/core';

import {RingView} from './ring.js';

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
