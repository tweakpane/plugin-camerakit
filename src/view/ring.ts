import {
	ClassName,
	constrainRange,
	Formatter,
	removeElement,
	SVG_NS,
	Value,
	ValueEvents,
	View,
	ViewProps,
} from '@tweakpane/core';

/**
 * A configuration of a ring unit.
 */
export interface RingUnit {
	/**
	 * The number of pixels for the unit.
	 */
	pixels: number;
	/**
	 * The number of ticks for the unit.
	 */
	ticks: number;
	/**
	 * The value for the unit.
	 */
	value: number;
}

interface Config {
	formatters: {
		ring: Formatter<number>;
		text: Formatter<number>;
	};
	seriesId: string;
	showsTooltip: Value<boolean>;
	unit: RingUnit;
	value: Value<number>;
	viewProps: ViewProps;
}

const className = ClassName('ckr');

export class RingView implements View {
	public readonly element: HTMLElement;
	private readonly value_: Value<number>;
	private readonly unit_: RingUnit;
	private readonly offsetElem_: HTMLElement;
	private readonly svgElem_: SVGElement;
	private readonly formatters_: {
		ring: Formatter<number>;
		text: Formatter<number>;
	};
	private tickElems_: SVGLineElement[] = [];
	private labelElems_: HTMLElement[] = [];
	private tooltipElem_: HTMLElement;
	private boundsWidth_ = -1;

	constructor(doc: Document, config: Config) {
		this.onShowsTooltipChange_ = this.onShowsTooltipChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatters_ = config.formatters;
		this.unit_ = config.unit;

		this.element = doc.createElement('div');
		this.element.classList.add(
			className(),
			className(undefined, `m${config.seriesId}`),
		);
		config.viewProps.bindClassModifiers(this.element);

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_);

		config.showsTooltip.emitter.on('change', this.onShowsTooltipChange_);

		const wrapperElem = doc.createElement('div');
		wrapperElem.classList.add(className('w'));
		this.element.appendChild(wrapperElem);

		this.offsetElem_ = doc.createElement('div');
		this.offsetElem_.classList.add(className('o'));
		wrapperElem.appendChild(this.offsetElem_);

		this.svgElem_ = doc.createElementNS(SVG_NS, 'svg');
		this.svgElem_.classList.add(className('g'));
		this.offsetElem_.appendChild(this.svgElem_);

		this.tooltipElem_ = doc.createElement('div');
		this.tooltipElem_.classList.add(ClassName('tt')(), className('tt'));
		this.element.appendChild(this.tooltipElem_);

		this.waitToBeAdded_();
	}

	// Waits to be added to DOM tree to build initial scale elements
	private waitToBeAdded_(): void {
		const ob = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.target !== this.element || entry.intersectionRatio === 0) {
						return;
					}
					this.update();
					ob.disconnect();
				});
			},
			{
				root: null,
			},
		);
		ob.observe(this.element);
	}

	private rebuildScaleIfNeeded_(bw: number): void {
		if (this.boundsWidth_ === bw) {
			return;
		}
		this.boundsWidth_ = bw;

		this.tickElems_.forEach((elem) => {
			removeElement(elem);
		});
		this.tickElems_ = [];

		this.labelElems_.forEach((elem) => {
			removeElement(elem);
		});
		this.labelElems_ = [];

		const doc = this.element.ownerDocument;
		const tpu = this.unit_.ticks;
		const uw = this.unit_.pixels;
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
		const unitCount = halfUnitCount * 2 + 1;
		const tickCount = unitCount * tpu;
		const tickWidth = uw / tpu;
		for (let i = 0; i < tickCount; i++) {
			const x = i * tickWidth;
			if (i % tpu === 0) {
				const lineElem = doc.createElementNS(SVG_NS, 'line');
				lineElem.classList.add(className('mjt'));
				lineElem.setAttributeNS(null, 'x1', String(x));
				lineElem.setAttributeNS(null, 'y1', '0');
				lineElem.setAttributeNS(null, 'x2', String(x));
				lineElem.setAttributeNS(null, 'y2', '2');
				this.svgElem_.appendChild(lineElem);
				this.tickElems_.push(lineElem);

				const labelElem = doc.createElement('div');
				labelElem.classList.add(className('l'));
				labelElem.style.left = `${x}px`;
				this.offsetElem_.appendChild(labelElem);
				this.labelElems_.push(labelElem);
			} else {
				const lineElem = doc.createElementNS(SVG_NS, 'line');
				lineElem.classList.add(className('mnt'));
				lineElem.setAttributeNS(null, 'x1', String(x));
				lineElem.setAttributeNS(null, 'y1', '0');
				lineElem.setAttributeNS(null, 'x2', String(x));
				lineElem.setAttributeNS(null, 'y2', '2');
				this.svgElem_.appendChild(lineElem);
				this.tickElems_.push(lineElem);
			}
		}
	}

	private updateScale_(bw: number): void {
		const uv = this.unit_.value;
		const uw = this.unit_.pixels;
		const v = this.value_.rawValue;
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
		const ov = v - (v % uv) - uv * halfUnitCount;
		const opacity = (tv: number): number => {
			return (
				1 -
				Math.pow(
					constrainRange(Math.abs(v - tv) / ((bw / 2) * (uv / uw)), 0, 1),
					10,
				)
			);
		};

		this.labelElems_.forEach((elem, i) => {
			const lv = ov + i * uv;
			elem.textContent = this.formatters_.ring(lv);
			elem.style.opacity = String(opacity(lv));
		});

		const tpu = this.unit_.ticks;
		this.tickElems_.forEach((elem, i) => {
			const lv = ov + (i / tpu) * uv;
			elem.style.opacity = String(opacity(lv));
		});
	}

	public update(): void {
		const bw = this.element.getBoundingClientRect().width;
		const uv = this.unit_.value;
		const uw = this.unit_.pixels;
		const v = this.value_.rawValue;
		const halfUnitCount = Math.ceil(bw / 2 / uw) + 1;
		const offsetFromCenter = ((v % uv) + uv * halfUnitCount) * (uw / uv);
		const offset = bw / 2 - offsetFromCenter;
		this.offsetElem_.style.transform = `translateX(${offset}px)`;

		this.tooltipElem_.textContent = this.formatters_.text(v);

		this.rebuildScaleIfNeeded_(bw);
		this.updateScale_(bw);
	}

	private onValueChange_() {
		this.update();
	}

	private onShowsTooltipChange_(ev: ValueEvents<boolean>['change']) {
		if (ev.rawValue) {
			this.element.classList.add(className(undefined, 'tt'));
		} else {
			this.element.classList.remove(className(undefined, 'tt'));
		}
	}
}
