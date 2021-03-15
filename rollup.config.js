import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import NodeSass from 'node-sass';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import {terser as Terser} from 'rollup-plugin-terser';

import Package from './package.json';

async function compileCss() {
	const css = NodeSass.renderSync({
		file: 'src/sass/plugin.scss',
		outputStyle: 'compressed',
	}).css.toString();

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		// NOTE: `paths` should be set to avoid unexpected type confliction
		// https://github.com/Microsoft/typescript/issues/6496
		Typescript({
			tsconfig: 'src/tsconfig.json',
		}),
		Replace({
			__css__: css,
			preventAssignment: false,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
	];
}

function getUmdName(packageName) {
	return packageName
		.split('-')
		.map((comp) => comp.charAt(0).toUpperCase() + comp.slice(1))
		.join('');
}

export default async () => {
	const production = process.env.BUILD === 'production';
	const postfix = production ? '.min' : '';

	const css = await compileCss();
	return {
		input: 'src/index.ts',
		external: ['tweakpane'],
		output: {
			file: `dist/${Package.name}${postfix}.js`,
			format: 'umd',
			globals: {
				tweakpane: 'Tweakpane',
			},
			name: getUmdName(Package.name),
		},
		plugins: getPlugins(css, production),

		// Suppress `Circular dependency` warning
		onwarn(warning, rollupWarn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			rollupWarn(warning);
		},
	};
};
