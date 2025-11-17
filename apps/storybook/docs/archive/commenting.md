# Storybook Commenting on Components

**Query:** commenting
**Timestamp:** 2025-11-17T08:22:14.631Z
**Library:** /storybookjs/storybook/v9.0.15

---

### MDX Comment Syntax

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-docs/mdx.mdx

This snippet shows the syntax for adding comments within an MDX file. Comments in MDX are essentially JSX blocks containing standard JavaScript comments.

```MDX
{ /* This is an MDX comment */ }
```

--------------------------------

### Storybook Info Addon: Component Declaration Comments

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.stories.txt

Illustrates how `@storybook/addon-info` extracts comments placed directly above the component declaration, rendering them below the Info Addon heading.

```JavaScript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BaseButton from '../components/BaseButton';

storiesOf('Addons|Info.React Docgen', module)
  .add(
    'Comments from component declaration',
    withInfo(
      'Comments above the component declaration should be extracted from the React component file itself and rendered below the Info Addon heading'
    )(() => <BaseButton label="Button" />)
  );
```

--------------------------------

### Storybook Info Addon: Flow Type Declaration Comments

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.stories.txt

Shows how `@storybook/addon-info` extracts comments from Flow type declarations to display them in the prop table within the Storybook Info Addon.

```JavaScript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import FlowTypeButton from '../components/FlowTypeButton';

storiesOf('Addons|Info.React Docgen', module)
  .add(
    'Comments from Flow declarations',
    withInfo(
      'Comments above the Flow declarations should be extracted from the React component file itself and rendered in the Info Addon prop table'
    )(() => <FlowTypeButton label="Flow Typed Button" />)
  );
```

--------------------------------

### JSX Example: JSDoc for Component Description

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/doc-blocks/doc-block-description.mdx

Demonstrates how to add JSDoc comments directly above a React functional component to provide a description that can be automatically picked up and displayed by the `Description` block.

```jsx
/**
 * The Button component shows a button
 */
export const Button = () => <button>Click me</button>;
```

--------------------------------

### Storybook Info Addon: React Docgen PropType Comments

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.stories.txt

Demonstrates how `@storybook/addon-info` extracts comments from React `PropType` declarations to populate the prop table in Storybook's Info Addon.

```JavaScript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import { DocgenButton } from '../components/DocgenButton';

storiesOf('Addons|Info.React Docgen', module)
  .add(
    'Comments from PropType declarations',
    withInfo(
      'Comments above the PropType declarations should be extracted from the React component file itself and rendered in the Info Addon prop table'
    )(() => <DocgenButton label="Docgen Button" />)
  );
```

--------------------------------

### Storybook Doc Block: Description

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-docs/doc-blocks.mdx

The `Description` block displays the description for a component, story, or meta, sourced from their respective JSDoc comments.

```APIDOC
Block: Description
Purpose: Display component/story/meta descriptions
Source: JSDoc comments
```

--------------------------------

### MDX2 automatic paragraph wrapping behavior

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/doc-blocks/doc-block-markdown.mdx

Explains how MDX2 automatically wraps text on newlines within HTML elements with `<p>` tags, demonstrating a key difference in rendering behavior compared to plain markdown.

```md
# A header

<div>
  Some text
</div>

The example above will remain as-is in plain markdown, but MDX2 will compile it to:

# A header

<div>
  <p>Some text</p>
</div>
```

--------------------------------

### Svelte Button Component

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/button-component-with-proptypes.md

Shows how to build a simple button component in Svelte, using `export let` for reactive `disabled` and `content` properties. JSDoc comments are used for component and prop documentation.

```js
<script>
  /**
   * A Button Component
   * @component
   */

  /**
   * Disable the button
   * @required
   */
  export let disabled = false;

  /**
   * Button content
   * @required
   */
  export let content = '';
<script/>

<button type="button" {disabled}>{content}</button>
```

--------------------------------

### Remove Next.js Addons from Storybook Configuration

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/nextjs-remove-addons.md

This snippet demonstrates how to remove or comment out the `storybook-addon-next` and `storybook-addon-next-router` addons from your Storybook configuration file (`.storybook/main.js` or `.storybook/main.ts`). These addons might be unnecessary or cause conflicts in certain Storybook setups.

```js
export default {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ]
};
```

```ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ]
};

export default config;
```

--------------------------------

### Composing Storybook Addons with New API (3.2)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Example demonstrating the composition of `withInfo` and `withNotes` using the new addons API introduced in Storybook 3.2, showing how to apply multiple decorators to a story.

```javascript
storiesOf("composition", module).add(
  "new addons api",
  withInfo("see Notes panel for composition info")(
    withNotes({ text: "Composition: Info(Notes())" })((context) => (
      <MyComponent name={context.story} />
    ))
  )
);
```