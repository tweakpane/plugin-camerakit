# tweakpane-plugin-camerakit
Enjoyable camera flavored controls for [Tweakpane].

![](https://user-images.githubusercontent.com/602961/128620339-ea6928a7-7d68-44b1-b298-a47b1a54abae.jpg)


## Installation


### Browser
```html
<script type="module">
import {Pane} from './tweakpane.min.js';
import * as TweakpaneCamerakitPlugin from 'tweakpane-plugin-camerakit.min.js';

const pane = new Pane();
pane.registerPlugin(TweakpaneCamerakitPlugin);
</script>
```


### Package
```js
import {Pane} from 'tweakpane';
import * as CamerakitPlugin from '@tweakpane/plugin-camerakit';

const pane = new Pane();
pane.registerPlugin(CamerakitPlugin);
```


## Usage
```js
// Ring input
pane.addBinding(params, 'key', {
  // Ring control
  view: 'cameraring',
  // Appearance of the ring view: 0 | 1 | 2
  series: 0,
});
```

```js
// Configuring a scale
pane.addBinding(params, 'key', {
  view: 'cameraring',
  series: 0,
  // Scale unit
  unit: {
    // Pixels for the unit
    pixels: 50,
    // Number of ticks for the unit
    ticks: 10,
    // Amount of a value for the unit
    value: 0.2,
  },
  // You can use `min`, `max`, `step` same as a number input
  min: 1,
  step: 0.02,
});
```

```js
// Wide
pane.addBinding(params, 'key', {
  view: 'cameraring',
  series: 0,
  // Hide a text input and widen the ring view
  wide: true,
});
```

```js
// Wheel input
pane.addBinding(params, 'key', {
  view: 'camerawheel',
  // Amount of a value per pixel
  amount: 100,
});
```


## Version compatibility

| Tweakpane | Camerakit |
| --------- | --------- |
| 4.x       | 0.3.x     |
| 3.x       | 0.2.x     |


[tweakpane]: https://github.com/cocopon/tweakpane/
