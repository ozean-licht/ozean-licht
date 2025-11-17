# Storybook Auth System

**Query:** authentication
**Timestamp:** 2025-11-16T19:37:32.703Z
**Library:** /storybookjs/storybook/v9.0.15

---

### Custom Fetch Story HTML Function in Storybook Preview (JavaScript)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/frameworks/server-webpack5/README.md

Demonstrates how to define a custom `fetchStoryHtml` function in `.storybook/preview.js` to control how `@storybook/server` retrieves HTML from the server. This function allows for advanced customization of the story fetching process, such as adding custom headers or handling authentication.

```javascript
// .storybook/preview.js

const fetchStoryHtml = async (url, path, params, context) => {
  // Custom fetch implementation
  // ....
  return html;
};

export const parameters = {
  server: {
    url: `http://localhost:${port}/storybook_preview`,
    fetchStoryHtml,
  },
};
```

--------------------------------

### Publish Storybook using Chromatic CLI

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/sharing/publish-storybook.mdx

This command installs and executes the Chromatic CLI to deploy your Storybook project. It requires a unique project token obtained from Chromatic to authenticate and link the build to your project.

```shell
npx chromatic --project-token=<your-project-token>
```

--------------------------------

### Cypress Test for Login Form Field Validation

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/component-cypress-test.md

This Cypress test suite verifies that the email and password fields within a login form contain specific pre-defined values. It navigates to a Storybook iframe, targets the login form by its ID, and then asserts the 'value' attribute of the email and password input fields.

```JavaScript
/// <reference types="cypress" />

describe('Login Form', () => {
  it('Should contain valid login information', () => {
    cy.visit('/iframe.html?id=components-login-form--example');
    cy.get('#login-form').within(() => {
      cy.log('**enter the email**');
      cy.get('#email').should('have.value', 'email@provider.com');
      cy.log('**enter password**');
      cy.get('#password').should('have.value', 'a-random-password');
    });
  });
});
```

--------------------------------

### Publish Storybook Packages to npm

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Publishes all Storybook packages to npm using a provided authentication token and a specific tag for older releases, with verbose output.

```Shell
YARN_NPM_AUTH_TOKEN=<NPM_TOKEN> yarn release:publish --tag tag-for-publishing-older-releases --verbose
```

--------------------------------

### Retrieving Query Parameters with api.getQueryParam()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

The `api.getQueryParam()` method allows retrieval of a specific query parameter that was previously set using the `setQueryParams` API method.

```APIDOC
api.getQueryParam(paramName: string): string | null
  paramName: The name of the query parameter to retrieve.
  Returns: The string value of the query parameter, or null if not found.
```

--------------------------------

### Test Login Form Input Default Values using Playwright

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/component-playwright-test.md

This Playwright test navigates to a specific Storybook component URL, retrieves the current values of the email and password input fields, and then asserts that these values match predefined default strings. It ensures that the login form initializes with expected placeholder or default data.

```js
const { test, expect } = require('@playwright/test');

test('Login Form inputs', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-login-form--example');
  const email = await page.inputValue('#email');
  const password = await page.inputValue('#password');
  await expect(email).toBe('email@provider.com');
  await expect(password).toBe('a-random-password');
});
```

--------------------------------

### Simulate User Interaction and Assert DOM in Storybook Play Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/login-form-with-play-function.md

This Storybook play function demonstrates how to simulate user input (typing email and password) and button clicks on a login form using userEvent. It then asserts that a success message appears in the DOM using expect and toBeInTheDocument, verifying the component's behavior after interaction. This is a powerful feature for automated UI testing within Storybook.

```JavaScript
async ({ canvas, userEvent }) => {
  // 👇 Simulate interactions with the component
  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

  await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

  // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'));

  // 👇 Assert DOM structure
  await expect(
    canvas.getByText(
      'Everything is perfect. Your account is ready and we should probably get you started!'
    )
  ).toBeInTheDocument();
}
```

```JavaScript
async ({ canvas, userEvent }) => {
  // 👇 Simulate interactions with the component
  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

  await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

  // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'));

  // 👇 Assert DOM structure
  await expect(
    canvas.getByText(
      'Everything is perfect. Your account is ready and we should probably get you started!'
    )
  ).toBeInTheDocument();
}
```

```TypeScript
async ({ canvas, userEvent }) => {
  // 👇 Simulate interactions with the component
  await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

  await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

  // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
  await userEvent.click(canvas.getByRole('button'));

  // 👇 Assert DOM structure
  await expect(
    canvas.getByText(
      'Everything is perfect. Your account is ready and we should probably get you started!'
    )
  ).toBeInTheDocument();
}
```

--------------------------------

### Simulate User Interactions and Assertions in Storybook Play Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/login-form-with-play-function.md

This snippet illustrates how to use Storybook's 'play' function to simulate user interactions like typing into input fields and clicking buttons. It also demonstrates asserting the DOM structure after interactions using 'expect' for robust component testing.

```JavaScript
export const FilledForm = {
  render: () => ({
    components: { LoginForm },
    template: `<LoginForm />`,
  }),
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

```TypeScript (Vue)
export const FilledForm: Story = {
  render: () => ({
    components: { LoginForm },
    template: `<LoginForm />`,
  }),
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

```JavaScript (Web Components)
export const FilledForm = {
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

```TypeScript (Web Components)
export const FilledForm: Story = {
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

--------------------------------

### Testing Library Query Type Behaviors

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

Detailed breakdown of Testing Library query type behaviors (`getBy`, `queryBy`, `findBy`, `getAllBy`, `queryAllBy`, `findAllBy`) based on the number of matches found (0, 1, or multiple) and whether the query is asynchronous.

```APIDOC
Query Types:\n  Single Element:\n    getBy...:\n      0 Matches: Throw error\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: No\n    queryBy...:\n      0 Matches: Return null\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: No\n    findBy...:\n      0 Matches: Throw error\n      1 Match: Return element\n      >1 Matches: Throw error\n      Awaited: Yes\n  Multiple Elements:\n    getAllBy...:\n      0 Matches: Throw error\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: No\n    queryAllBy...:\n      0 Matches: Return []\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: No\n    findAllBy...:\n      0 Matches: Throw error\n      1 Match: Return array\n      >1 Matches: Return array\n      Awaited: Yes
```

--------------------------------

### Storybook A11y Addon Configuration Parameters

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/accessibility-testing.mdx

Defines the configurable properties for the Storybook a11y addon, mapping directly to `axe-core` options. These parameters control context, configuration, options, test behavior, and manual analysis.

```APIDOC
Property: parameters.a11y.context
  Default: 'body'
  Description: Context passed to axe.run. Defines which elements to run checks against.

Property: parameters.a11y.config
  Default: (see below)
  Description: Configuration passed to axe.configure(). Most commonly used to configure individual rules.

Property: parameters.a11y.options
  Default: {}
  Description: Options passed to axe.run. Can be used to adjust the rulesets checked against.

Property: parameters.a11y.test
  Default: undefined
  Description: Determines test behavior when run with the Vitest addon.

Property: globals.a11y.manual
  Default: undefined
  Description: Set to true to prevent stories from being automatically analyzed when visited.
```

--------------------------------

### FetchStoryHtmlType Function Signature (APIDOC)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/frameworks/server-webpack5/README.md

Documents the type signature for the `fetchStoryHtml` function, detailing its parameters (`url`, `id`, `params`, `context`) and expected return type (`Promise<string | Node>`). This function is crucial for custom HTML fetching in Storybook server configurations, allowing developers to override the default fetching mechanism.

```APIDOC
type FetchStoryHtmlType = (
  url: string,
  id: string,
  params: any,
  context: StoryContext
) => Promise<string | Node>;
```

--------------------------------

### Storybook SvelteKit Experimental Parameters API

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/get-started/frameworks/sveltekit.mdx

This section details the API for parameters contributed by the Storybook SvelteKit experimental framework under the `sveltekit_experimental` namespace. It describes various parameters like `forms`, `hrefs`, `navigation`, and `stores`, which provide mocks for SvelteKit modules and functionalities.

```APIDOC
Parameters:
  sveltekit_experimental:
    forms:
      Type: { enhance: () => void }
      Description: Provides mocks for the $app/forms module.
      enhance:
        Type: () => void
        Description: A callback that will be called when a form with use:enhance is submitted.
    hrefs:
      Type: Record<[path: string], (to: string, event: MouseEvent) => void | { callback: (to: string, event: MouseEvent) => void, asRegex?: boolean }>
      Description: Defines callbacks for <a> tags with matching href attributes. If no match, logs to Actions panel.
    navigation:
      Type: See SvelteKit docs
      Description: Provides mocks for the $app/navigation module.
      goto:
        Type: See SvelteKit docs
        Description: Callback for goto calls. Logs to Actions panel if no function provided.
      pushState:
        Type: See SvelteKit docs
        Description: Callback for pushState calls. Logs to Actions panel if no function provided.
      replaceState:
        Type: See SvelteKit docs
        Description: Callback for replaceState calls. Logs to Actions panel if no function provided.
      invalidate:
        Type: See SvelteKit docs
        Description: Callback for invalidate calls. Logs to Actions panel if no function provided.
      invalidateAll:
        Type: See SvelteKit docs
        Description: Callback for invalidateAll calls. Logs to Actions panel if no function provided.
      afterNavigate:
        Type: See SvelteKit docs
        Description: Object passed to afterNavigate function, invoked on onMount.
    stores:
      Type: See SvelteKit docs
      Description: Provides mocks for the $app/stores module.
```

--------------------------------

### Default `axe-core` configuration for Storybook a11y addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/accessibility-testing.mdx

Shows the default configuration for the `parameters.a11y.config` property, which disables the 'region' rule to prevent false negatives in Storybook components.

```JavaScript
{
  rules: [
    {
      id: 'region',
      enabled: false,
    }
  ]
}
```

--------------------------------

### Configure Storybook Test Runner for Accessibility (a11y) Checks

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/test-runner-a11y-configure.md

These code snippets demonstrate how to set up the Storybook test runner to automatically perform accessibility audits using `axe-playwright`. The `preVisit` hook injects the Axe accessibility engine into the page, while the `postVisit` hook executes the `checkA11y` function. It also shows how to retrieve story context to apply story-specific accessibility rules defined in parameters.

```js
const { injectAxe, checkA11y, configureAxe } = require('axe-playwright');

const { getStoryContext } = require('@storybook/test-runner');

/*
 * See https://storybook.js.org/docs/writing-tests/integrations/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // Apply story-level a11y rules
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    const element = storyContext.parameters?.a11y?.element ?? 'body';
    await checkA11y(page, element, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  }
};
```

```ts
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/integrations/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // Apply story-level a11y rules
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    const element = storyContext.parameters?.a11y?.element ?? 'body';
    await checkA11y(page, element, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  }
};

export default config;
```

--------------------------------

### Configure Dynamic HTTP Headers for Storybook Test Runner

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/test-runner-auth.md

This snippet demonstrates how to implement the `getHttpHeaders` function within the Storybook Test Runner configuration. It takes a URL as input and returns an object of HTTP headers. This example dynamically sets an Authorization bearer token based on whether the URL includes 'prod'.

```js
module.exports = {
  getHttpHeaders: async (url) => {
    const token = url.includes('prod') ? 'XYZ' : 'ABC';
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};
```

```ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  getHttpHeaders: async (url) => {
    const token = url.includes('prod') ? 'prod-token' : 'dev-token';
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

export default config;
```

--------------------------------

### Example `canvas` queries using Testing Library

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

Demonstrates common `canvas` query patterns using `findByRole`, `getByText`, and `getAllByRole` to interact with UI elements in Storybook's play function.

```JavaScript
// Find the first element with a role of button with the accessible name "Submit"\nawait canvas.findByRole('button', { name: 'Submit' });\n\n// Get the first element with the text "An example heading"\ncanvas.getByText('An example heading');\n\n// Get all elements with the role of listitem\ncanvas.getAllByRole('listitem');
```

--------------------------------

### Simulate user interaction to fill and submit a registration form in Storybook

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/play-function.md

This snippet demonstrates how to use Storybook's 'play' function to simulate user interaction with a registration form. It fills the email and password fields and then clicks the submit button, useful for automated testing and visual regression.

```typescript
import type { Meta, StoryObj } from '@storybook/angular';

import { RegistrationForm } from './RegistrationForm.component';

const meta: Meta<RegistrationForm> = {
  component: RegistrationForm,
};
export default meta;

type Story = StoryObj<RegistrationForm>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FilledForm: Story = {
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });

    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  },
};
```

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import RegistrationForm from './RegistrationForm.svelte';

  const { Story } = defineMeta({
    component: RegistrationForm,
  });
</script>

<!--
  See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
  to learn more about using the canvas to query the DOM
-->
<Story
  name="FilledForm"
  play={async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });

    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  }}
/>
```

```javascript
import RegistrationForm from './RegistrationForm.svelte';

export default {
  component: RegistrationForm,
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FilledForm = {
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });

    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  },
};
```

```javascript
import { RegistrationForm } from './RegistrationForm';

export default {
  component: RegistrationForm,
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FilledForm = {
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });

    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  },
};
```

```svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import RegistrationForm from './RegistrationForm.svelte';

  const { Story } = defineMeta({
    component: RegistrationForm,
  });
</script>

<!--
  See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
  to learn more about using the canvas to query the DOM
-->
<Story
  name="FilledForm"
  play={async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });

    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
  }}
/>
```

--------------------------------

### Setting Query Parameters with api.setQueryParams()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

The `api.setQueryParams()` method enables setting query string parameters, useful for temporary storage by addons. Parameters can be removed by setting their value to `null`.

```APIDOC
api.setQueryParams(params: object): void
  params: An object where keys are query parameter names and values are their desired string values. Set a value to 'null' to remove the parameter.
```

--------------------------------

### Registering a Storybook Addon and Accessing Query Parameters

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-getqueryparam.md

This snippet shows how to register a new addon with Storybook's manager API. It demonstrates accessing a query parameter using `api.getQueryParam()` within the addon's registration callback.

```JavaScript
addons.register('my-organisation/my-addon', (api) => {
  api.getQueryParam('exampleParameter');
});
```

--------------------------------

### Configure Storybook Accessibility (a11y) Parameters

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/addon-a11y-config-in-meta-and-story.md

This configuration demonstrates how to set up accessibility testing parameters for Storybook stories using the `a11y` addon. It shows how to define `context`, `config`, `options` for Axe, and control test behavior or manual checks via `parameters` and `globals`.

```ts
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'error',
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};
export default meta;

type Story = StoryObj<Button>;

export const ExampleStory: Story = {
  parameters: {
    a11y: {
      // ...same config available as above
    },
  },
  globals: {
    a11y: {
      // ...same config available as above
    },
  },
};
```

```ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta = {
  component: Button,
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'error',
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ExampleStory: Story = {
  parameters: {
    a11y: {
      // ...same config available as above
    },
  },
  globals: {
    a11y: {
      // ...same config available as above
    },
  },
};
```

```js
import { Button } from './Button';

export default {
  component: Button,
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'error',
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export const ExampleStory = {
  parameters: {
    a11y: {
      // ...same config available as above
    },
  },
  globals: {
    a11y: {
      // ...same config available as above
    },
  },
};
```

```ts
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';

  const { Story } = defineMeta({
    component: Button,
    parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*

```

--------------------------------

### Test LoginForm Component with Storybook Play Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/interaction-test-fn-mock-spy.md

This snippet demonstrates how to create a Storybook story for a LoginForm component, simulating user interaction and asserting callback behavior. It utilizes Storybook's `play` function to type into input fields, click a button, and verify that the `onSubmit` callback is invoked using `fn` for spying and `expect` for assertions. Examples are provided for Angular, generic TypeScript/JavaScript, and Svelte frameworks.

```ts
import type { Meta, StoryObj } from '@storybook/angular';
import { fn, expect } from 'storybook/test';

import { LoginForm } from './LoginForm.component';

const meta: Meta<LoginForm> = {
  component: LoginForm,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};
export default meta;

type Story = StoryObj<LoginForm>;

export const FilledForm: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```ts
// Replace your-framework with the name of your framework (e.g. react-vite, vue3-vite, etc.)
import type { Meta, StoryObj } from '@storybook/your-framework';
import { fn, expect } from 'storybook/test';

import { LoginForm } from './LoginForm';

const meta = {
  component: LoginForm,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FilledForm: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```js
import { fn, expect } from 'storybook/test';

import { LoginForm } from './LoginForm';

export default {
  component: LoginForm,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export const FilledForm = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```ts
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import LoginForm from './LoginForm.svelte';

  const { Story } = defineMeta({
    component: LoginForm,
    args: {
      // 👇 Use `fn` to spy on the onSubmit arg
      onSubmit: fn(),
    },
  });
</script>

<Story
  name="FilledForm"
  play={async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  }}
/>
```

```ts
// Replace your-framework with the framework you are using, e.g. sveltekit or svelte-vite
import type { Meta, StoryObj } from '@storybook/your-framework';
import { fn, expect } from 'storybook/test';

import { LoginForm } from './LoginForm.svelte';

const meta = {
  component: LoginForm,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
} satisfies Meta<typeof LoginForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FilledForm: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```js
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import LoginForm from './LoginForm.svelte';

  const { Story } = defineMeta({
    component: LoginForm,
    args: {
      // 👇 Use `fn` to spy on the onSubmit arg
      onSubmit: fn(),
    },
  });
</script>

<Story
  name="FilledForm"
  play={async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));
```

--------------------------------

### Define an Empty Login Form Story

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/login-form-with-play-function.md

This snippet defines a basic Storybook story named 'EmptyForm' for the LoginForm component. It represents the initial, untouched state of the form, useful for verifying default rendering and styling.

```Svelte
<Story name="EmptyForm" />
```

```JavaScript
export const EmptyForm = {};
```

```TypeScript
export const EmptyForm: Story = {};
```

--------------------------------

### Test Form Submission with User Events in Storybook

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/interaction-test-fn-mock-spy.md

This snippet illustrates how to create an interactive Storybook test (`play` function) for a login form. It uses `userEvent.type` to simulate typing into input fields, `userEvent.click` to simulate button clicks, and `expect(args.onSubmit).toHaveBeenCalled()` to verify that the form's submission handler was invoked.

```javascript
await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
```

```javascript
import { fn, expect } from 'storybook/test';

import { LoginForm } from './LoginForm.svelte';

export default {
  component: LoginForm,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export const FilledForm = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```typescript
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn, expect } from 'storybook/test';

const meta: Meta = {
  component: 'demo-login-form',
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};
export default meta;

type Story = StoryObj;

export const FilledForm: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

```javascript
import { fn, expect } from 'storybook/test';

export default {
  component: 'demo-login-form',
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export const FilledForm = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'email@provider.com');
    await userEvent.type(canvas.getByLabelText('Password'), 'a-random-password');
    await userEvent.click(canvas.getByRole('button', { name: 'Log in' }));

    // 👇 Now we can assert that the onSubmit arg was called
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};
```

--------------------------------

### Configure Storybook Accessibility (a11y) Parameters

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/addon-a11y-config-in-meta-and-story.md

These code snippets illustrate how to define accessibility parameters for Storybook stories. It covers setting up Axe's `context`, `config`, `options`, and `test` parameters within `parameters.a11y`, and enabling a `manual` flag for global a11y checks via `globals.a11y`. This configuration helps integrate automated accessibility testing directly into your Storybook environment.

```typescript
import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  component: 'demo-button',
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'error',
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};
export default meta;

type Story = StoryObj;

export const ExampleStory: Story = {
  parameters: {
    a11y: {
      // ...same config available as above
    },
  },
  globals: {
    a11y: {
      // ...same config available as above
    },
  },
};
```

```javascript
export default {
  component: 'demo-button',
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more.
       */
      context: {},
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'error',
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export const ExampleStory = {
  parameters: {
    a11y: {
      // ...same config available as above
    },
  },
  globals: {
    a11y: {
      // ...same config available as above
    },
  },
};

```

--------------------------------

### Storybook Indexers API Signature

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/main-config/main-config-indexers.mdx

Defines the signature for the Storybook indexers configuration, allowing customization of existing indexers.

```TypeScript
(existingIndexers: Indexer[]) => Promise<Indexer[]>
```

--------------------------------

### Storybook Core `crossOriginIsolated` Property

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/main-config/main-config-core.mdx

Enables Cross-Origin Resource Sharing (CORS) headers to ensure the document runs in a 'secure context', addressing security requirements for `SharedArrayBuffer`. It sets `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` in development mode.

```APIDOC
crossOriginIsolated: boolean
```

--------------------------------

### viteFinal Function Signature and Options Interface

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/main-config/main-config-vite-final.mdx

Defines the signature for the `viteFinal` function, which customizes Storybook's Vite configuration, and the `Options` interface, which provides additional configuration parameters for the function.

```APIDOC
viteFinal:
  Type: (config: Vite.InlineConfig, options: Options) => Vite.InlineConfig | Promise<Vite.InlineConfig>
  Description: Customize Storybook's Vite setup.

Options:
  Type: { configType?: 'DEVELOPMENT' | 'PRODUCTION' }
  Properties:
    configType: 'DEVELOPMENT' | 'PRODUCTION' (Optional)
      Description: Specifies the configuration type (development or production).
```

--------------------------------

### Import Storybook MDX Components

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/test-storybooks/external-docs/components/AccountForm.mdx

Imports the `Meta` and `Story` components from `@storybook/addon-docs/blocks` for use in MDX documentation files, along with a local stories file.

```JavaScript
import { Meta, Story } from '@storybook/addon-docs/blocks';
import * as AccountFormStories from './AccountForm.stories';
```

--------------------------------

### Registering a Storybook Tool Addon with Tab ID Filtering

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Illustrates how to register a TOOL type addon that can filter its visibility based on the current `tabId`. The `match` function receives `tabId`, allowing the addon to show or hide its content conditionally.

```tsx
import { addons, types } from "@storybook/manager-api";

addons.register("my-addon", () => {
  addons.add("my-addon/tool", {
    type: types.TOOL,
    title: "My Addon",
    match: ({ tabId }) => tabId === "my-addon/tab",
    render: () => <div>👀</div>
  });
});
```

--------------------------------

### Storybook Control Accept Property (`control.accept`)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/arg-types.mdx

Specifies accepted file types when `control.type` is set to `'file'`. The value should be a comma-separated string of MIME types.

```APIDOC
control.accept:
  Type: string
  Description: When type is 'file', you can specify the file types that are accepted. The value should be a string of comma-separated MIME types.
```

--------------------------------

### Storybook Babel Configuration Function Signature

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/main-config/main-config-babel.mdx

Defines the signature for the function used to customize Storybook's Babel setup. This function accepts a Babel configuration object and an options object, and is expected to return a modified Babel configuration or a Promise resolving to one.

```APIDOC
Type: (config: Babel.Config, options: Options) => Babel.Config | Promise<Babel.Config>
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

### Common `expect` Assertion Methods Reference

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

A reference of frequently used assertion methods available via the `expect` utility in Storybook tests. These methods are sourced from `@testing-library/jest-dom` and Vitest, allowing for comprehensive DOM and function behavior validation.

```APIDOC
expect methods:
- toBeInTheDocument(): Checks if the element is in the DOM. Usage: await expect(<element>).toBeInTheDocument()
- toBeVisible(): Checks if the element is visible to the user. Usage: await expect(<element>).toBeVisible()
- toBeDisabled(): Checks if an element is disabled. Usage: await expect(<element>).toBeDisabled()
- toHaveBeenCalled(): Checks that a spied function was called. Usage: await expect(<function-spy>).toHaveBeenCalled()
- toHaveBeenCalledWith(): Checks that a spied function was called with specific parameters. Usage: await expect(<function-spy>).toHaveBeenCalledWith('example')
```

--------------------------------

### Fetch Document Information with GraphQL Across Frameworks

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/document-screen-with-graphql.md

These code snippets demonstrate how to fetch comprehensive document-related information (user, document details, and subdocuments) using a common GraphQL query (`AllInfoQuery`) across various JavaScript and TypeScript frontend frameworks. Each example utilizes a framework-specific GraphQL client (Apollo Client for Angular/React, @solid-primitives/graphql for SolidJS) to execute the query and manage data loading and display.

```ts
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'document-screen',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">There was an error fetching the data!</div>
    <div *ngIf="!loading && subdocuments.length > 0">
      <page-layout [user]="user">
        <document-header [document]="document"></document-header>
        <document-list [documents]="subdocuments"></document-list>
      </page-layout>
    </div>
  `,
})
export class SampleGraphqlComponent implements OnInit {
  user: any = { id: 0, name: 'Some User' };

  document: any = { id: 0, title: 'Some Title' };

  subdocuments: any = [];

  error = '';
  loading = true;

  constructor(private apollo: Apollo) {}
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          query AllInfoQuery {
            user {
              userID
              name
            }
            document {
              id
              userID
              title
              brief
              status
            }
            subdocuments {
              id
              userID
              title
              content
              status
            }
          }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.user = result?.data?.user;
        this.document = result?.data?.document;
        this.subdocuments = result?.data?.subdocuments;
        this.loading = result.loading;

        // Errors is an array and we're getting the first item only
        this.error = result.errors[0].message;
      });
  }
}
```

```js
import { useQuery, gql } from '@apollo/client';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

const AllInfoQuery = gql`
  query AllInfo {
    user {
      userID
      name
    }
    document {
      id
      userID
      title
      brief
      status
    }
    subdocuments {
      id
      userID
      title
      content
      status
    }
  }
`;

function useFetchInfo() {
  const { loading, error, data } = useQuery(AllInfoQuery);

  return { loading, error, data };
}

export function DocumentScreen() {
  const { loading, error, data } = useFetchInfo();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  return (
    <PageLayout user={data.user}>
      <DocumentHeader document={data.document} />
      <DocumentList documents={data.subdocuments} />
    </PageLayout>
  );
}
```

```ts
import { useQuery, gql } from '@apollo/client';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

const AllInfoQuery = gql`
  query AllInfo {
    user {
      userID
      name
    }
    document {
      id
      userID
      title
      brief
      status
    }
    subdocuments {
      id
      userID
      title
      content
      status
    }
  }
`;

interface Data {
  allInfo: {
    user: {
      userID: number;
      name: string;
      opening_crawl: boolean;
    };
    document: {
      id: number;
      userID: number;
      title: string;
      brief: string;
      status: string;
    };
    subdocuments: {
      id: number;
      userID: number;
      title: string;
      content: string;
      status: string;
    };
  };
}

function useFetchInfo() {
  const { loading, error, data } = useQuery<Data>(AllInfoQuery);

  return { loading, error, data };
}

export function DocumentScreen() {
  const { loading, error, data } = useFetchInfo();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  return (
    <PageLayout user={data.user}>
      <DocumentHeader document={data.document} />
      <DocumentList documents={data.subdocuments} />
    </PageLayout>
  );
}
```

```js
import { Match, Switch } from 'solid-js';
import { createGraphQLClient, gql } from '@solid-primitives/graphql';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

const newQuery = createGraphQLClient('https://foobar.com/v1/api');
const AllInfoQuery = gql`
  query AllInfo {
    user {
      userID
      name
    }
    document {
      id
      userID
      title
      brief
      status
    }
    subdocuments {
      id
      userID
      title
      content
      status
    }
  }
`;

function useFetchInfo() {
  const [data] = newQuery(AllInfoQuery, { path: 'home' });
  return data;
}

export function DocumentScreen() {
  const data = useFetchInfo();
}
```

--------------------------------

### Importing `expect` for Assertions in Storybook Tests

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/writing-tests/interaction-testing.mdx

This snippet shows how to import the `expect` utility from the `storybook/test` module. This utility is crucial for making assertions in Storybook interaction tests, combining powerful methods from Vitest's `expect` and `@testing-library/jest-dom`.

```js
import { expect } from 'storybook/test';
```

--------------------------------

### Storybook Story Identification Fields API

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/core/src/preview-api/README-store.md

Outlines the essential fields used to uniquely identify a Story within Storybook, including `componentId`, `title`, `id`, and `name`, which are crucial for URL and sidebar generation.

```APIDOC
Story Identification Fields:
- componentId: URL "id" of the component.
- title: Title of the component, generates sidebar entry.
- id: Story "id" (in the URL).
- name: Name of the story.
```

--------------------------------

### Storybook Parameter: dangerouslyIgnoreUnhandledErrors

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/api/parameters.mdx

Documentation for the `dangerouslyIgnoreUnhandledErrors` parameter, which prevents play function failures due to unhandled errors during execution.

```APIDOC
dangerouslyIgnoreUnhandledErrors:
  Type: boolean
  Default: false
  Description: Setting this to true will prevent the play function from failing and showing a warning when unhandled errors are thrown during execution.
```

--------------------------------

### Import Storybook Addon Docs and Asset Files

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/frameworks/nextjs-vite/template/cli/js/Configure.mdx

Imports the `Meta` component from `@storybook/addon-docs/blocks` for documentation metadata and `Image` from `next/image`. Additionally, it imports various SVG and PNG assets used for visual elements on the page.

```JavaScript
import { Meta } from "@storybook/addon-docs/blocks";
import Image from "next/image";

import Github from "./assets/github.svg";
import Discord from "./assets/discord.svg";
import Youtube from "./assets/youtube.svg";
import Tutorials from "./assets/tutorials.svg";
import Styling from "./assets/styling.png";
import Context from "./assets/context.png";
import Assets from "./assets/assets.png";
import Docs from "./assets/docs.png";
import Share from "./assets/share.png";
import FigmaPlugin from "./assets/figma-plugin.png";
import Testing from "./assets/testing.png";
import Accessibility from "./assets/accessibility.png";
import Theming from "./assets/theming.png";
import AddonLibrary from "./assets/addon-library.png";
```

--------------------------------

### Addon Registration `match` Property

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/writing-addons.mdx

Defines how to conditionally render a Storybook toolbar addon based on the current view mode or tab. This property allows fine-grained control over when an addon is visible to the user.

```APIDOC
match: ({ tabId: string | undefined, viewMode: 'story' | 'docs' | undefined }) => boolean
  Description: A function that determines if the addon should be visible.
  Parameters:
    tabId: string | undefined - The ID of the current tab, if applicable (e.g., 'my-addon/tab').
    viewMode: 'story' | 'docs' | undefined - The current view mode ('story' for canvas, 'docs' for documentation).
  Examples:
    ({ tabId }) => tabId === 'my-addon/tab' - Shows addon when viewing the tab with the ID 'my-addon/tab'.
    ({ viewMode }) => viewMode === 'story' - Shows addon when viewing a story in the canvas.
    ({ viewMode }) => viewMode === 'docs' - Shows addon when viewing the documentation for a component.
    ({ tabId, viewMode }) => !tabId && viewMode === 'story' - Shows addon when viewing a story in the canvas and not in a custom tab (i.e., when `tabId` is undefined).
```

--------------------------------

### Configure Storybook Accessibility (a11y) Parameters

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/addon-a11y-config-in-preview.md

This snippet demonstrates how to configure the Storybook a11y addon, which uses Axe-core. It sets the `context` for accessibility checks, provides `config` and `options` objects for Axe-core, and includes a `manual` flag in `globals` to prevent automatic checks. This configuration is typically placed in `.storybook/preview.js` or `.storybook/preview.ts`.

```js
export default {
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more. Typically, this is the CSS selector for the part of the DOM you want to analyze.
       */
      context: 'body',
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};
```

```ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    a11y: {
      /*
       * Axe's context parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter
       * to learn more. Typically, this is the CSS selector for the part of the DOM you want to analyze.
       */
      context: 'body',
      /*
       * Axe's configuration
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure
       * to learn more about the available properties.
       */
      config: {},
      /*
       * Axe's options parameter
       * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
       * to learn more about the available options.
       */
      options: {},
    },
  },
  globals: {
    a11y: {
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};

export default preview;
```