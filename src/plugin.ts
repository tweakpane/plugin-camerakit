import Tweakpane from 'tweakpane';
import {InputParams} from 'tweakpane/lib/api/types';
import {BindingTarget} from 'tweakpane/lib/plugin/common/binding/target';
import {CompositeConstraint} from 'tweakpane/lib/plugin/common/constraint/composite';
import {InputBindingPlugin} from 'tweakpane/lib/plugin/input-binding';
import {
	createRangeConstraint,
	createStepConstraint,
} from 'tweakpane/lib/plugin/input-bindings/number/plugin';

import {PluginController} from './controller';

{
	// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
	//
	// `InputBindingPlugin<In, Ex>` means...
	// - The plugin receives the bound value as `Ex`,
	// - converts `Ex` into `In` and holds it
	//
	const plugin: InputBindingPlugin<number, number> = {
		id: 'input-template',

		// This plugin template injects a compiled CSS by @rollup/plugin-replace
		// See rollup.config.js for details
		css: '__css__',

		accept(exValue: unknown, params: InputParams) {
			if (typeof exValue !== 'number') {
				// Return null to deny the user input
				return null;
			}

			// `view` option may be useful to provide a custom control for primitive values
			if (params.view !== 'dots') {
				return null;
			}

			// Return a typed value to accept the user input
			return exValue;
		},

		binding: {
			reader(_args) {
				return (exValue: unknown): number => {
					// Convert an external unknown value into the internal value
					return typeof exValue === 'number' ? exValue : 0;
				};
			},

			constraint(args) {
				// Create a value constraint from the user input
				const constraints = [];
				// You can reuse existing functions of the default plugins
				const cr = createRangeConstraint(args.params);
				if (cr) {
					constraints.push(cr);
				}
				const cs = createStepConstraint(args.params);
				if (cs) {
					constraints.push(cs);
				}
				// Use `CompositeConstraint` to combine multiple constraints
				return new CompositeConstraint(constraints);
			},

			equals: (inValue1: number, inValue2: number) => {
				// Simply use `===` to compare primitive values,
				// or a custom comparator for complex objects
				return inValue1 === inValue2;
			},

			writer(_args) {
				return (target: BindingTarget, inValue) => {
					// Use `target.write()` to write the primitive value to the target,
					// or `target.writeProperty()` to write a property of the target
					target.write(inValue);
				};
			},
		},

		controller(args) {
			// Create a controller for the plugin
			return new PluginController(args.document, {
				value: args.value,
			});
		},
	};

	// Register the plugin to Tweakpane
	Tweakpane.registerPlugin({
		// type: The plugin type.
		// - 'input': Input binding
		// - 'monitor': Monitor binding
		type: 'input',

		// plugin: Configurations of the plugin.
		plugin: plugin,
	});
}
