# @davidjr82/stimulus-utils-toggler

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
import Toggler from '@davidjr82/stimulus-utils-toggler';
// ...
// Manually register `@davidjr82/stimulus-utils-toggler` as a stimulus controller
application.register('toggler', Toggler);
```

## Usage

1. Attach the controller to an element. Recommended to attach to a top-level container, like `<body>` or `<main>` so it can be used anywhere.
  * `data-action="click@window->toggler#hideOutside touch@window->toggler#hideOutside"` can be attached to top-level container to use the "hide on click away" utility.
    * **Example:**
    ```html
    <main data-controller="toggler" data-action="click@window->toggler#hideOutside touch@window->toggler#hideOutside">...</main>
    ```
2. Attach an `action` and a `data-[show|hide|toggle]` data attribute to an element that should _perform_ the toggling.
    * **Example:**
    ```html
    <button data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block1">Toggle</button>
    ```
    * More than one target element can be specified with spaces.
    * More than one action can be used in the same trigger.
    * **Example:**
    ```html
    <button data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block1 block2" data-toggler-show="block3" data-toggler-hide="block4 block5">Toggle 1 & 2, Show 3, Hide 4 & 5</button>
    ```
    * `toggle#all` executes toggle, show and hide, but `toggle#show`, `toggle#hide`, `toggle#toggle` can be called alone
    * **Example:**
    ```html
    <button data-action='click->toggler#all touch->toggler#all click@window->toggler#hide touch@window->toggler#hide' data-toggler-toggle="block4" data-toggler-hide="block4">Toggle 4 and hide when click outside</button>
    ```

3. Attach a `data-toggler-name` to an element that should _be toggled_. The element is closed by default. If the element should start opened, add `data-toggler-open` to the element.
    * **Example:**
    ```html
    <div data-toggler-name="block1" data-toggler-open>Block 1</div>
    ```

3. Attach a `data-toggler-hide-outside="dropdown1"` to an element if is wanted that, when clicked outside that element, _other element_ is wanted _to be hidden_.
    * Can be used within multiple elements `data-toggler-hide-outside="dropdown1 dropdown2 sidebar3"`
    * **Example:**
    ```html
    <div data-toggler-hide-outside="dropdown1">When clicking outside this element, data-togler-name="dropdown1" will be hidden</div>
    ```

### Toggle a single element

```html
<main data-controller="toggler">
  <button data-action="toggler#all" data-toggler-toggle="block1">
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
  <button data-action="toggler#all" data-toggler-toggle="block1 block2" data-toggler-show="block3"  data-toggler-hide="block4 block5">
    Toggle 1 & 2, Show 3, Hide 4 & 5
  </button>

    <div data-toggler-name="block1"><p>This is the block1</p></div>
    <div data-toggler-name="block2"><p>This is the block2</p></div>
    <div data-toggler-name="block3"><p>This is the block3</p></div>
    <div data-toggler-name="block4"><p>This is the block4</p></div>
    <div data-toggler-name="block5"><p>This is the block5</p></div>
</main>
```

### Using as tabs

```html
<main data-controller="toggler">
    <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 mx-auto">

            <div
                data-action="click->toggler#all touch->toggler#all"
                data-toggler-tab="tab-demo"
                data-toggler-show="tab-demo-content-1"
                data-toggler-on-class="border-purple-500 text-purple-600"
                data-toggler-off-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                class="cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 font-medium"
                data-toggler-open>
                Tab 1 </div>

            <div
                data-action="click->toggler#all touch->toggler#all"
                data-toggler-tab="tab-demo"
                data-toggler-show="tab-demo-content-2"
                data-toggler-on-class="border-purple-500 text-purple-600"
                data-toggler-off-class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                class="cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 font-medium">
                Tab 2 </div>
        </nav>
    </div>

    <div data-toggler-name="tab-demo-content-1" data-toggler-open>
        Tab 1 Content
    </div>
    <div data-toggler-name="tab-demo-content-2">
        Tab 2 Content
    </div>
</main>
```

### Debug on production

```html
<main data-controller="toggler" data-toggler-debug-value>
    ...
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

### To DO

- Tests dispatch events feature
- Add data-toggler-target to react when new item is added to dom

### License

- This project is licensed under the MIT License.

### Inspiration

- https://github.com/damonbauer/stimulus-toggle-util
