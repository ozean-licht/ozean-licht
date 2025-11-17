# Storybook Commenting on Components

**Query:** commenting
**Timestamp:** 2025-11-16T19:37:32.703Z
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

### in progress label

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MAINTAINERS.md

Marks an issue or pull request that is currently under review or actively being worked on by the author. This provides transparency on the status of ongoing tasks.

```APIDOC
Label: in progress
Description: Issue or pull request that is currently being reviewed or worked on with the author
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

### Simulate Typing with userEvent.type()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

Writes text inside inputs or textareas.

```JavaScript
await userEvent.type(<element>, 'Some text');
```

--------------------------------

### Steps to Create Issue Reproduction in Storybook Monorepo

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING.old.md

A step-by-step guide to create a minimal, reproducible example of an issue within the Storybook monorepo. This process involves cloning the repository, setting up dependencies, making changes, committing the reproduction, and pushing it to a personal fork for sharing with maintainers.

```sh
# Download and build this repository:
git clone https://github.com/storybookjs/storybook.git
cd storybook
yarn
yarn bootstrap --core

# make changes to try and reproduce the problem, such as adding components + stories
cd examples/official-storybook
yarn storybook

# see if you can see the problem, if so, commit it:
git checkout "branch-describing-issue"
git add -A
git commit -m "reproduction for issue #123"

# fork the storybook repo to your account, then add the resulting remote
git remote add <your-username> https://github.com/<your-username>/storybook.git
git push -u <your-username> next
```

--------------------------------

### Remove Next.js Addons from Storybook Configuration

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/nextjs-vite-remove-addons.md

This snippet demonstrates how to update your Storybook `main.js` or `main.ts` configuration file to remove or comment out the `storybook-addon-next` and `storybook-addon-next-router` addons. This might be necessary if these addons are no longer required or cause conflicts with newer Storybook versions or Next.js setups.

```js
export default {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ],
};
```

```ts
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ],
};

export default config;
```

--------------------------------

### Expose Component Properties and Methods in Vue 3

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/get-started/frameworks/vue3-vite.mdx

This Vue 3 component example illustrates how to expose reactive properties and methods using `defineExpose`. The exposed items, along with their JSDoc comments, are automatically extracted by Storybook and displayed in the Controls panel, enhancing component discoverability and documentation.

```HTML
<script setup lang="ts">
  import { ref } from 'vue';

  const label = ref('Button');
  const count = ref(100);

  defineExpose({
    /** A label string */
    label,
    /** A count number */
    count
  });
</script>
```

--------------------------------

### Define Slots with TypeScript and JSDoc in Vue 3

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/get-started/frameworks/vue3-vite.mdx

This TypeScript snippet demonstrates using `defineSlots` with JSDoc comments to explicitly describe each slot's props. This approach provides rich type information for Storybook, enabling accurate control generation and improved documentation for component slots.

```TypeScript
defineSlots<{
  /** Example description for default */
  default(props: { num: number }): any;
  /** Example description for named */
  named(props: { str: string }): any;
  /** Example description for no-bind */
  noBind(props: {}): any;
  /** Example description for vbind */
  vbind(props: { num: number; str: string }): any;
}>();
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

--------------------------------

### Define Emitted Events with TypeScript in Vue 3

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/get-started/frameworks/vue3-vite.mdx

This Vue 3 component example demonstrates how to define custom emitted events using TypeScript interfaces and JSDoc comments within `defineEmits`. This setup allows Storybook to automatically extract event types and generate corresponding controls for documentation.

```HTML
<script setup lang="ts">
  type MyChangeEvent = 'change';

  interface MyEvents {
    /** Fired when item is changed */
    (event: MyChangeEvent, item?: Item): void;
    /** Fired when item is deleted */
    (event: 'delete', id: string): void;
    /** Fired when item is upserted into list */
    (e: 'upsert', id: string): void;
  }

  const emit = defineEmits<MyEvents>();
</script>
```

--------------------------------

### Register Storybook Addon in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/getting-started/emotion.md

Configuration example for registering the `@storybook/addon-themes` in the `.storybook/main.js` file by adding it to the `addons` array.

```javascript
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes'
  ]
};
```

--------------------------------

### Add Description to Individual Story in Storybook Docs

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/docs/docs/recipes.md

Shows how to add a specific description for an individual story that will be displayed in Storybook Docs. The `docs.description.story` parameter accepts a string, which can include Markdown markup for rich text formatting.

```javascript
const Example = () => <Button />;

Example.parameters = {
  docs: {
    description: {
      story: 'Individual story description, may contain `markdown` markup'
    }
  }
};
```

--------------------------------

### Storybook Component Definition with Documentation Overrides

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/api-doc-block-description-example.md

This snippet defines a Storybook component, 'demo-button', and demonstrates how to override its default documentation description using the 'parameters.docs.description.component' property. This allows for custom, explicit documentation directly within the story file, overriding any JSDoc comments on the component itself.

```js
/**
 * Button stories
 * These stories showcase the button
 */
export default {
  title: 'Button',
  component: 'demo-button',
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments',
      },
    },
  },
};
```

```ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';

/**
 * Button stories
 * These stories showcase the button
 */
const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments',
      },
    },
  },
};

export default meta;
```

--------------------------------

### Define Component in Story Metadata (ESM Syntax)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/docs/ember/README.md

Associates a story with its corresponding component by setting the `component` field in the story's default export metadata. The string value should match the `@class` name used in your component's source comments, enabling accurate documentation generation.

```TypeScript
export default {
  title: 'App Component',
  component: 'AppComponent'
};
```

--------------------------------

### needs more info label

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MAINTAINERS.md

Applied to issues or bugs that require additional context, details, or clarification from the original author to proceed with investigation or resolution. This prompts for necessary information.

```APIDOC
Label: needs more info
Description: Issue, or bug that requires additional context from the author
```

--------------------------------

### help wanted label

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MAINTAINERS.md

Indicates an issue or bug that requires additional assistance or input from the community to resolve. This encourages broader participation and collaboration in finding solutions.

```APIDOC
Label: help wanted
Description: Issue, or bug that requires additional help from the community
```

--------------------------------

### Storybook Primary Button Story with Documentation Overrides

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/api-doc-block-description-example.md

This snippet defines the 'Primary' story for the 'demo-button' component. It illustrates how to override the story's documentation description using the 'parameters.docs.description.story' property, providing specific documentation for individual stories that overrides any JSDoc comments on the story export.

```js
/**
 * # Button stories
 * These stories showcase the button
 */
export const Primary = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

```ts
type Story = StoryObj;

/**
 * Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

--------------------------------

### needs reproduction label

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MAINTAINERS.md

Indicates an issue or bug that cannot be investigated or fixed without a clear, reproducible example. This prompts the author to provide a minimal reproduction case.

```APIDOC
Label: needs reproduction
Description: Issue, or bug that requires a reproduction to be looked at
```

--------------------------------

### Empty JavaScript Preset Configuration for Storybook

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-storysource-manager-entries.md

This snippet illustrates a `preset.js` file, typically used for Storybook addon configuration (e.g., for the `storysource` addon). The file contains only a comment, indicating that no specific JavaScript configuration or setup is required or defined within this particular preset, serving as a placeholder or default empty configuration.

```javascript
/* nothing needed */
```

--------------------------------

### Define Props with JSDoc for vue-component-meta

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/get-started/frameworks/vue3-vite.mdx

This Vue Single File Component (SFC) example illustrates how to define component props using TypeScript interfaces and `withDefaults`, incorporating JSDoc comments for prop descriptions and tags. These JSDoc annotations are then utilized by `vue-component-meta` to automatically generate rich controls and documentation within Storybook, enhancing the developer experience.

```html
<script setup lang="ts">
  interface MyComponentProps {
    /** The name of the user */
    name: string;
    /**
      * The category of the component
      *
      * @since 8.0.0
      */
    category?: string;
  }

  withDefaults(defineProps<MyComponentProps>(), {
    category: 'Uncategorized',
  });
</script>
```

--------------------------------

### Storybook Component Testing: Save Flow Interaction and Assertion

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-test-fn-mock-spy.md

These snippets demonstrate how to write a Storybook play function to test a 'save' interaction for a UI component. It involves simulating a user clicking a 'done' button and then asserting that a mocked backend function (`saveNote`) was called. Examples are provided for generic Storybook frameworks (e.g., React, Vue) and Web Components, in both TypeScript and JavaScript.

```ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';

import { expect } from 'storybook/test';

// ⬇️ Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote }m '#app/actions.mock';
import { createNotes } from '#mocks/notes';

import NoteUI from './note-ui';

const meta = { component: NoteUI } satisfies Meta<typeof NoteUI>;
export default meta;

type Story = StoryObj<typeof meta>;

const notes = createNotes();

export const SaveFlow: Story = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // ⬇️ This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```js
import { expect } from 'storybook/test';

import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

export default {
  component: 'note-ui',
};

const notes = createNotes();

export const SaveFlow = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // ⬇️ This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { expect } from 'storybook/test';

// ⬇️ Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

const meta: Meta = {
  component: 'note-ui',
};
export default meta;

type Story = StoryObj;

const notes = createNotes();

export const SaveFlow: Story = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // ⬇️ This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

--------------------------------

### Trigger Storybook Canary Release Workflow via GitHub CLI

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

This command initiates a GitHub Actions workflow to create a canary release for a specific pull request in the Storybook repository. It requires the 'gh' CLI tool and the pull request number as an input field. Upon success, it updates the PR with release information; upon failure, it comments on the PR, tagging the triggering actor.

```bash
gh workflow run --repo storybookjs/storybook canary-release-pr.yml --field pr=<PR_NUMBER>
```

--------------------------------

### API Reference: withThemeByDataAttribute Options

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/api.md

Detailed options for the `withThemeByDataAttribute` decorator, including types, required status, and descriptions for each parameter.

```APIDOC
themes:
  type: Record<string, string>
  required: true
  description: An object of theme configurations where the key is the name of the theme and the value is the data attribute value.
defaultTheme:
  type: string
  required: true
  description: The name of the default theme to use
parentSelector:
  type: string
  required: false
  description: The selector for the parent element that you want to apply your theme class to. Defaults to "html"
attributeName:
  type: string
  required: false
  description: The name of the data attribute to set on the parent element for your theme(s). Defaults to "data-theme"
```

--------------------------------

### Create New Git Branch for Code Snippets

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/contribute/documentation/new-snippets.mdx

Command to create a new local Git branch for contributing code snippets to the Storybook monorepo.

```shell
git checkout -b code-snippets-for-framework
```

--------------------------------

### Code Snippet `renderer` Attribute for Common Examples Syntax

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/contribute/documentation/new-snippets.mdx

Illustrates the Markdown syntax for using the `renderer` attribute with the value `common` to signify that a code snippet is framework-agnostic and applies to multiple frameworks.

```md
````md title="docs/_snippets/button-stories.md"
```ts filename="Button.stories.ts" language="ts" renderer="common"
```
````
```

--------------------------------

### MDX Story Example for Debugging

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/docs/docs/faq.md

An example of an MDX story demonstrating a simple button with an action. This snippet illustrates how MDX compiles to JavaScript, which can then be inspected in browser developer tools for debugging purposes.

```MDX
<Story name="solo story">
  <Button onClick={action('clicked')}>solo</Button>
</Story>
```

--------------------------------

### Simulate User Input and Assert Callback in Storybook Play Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-interactions-play-function.md

This core logic demonstrates how to interact with UI elements (typing into inputs, clicking buttons) and assert that a specific callback function (e.g., `onSubmit`) was invoked within a Storybook `play` function. It utilizes `userEvent` for simulating interactions and `waitFor` with `expect` for asynchronous assertions.

```js
await step('Enter credentials', async () => {
  await userEvent.type(canvas.getByTestId('email'), 'hi@example.com');
  await userEvent.type(canvas.getByTestId('password'), 'supersecret');
});

await step('Submit form', async () => {
  await userEvent.click(canvas.getByRole('button'));
});

// 👇 Now we can assert that the onSubmit arg was called
await waitFor(() => expect(args.onSubmit).toHaveBeenCalled());
```

--------------------------------

### Install Storybook Addon Themes

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/getting-started/emotion.md

Instructions for installing the `@storybook/addon-themes` package as a development dependency using yarn, npm, or pnpm.

```zsh
yarn add -D @storybook/addon-themes
```

```npm
npm install -D @storybook/addon-themes
```

```pnpm
pnpm add -D @storybook/addon-themes
```

--------------------------------

### Provide Themes and Global Styles to Storybook Preview

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/getting-started/emotion.md

Example demonstrating how to integrate custom themes and global styles into Storybook's preview configuration using `withThemeFromJSXProvider` from `@storybook/addon-themes`. It shows importing necessary components and configuring the `decorators` array.

```typescript
import { Preview, Renderer } from '@storybook/your-renderer';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from '@emotion/react';
import { GlobalStyles, lightTheme, darkTheme } from '../src/themes'; // Import your custom theme configs


const preview: Preview = {
  parameters: { /* ... */ },
  decorators: [
   withThemeFromJSXProvider<Renderer>({
     themes: {
       light: lightTheme,
       dark: darkTheme
     },
     defaultTheme: 'light',
     Provider: ThemeProvider,
     GlobalStyles: GlobalStyles
   })
  ]
};

export default preview;
```

--------------------------------

### Example `canvas` queries using Testing Library

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

Demonstrates common `canvas` query patterns using `findByRole`, `getByText`, and `getAllByRole` to interact with UI elements in Storybook's play function.

```JavaScript
// Find the first element with a role of button with the accessible name "Submit"\nawait canvas.findByRole('button', { name: 'Submit' });\n\n// Get the first element with the text "An example heading"\ncanvas.getByText('An example heading');\n\n// Get all elements with the role of listitem\ncanvas.getAllByRole('listitem');
```

--------------------------------

### Testing Library Query Subjects Reference

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

A comprehensive list of query subjects (e.g., `ByRole`, `ByLabelText`, `ByTestId`) used in conjunction with query types to precisely locate elements within the DOM.

```APIDOC
Query Subjects:\n  - ByRole: Find elements by their accessible role\n  - ByLabelText: Find elements by their associated label text\n  - ByPlaceholderText: Find elements by their placeholder value\n  - ByText: Find elements by the text they contain\n  - ByDisplayValue: Find input, textarea, or select elements by their current value\n  - ByAltText: Find elements with the given alt attribute value\n  - ByTitle: Find elements with the given title attribute value\n  - ByTestId: Find elements with the given data-testid attribute value
```

--------------------------------

### Storybook Info Addon: Markdown in Description

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.stories.txt

Demonstrates the capability of `withInfo()` to render Markdown content within its description, including embedded code examples and links.

```JavaScript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BaseButton from '../components/BaseButton';

const markdownDescription = `
#### You can use markdown in your withInfo() description.

Sometimes you might want to manually include some code examples:
~~~js
const Button = () => <button />;
~~~

Maybe include a [link](http://storybook.js.org) to your project as well.
`;

storiesOf('Addons|Info.Markdown', module).add(
  'Displays Markdown in description',
  withInfo(markdownDescription)(() => <BaseButton label="Button" />)
);
```

--------------------------------

### Basic SCSS Variable and Nesting Syntax

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/my-component-with-global-syntax-highlight.md

This SCSS snippet demonstrates fundamental SCSS features, including variable declaration (`$font-stack`, `$primary-color`) and basic CSS nesting for the `body` element. It's presented as a standalone code example extracted from an MDX documentation file.

```SCSS
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
font: 100% $font-stack;
  color: $primary-color;
}
```

--------------------------------

### Correct: Using `satisfies Meta` with named constant

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/lib/eslint-plugin/docs/rules/meta-satisfies-type.md

This TypeScript example demonstrates the correct application of `satisfies Meta` when defining a Storybook meta object as a named constant before exporting it. This method provides the necessary type information for Storybook's type-checker, enabling comprehensive type safety and consistency.

```TypeScript
const meta = {
  title: 'Button',
  args: { primary: true },
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;
```

--------------------------------

### Importing and Displaying Raw Markdown in Storybook

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/docs/src/blocks/examples/Markdown-content.md

This snippet shows the necessary imports and JSX structure to render raw Markdown content. It uses the `?raw` suffix for importing the Markdown file as a string and the `<Markdown>` component from `@storybook/addon-docs/blocks` to display it.

```JSX
import { Markdown } from '@storybook/addon-docs/blocks';
import content from './Markdown-content.md?raw';

<Markdown>{content}</Markdown>
```

--------------------------------

### Incorrect: Using type annotation for Storybook Meta object

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/lib/eslint-plugin/docs/rules/meta-satisfies-type.md

This TypeScript example demonstrates defining a Storybook meta object using a direct type annotation (`const meta: Meta<typeof Button> = {...}`). While syntactically valid, this approach hides crucial type information from Storybook's internal type-checking mechanisms, hindering advanced type safety features for related types like `StoryObj`.

```TypeScript
const meta: Meta<typeof Button> = {
  title: 'Button',
  args: { primary: true },
  component: Button,
};
export default meta;
```

--------------------------------

### Configure Storybook Highlight Addon with Decorators

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/highlight-menu.md

Demonstrates how to integrate the Storybook Highlight addon into stories using decorators. It utilizes `useChannel` to emit `HIGHLIGHT` events, allowing developers to specify CSS selectors for visual highlighting and define interactive menu items with titles, descriptions, and optional click events. Examples are provided for Svelte, Vue, and Web Components frameworks using both JavaScript and TypeScript.

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { useChannel } from 'storybook/preview-api';
  import { HIGHLIGHT } from 'storybook/highlight';

  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    component: MyComponent,
  });
</script>

<Story
  name="StyledHighlight"
  decorators={[
    (storyFn) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        selectors: ['h2', 'a', '.storybook-button'],
        menu: [
          [
            {
              id: 'button-name',
              title: 'Login',
              description: 'Navigate to the login page',
              clickEvent: 'my-menu-click-event',
            },
            {
              id: 'h2-home',
              title: 'Acme',
              description: 'Navigate to the home page',
            },
          ]
        ],
      });
      return storyFn();
    },
  ]}
/>
```

```ts
// Replace your-framework with svelte-vite or sveltekit
import type { Meta, StoryObj } from '@storybook/your-framework';

import { useChannel } from 'storybook/preview-api';
import { HIGHLIGHT } from 'storybook/highlight';

import MyComponent from './MyComponent.svelte';

const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StyledHighlight: Story = {
  decorators: [
    (storyFn) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        selectors: ['h2', 'a', '.storybook-button'],
        menu: [
          [
            {
              id: 'button-name',
              title: 'Login',
              description: 'Navigate to the login page',
              clickEvent: 'my-menu-click-event',
            },
            {
              id: 'h2-home',
              title: 'Acme',
              description: 'Navigate to the home page',
            },
          ],
        ],
      });
      return storyFn();
    },
  ],
};
```

```js
import { useChannel } from 'storybook/preview-api';
import { HIGHLIGHT } from 'storybook/highlight';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const StyledHighlight = {
  decorators: [
    () => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        selectors: ['h2', 'a', '.storybook-button'],
        menu: [
          [
            {
              id: 'button-name',
              title: 'Login',
              description: 'Navigate to the login page',
              clickEvent: 'my-menu-click-event',
            },
            {
              id: 'h2-home',
              title: 'Acme',
              description: 'Navigate to the home page',
            },
          ],
        ],
      });
      return {
        template: '<story />',
      };
    },
  ],
};
```

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { useChannel } from 'storybook/preview-api';
import { HIGHLIGHT } from 'storybook/highlight';

import MyComponent from './MyComponent.vue';

const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StyledHighlight: Story = {
  decorators: [
    () => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        selectors: ['h2', 'a', '.storybook-button'],
        menu: [
          [
            {
              id: 'button-name',
              title: 'Login',
              description: 'Navigate to the login page',
              clickEvent: 'my-menu-click-event',
            },
            {
              id: 'h2-home',
              title: 'Acme',
              description: 'Navigate to the home page',
            },
          ],
        ],
      });
      return {
        template: '<story />',
      };
    },
  ],
};
```

```js
import { useChannel } from 'storybook/preview-api';
import { HIGHLIGHT } from 'storybook/highlight';

export default {
  component: 'my-component',
};

export const StyledHighlight = {
  decorators: [
    (story) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        selectors: ['h2', 'a', '.storybook-button'],
        menu: [
          [
            {
              id: 'button-name',
              title: 'Login',
              description: 'Navigate to the login page',
              clickEvent: 'my-menu-click-event',
            },
            {
              id: 'h2-home',
```

--------------------------------

### JavaScript Button Component

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/docs/src/blocks/components/DocsPageExampleCaption.mdx

A simple JavaScript code snippet demonstrating a functional React component for a basic HTML button.

```JavaScript
const Button = () => <button />;
```

--------------------------------

### SCROLL_INTO_VIEW Event API Reference

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/essentials/highlight.mdx

Reference for the `SCROLL_INTO_VIEW` event, detailing its purpose, required payload properties, and optional parameters for customizing scroll behavior.

```APIDOC
Event Name: SCROLL_INTO_VIEW
Purpose: Scrolls a DOM element into view and briefly highlights it.
Payload:
  selector: string (Required)
    Description: The CSS selector of the element to scroll into view.
  options: ScrollIntoViewOptions (Optional)
    Description: An object inheriting from ScrollIntoViewOptions API to customize the scroll behavior.
    Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#scrollintoviewoptions
```

--------------------------------

### Listen for Highlight Menu Item Click Events

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/essentials/highlight.mdx

Illustrates how to set up listeners for custom channel events emitted by highlight menu items. It shows examples using `channel.on` for direct channel instances and `useChannel` for Storybook decorators, providing the `itemId` and `ClickEventDetails`.

```ts
import type { ClickEventDetails } from 'storybook/highlight';

const handleClickEvent = (itemId: string, details: ClickEventDetails) => {
  // Handle the menu item click event
}

// When you have a channel instance:
channel.on('MY_CLICK_EVENT', handleClickEvent)

// Or from a decorator:
useChannel({
  MY_CLICK_EVENT: handleClickEvent,
}, [handleClickEvent])
```

--------------------------------

### Storybook Interaction Test: Save Flow with Mocked Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-test-fn-mock-spy.md

Illustrates how to test a 'Save Flow' in Storybook by mocking an action (`saveNote`), simulating a user click on a save button, and asserting that the mocked function was called. Examples are provided for Angular, Svelte, and generic JavaScript/TypeScript Storybook configurations, showcasing different Component Story Format (CSF) syntaxes.

```typescript
import type { Meta, StoryObj } from '@storybook/angular';

import { expect } from 'storybook/test';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

import NoteUI from './note-ui';

const meta: Meta<NoteUI> = { component: NoteUI };
export default meta;

type Story = StoryObj<NoteUI>;

const notes = createNotes();

export const SaveFlow: Story = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```javascript
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { expect } from 'storybook/test';

  // 👇 Must include the `.mock` portion of filename to have mocks typed correctly
  import { saveNote } from '#app/actions.mock';
  import { createNotes } from '#mocks/notes';

  import NoteUI from './note-ui.svelte';

  const meta = defineMeta({
    title: 'Mocked/NoteUI',
    component: NoteUI,
  });
</script>

<script>
  const notes = createNotes();
</script>

<Story name="Save Flow ▶"
  args={{ isEditing: true, note: notes[0] }}
  play={async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  }} />
```

```javascript
import { expect } from 'storybook/test';

import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

import NoteUI from './note-ui.svelte';

export default {
  title: 'Mocked/NoteUI',
  component: NoteUI,
};

const notes = createNotes();

export const SaveFlow = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```javascript
import { expect } from 'storybook/test';

import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

import NoteUI from './note-ui';

export default { component: NoteUI };

const notes = createNotes();

export const SaveFlow = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```typescript
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { expect } from 'storybook/test';

  // 👇 Must include the `.mock` portion of filename to have mocks typed correctly
  import { saveNote } from '#app/actions.mock';
  import { createNotes } from '#mocks/notes';

  import NoteUI from './note-ui.svelte';

  const meta = defineMeta({
    title: 'Mocked/NoteUI',
    component: NoteUI,
  });
</script>

<script>
  const notes = createNotes();
</script>

<Story name="Save Flow ▶"
  args={{ isEditing: true, note: notes[0] }}
  play={async ({ canvas, userEvent }) => {
    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  }} />
```

```typescript
// Replace your-framework with svelte-vite or sveltekit
import type { Meta, StoryObj } from '@storybook/your-framework';

import { expect } from 'storybook/test';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '#app/actions.mock';
import { createNotes } from '#mocks/notes';

import NoteUI from './note-ui.svelte';

const meta = {
  title: 'Mocked/NoteUI',
  component: NoteUI,
} satisfies Meta<typeof NoteUI>;
export default meta;

type Story = StoryObj<typeof meta>;

const notes = createNotes();

export const SaveFlow: Story = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvas, userEvent }) => {

```

--------------------------------

### Storybook Canvas Doc Block API Reference

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-docs/doc-blocks.mdx

API documentation for the `<Canvas />` block, a wrapper around a `<Story />` that provides an interactive toolbar and automatic source code snippets. It specifies the `parameters.docs.canvas` namespace for its parameters.

```APIDOC
Canvas:
  Description: A wrapper around a Story, featuring a toolbar that allows you to interact with its content while automatically providing the required Source snippets.
  Parameters:
    namespace: parameters.docs.canvas
```

--------------------------------

### Synchronize Documentation with Storybook Monorepo

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/contribute/documentation/new-snippets.mdx

Command to connect the documentation from the Storybook monorepo to the Storybook website, prompting for local monorepo path and documentation version.

```shell
npm run sync-docs
```

--------------------------------

### Storybook MDX Integration Example

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/test-storybooks/external-docs/pages/emoji-button.mdx

This snippet demonstrates how to set up a Storybook MDX file, importing `Meta` from `@storybook/addon-docs/blocks` and referencing existing stories and a custom MDX template. It then uses the `<Meta>` component to link to the stories and includes the custom `<Template />` component.

```MDX
import { Meta } from '@storybook/addon-docs/blocks';
import * as EmojiButtonStories from './emoji-button.stories.tsx';
import Template from './Template.mdx';

<Meta of={EmojiButtonStories} />

<Template />
```

--------------------------------

### Storybook Button Story with Emoji Content (Function Declaration)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.ts.csf.txt

This story defines a React Button component using a standard function declaration syntax. It displays a set of emojis within a span element and logs a 'clicked' event to the Storybook actions panel when the button is clicked, providing an alternative function definition style.

```JavaScript
export function emojiFn() {
  return (
    <Button onClick={action("clicked")}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  )
};
```

--------------------------------

### Lint Storybook Codebase

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/README.md

Performs a boolean check to ensure code conforms to linting rules using remark and ESLint. Specific commands are available for JavaScript and Markdown, with an option to automatically fix JavaScript issues.

```Shell
yarn lint
```

```Shell
yarn lint:js
```

```Shell
yarn lint:md
```

```Shell
yarn lint:js --fix
```

--------------------------------

### Testing Library Query Type Behaviors

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

Detailed breakdown of Testing Library query type behaviors (`getBy`, `queryBy`, `findBy`, `getAllBy`, `queryAllBy`, `findAllBy`) based on the number of matches found (0, 1, or multiple) and whether the query is asynchronous.

```APIDOC
Query Types:\n  Single Element:\n    getBy...:\n      0 Matches: Throw error\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: No\n    queryBy...:\n      0 Matches: Return null\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: No\n    findBy...:\n      0 Matches: Throw error\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: Yes\n  Multiple Elements:\n    getAllBy...:\n      0 Matches: Throw error\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: No\n    queryAllBy...:\n      0 Matches: Return []\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: No\n    findAllBy...:\n      0 Matches: Throw error\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: Yes
```

--------------------------------

### Web Components Storybook Stories for List Component (Lit HTML)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/list-story-expanded.md

Shows Storybook stories for a Web Components-based List component

--------------------------------

### Scroll Element into View and Highlight in Storybook

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/essentials/highlight.mdx

Demonstrates how to use the `SCROLL_INTO_VIEW` event to programmatically scroll a specific DOM element into the viewport and briefly highlight it.

```JavaScript
import { useChannel } from '@storybook/api';
import { useEffect } from 'react';

export const MyStoryWithScrollIntoView = () => {
  const channel = useChannel();

  useEffect(() => {
    // Simulate scrolling into view after the component mounts
    const timer = setTimeout(() => {
      channel.emit('SCROLL_INTO_VIEW', { selector: '#target-element-for-scroll' });
      console.log('Scrolled element into view and highlighted!');
    }, 1000);

    return () => clearTimeout(timer);
  }, [channel]);

  return (
    <div style={{ height: '1000px', paddingTop: '500px' }}>
      <p>Some content above...</p>
      <div id="target-element-for-scroll" style={{ border: '2px solid blue', padding: '20px' }}>
        This element will be scrolled into view and highlighted.
      </div>
      <p style={{ height: '500px' }}>Some content below...</p>
    </div>
  );
};
```