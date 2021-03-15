import {RingInputPlugin} from 'plugin-ring';
import {WheelInputPlugin} from 'plugin-wheel';
import Tweakpane from 'tweakpane';

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
