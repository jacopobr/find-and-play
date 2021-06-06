#  ![ancss](https://raw.githubusercontent.com/OnsenUI/ancss/master/misc/logo.png)

[![npm version](https://badge.fury.io/js/%40onsenui%2Fancss.svg)](https://www.npmjs.com/package/@onsenui/ancss)

## Installation

```
$ npm install @onsenui/ancss
```

## Example

`example.css`:

```css
/**
 * name: Button
 * class: button
 * markup: |
 *   <button class="button">Button</button>
 */
.button {
  display: inline-block;
  border: 1px solid #ddd;
  color: #ddd;
  padding: 8px 12px;
  font-size: 14px;
  text-decoration: none;
  background-color: transparent;
}
```

`example.js`:

```js
var ancss = require('ancss');

ancss.parseFile(__dirname + '/example.css', function(error, docs) {
  if (error) {
    throw error;
  }

  docs.forEach(function(doc) {
    console.log('name: ' + doc.annotation.name);
    console.log('markup: ' + doc.annotation.markup);
    console.log('css: \n' + doc.css);
  });
});
```

Output:

```
$ node example.js
name: Button
markup: <button class="button">Button</button>

css:
.button {
  display: inline-block;
  border: 1px solid #ddd;
  color: #ddd;
  padding: 8px 12px;
  font-size: 14px;
  text-decoration: none;
  background-color: transparent;
}
```

## License

The MIT License (MIT)

Copyright &copy; 2014, Mitsunori KUBOTA \<anatoo.jp@gmail.com\>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
