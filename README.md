# Tweakpane plugin template
This is a plugin template of an input binding for [Tweakpane][tweakpane].


## Quick start
- Install dependencies:
  ```
  % npm install
  ```
- Build source codes and watch changes:
  ```
  % npm start
  ```
- Open `test/browser.html` to see the result.


## File structure
```
|- src
|  |- sass ............ Plugin CSS
|  |- plugin.ts ....... Entrypoint
|  |- controller.ts ... Controller for the custom view
|  `- view.ts ......... Custom view
|- dist ............... Compiled files
`- test
   `- browser.html .... Plugin labo
```

## Plugin registration


### Browser
```html
<script src="tweakpane.min.js"></script>
<scirpt src="tweakpane-plugin-template.min.js"></script>
<script>
  const pane = new Tweakpane();
  // ...
</script>
```


### Node.js
```js
import Tweakpane from 'tweakpane';
import 'tweakpane-plugin-template';

const pane = new Tweakpane();
// ...
```


[tweakpane]: https://github.com/cocopon/tweakpane/
