import Tweakpane from 'tweakpane';

import {RingInputPlugin} from './plugin-ring';
import {WheelInputPlugin} from './plugin-wheel';

{
	Tweakpane.registerPlugin({
		type: 'input',
		plugin: RingInputPlugin,
	});
	Tweakpane.registerPlugin({
		type: 'input',
		plugin: WheelInputPlugin,
	});
}
