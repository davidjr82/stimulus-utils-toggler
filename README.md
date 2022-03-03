# stimulus-utils-toggler

Reusable toggler controller for Stimulus [Stimulus](https://stimulusjs.org/).
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```sh
$ yarn add @davidjr82/stimulus-utils-toggler
```

### Register the Controller

```js
import { Controller } from '@hotwired/stimulus';
import Toggler from 'stimulus-utils-toggler';
// ...
// Manually register `stimulus-utils-toggler` as a stimulus controller
application.register('toggler', Toggler);
```

## Usage

1. Attach the controller to an element. Recommended to attach to a top-level container, like `<body>` or `<main>` so it can be used anywhere.
    * **Example:**
    ```html
    <main data-controller="toggler">...</main>
    ```
2. Attach an `action` and a `data-[show|hide|toggle]` data attribute to an element that should _perform_ the toggling.
    * **Example:**
    ```html
    <button data-action='click->toggler#toggle touch->toggler#toggle' data-toggler-toggle="block1">Toggle</button>
    ```
    * More than one target element can be specified with spaces.
    * More than one action can be used in the same trigger.
    * **Example:**
    ```html
    <button data-action='click->toggler#toggle touch->toggler#toggle' data-toggler-toggle="block1 block2" data-toggler-show="block3" data-toggler-hide="block4 block5">Toggle 1 & 2, Show 3, Hide 4 & 5</button>
    ```

3. Attach a `data-toggler-name` to an element that should _be toggled_. The element is closed by default. If the element should start opened, add `data-toggler-open` to the element.
    * **Example:**
    ```html
    <div data-toggler-name="block1" data-toggler-open>Block 1</div>
    ```

### Toggle a single element

```html
<main data-controller="toggler">
  <button data-action="toggler#toggle" data-toggler-toggle="block1">
    Toggle Block 1
  </button>

    <div data-toggler-name="block1">
        <p>This is the block1</p>
    </div>
</main>
```

### Toggle multiple elements

```html
<main data-controller="toggler">
  <button data-action="toggler#toggle" data-toggler-toggle="block1 block2" data-toggler-show="block3"  data-toggler-hide="block4 block5">
    Toggle 1 & 2, Show 3, Hide 4 & 5
  </button>

    <div data-toggler-name="block1"><p>This is the block1</p></div>
    <div data-toggler-name="block2"><p>This is the block2</p></div>
    <div data-toggler-name="block3"><p>This is the block3</p></div>
    <div data-toggler-name="block4"><p>This is the block4</p></div>
    <div data-toggler-name="block5"><p>This is the block5</p></div>
</main>
```

### Test

```bash
npm run test
```

### Build public demo

```bash
npm run build
```


### License

- This project is licensed under the MIT License.

### Inspiration

- https://github.com/damonbauer/stimulus-toggle-util
