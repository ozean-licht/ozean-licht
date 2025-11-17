# Storybook Addons General

**Query:** addons
**Timestamp:** 2025-11-16T19:37:32.703Z
**Library:** /storybookjs/storybook/v9.0.15

---

### Register Storybook Addon Manually in main.js/ts

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/install-addons.mdx

After installing an addon, register it in your Storybook configuration file (`.storybook/main.js` or `.storybook/main.ts`) by adding it to the `addons` array. This enables the addon within your Storybook instance.

```JavaScript
/** @type { import('@storybook/main').StorybookConfig } */
const config = {
  addons: ['@storybook/addon-a11y'],
  // ... other configurations
};
module.exports = config;
```

--------------------------------

### Registering an Addon with addons.register()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

The `addons.register()` method serves as the entry point for all addons, allowing you to register an addon and gain access to the Storybook API instance.

```APIDOC
addons.register(addonId: string, callback: (api: StorybookAPI) => void): void
  addonId: A unique identifier for the addon.
  callback: A function that receives the StorybookAPI instance.
```

--------------------------------

### Install Storybook Addon Automatically with CLI

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/install-addons.mdx

Use the `storybook add` command to automatically install and configure Storybook addons. This command updates your Storybook configuration and installs necessary dependencies. Note that it currently only processes the first specified addon.

```Shell
npx storybook add <addon-name>
```

--------------------------------

### Register Storybook Addons in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/writing-presets.mdx

Illustrates how to use the `addons` API within the Storybook `main.js` configuration to automatically load specified addon names, simplifying addon integration and supporting references to additional presets.

```JavaScript
// .storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
    // Registering a custom local addon or preset
    // './my-custom-addon/preset.js',
    // Or a path to a local preset
    // require.resolve('./my-local-preset'),
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5'
  }
};
```

--------------------------------

### Storybook Core Addon API Packages

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

Storybook's core addon API is exposed via two distinct packages: `storybook/manager-api` for interacting with the manager UI and `storybook/preview-api` for controlling addon behavior.

```APIDOC
Packages:
  storybook/manager-api: Used to interact with the Storybook manager UI or access the Storybook API.
  storybook/preview-api: Used to control and configure the addon's behavior.
```

--------------------------------

### Configure Storybook Addons in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-main-register-presets-managerentry.md

This JavaScript snippet demonstrates how to register an addon, such as `@storybook/addon-docs/preset`, in the `addons` array within the `.storybook/main.js` configuration file. This is a standard way to extend Storybook's functionality with various plugins and presets.

```js
export default {
  addons: [
    '@storybook/addon-docs/preset'
  ]
};
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

### Remove Storybook Addon with CLI

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/install-addons.mdx

Use the `storybook remove` command to automatically uninstall an addon and remove its configuration from Storybook. This simplifies the cleanup process for unwanted addons.

```Shell
npx storybook remove <addon-name>
```

--------------------------------

### Configure Storybook Addons in main.js/ts

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-main-register-example-addon.md

This snippet demonstrates how to add Storybook addons to your project by modifying the `addons` array in the `.storybook/main.js` or `.storybook/main.ts` configuration file. The example specifically adds the `@storybook/addon-a11y` for accessibility testing.

```js
export default {
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y',
  ],
};
```

```ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y',
  ],
};

export default config;
```

--------------------------------

### Register Storybook Addon and Set Query Parameters (JavaScript)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-setqueryparams.md

This snippet demonstrates how to register a new Storybook addon using `addons.register`. Inside the registration callback, it accesses the `api` object to call `api.setQueryParams`, which allows setting or updating URL query parameters for the Storybook manager UI. This is useful for controlling addon behavior or state via the URL.

```JavaScript
addons.register('my-organisation/my-addon', (api) => {
  api.setQueryParams({
    exampleParameter: 'Sets the example parameter value',
    anotherParameter: 'Sets the another parameter value'
  });
});
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

### Storybook Addon Panel and Toolbar Button Example

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-useaddonstate.md

Demonstrates how to create a custom panel (`AddonPanel`) and a custom toolbar button (`IconButton`) for a Storybook addon. Both components utilize the `useAddonState` hook to manage and update addon-specific state within the Storybook manager UI.

```js
import React from 'react';

import { useAddonState } from 'storybook/manager-api';
import { AddonPanel, IconButton } from 'storybook/internal/components';
import { LightningIcon } from '@storybook/icons';

export const Panel = () => {
  const [state, setState] = useAddonState('addon-unique-identifier', 'initial state');

  return (
    <AddonPanel key="custom-panel" active="true">
      <Button onClick={() => setState('Example')}>
        Click to update Storybook's internal state
      </Button>
    </AddonPanel>
  );
};
export const Tool = () => {
  const [state, setState] = useAddonState('addon-unique-identifier', 'initial state');

  return (
    <IconButton
      key="custom-toolbar"
      active="true"
      title="Enable my addon"
      onClick={() => setState('Example')}
    >
      <LightningIcon />
    </IconButton>
  );
};
```

--------------------------------

### Configure Storybook Addon Measure in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/core/src/measure/README.md

JavaScript configuration to add `@storybook/addon-measure` to the addons array in `.storybook/main.js`, enabling it for your Storybook project.

```js
export default {
  addons: ['@storybook/addon-measure']
};
```

--------------------------------

### Registering UI Components with addons.add()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

The `addons.add()` method registers a UI component type for an addon, such as panels, toolbars, or tabs. It requires a type, title, and a render function.

```APIDOC
addons.add(type: string, title: string, render: Function): void
  type: The type of UI component to register (e.g., 'panel', 'toolbar', 'tab').
  title: The title to feature in the Addon Panel.
  render: The function that renders the addon's UI component.
    - Called with 'active' (boolean): true when the panel is focused.
```

--------------------------------

### Storybook Addon Tool Component (src/Tool.tsx)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/writing-addons.mdx

Defines the main `Tool` component, which serves as the entry point for the Storybook toolbar addon. It manages the addon's active state using `useGlobals`, interacts with the Storybook API to register a keyboard shortcut, and renders an `IconButton` to toggle the addon's functionality.

```ts
export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Addon [8]',
      defaultShortcut: ['8'],
      actionName: 'myaddon',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <IconButton key={TOOL_ID} active={isActive} title="Enable my addon" onClick={toggleMyTool}>
      <LightningIcon />
    </IconButton>
  );
});
```

--------------------------------

### Register Storybook Manager Addons with preset.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-root-preset-manager-entries.md

This JavaScript snippet demonstrates how to extend the `managerEntries` array in a Storybook `preset.js` file to register a manager-level addon. The `require.resolve` function is used to ensure the correct path to the third-party addon is included. This allows Storybook to load and initialize the addon in the manager UI.

```JavaScript
export const managerEntries = (entry = []) => {
  return [...entry, require.resolve('path-to-third-party-addon')];
};
```

--------------------------------

### Storybook Addon Panel with State and Channel Communication

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-toolkit-types.md

This snippet illustrates how to create a custom panel for a Storybook addon. It utilizes `useAddonState` to manage the panel's internal state and `useChannel` for inter-addon communication (emitting and listening to events). The panel displays results and provides functions to request and clear data, demonstrating a common pattern for dynamic addon content.

```tsx
import React from 'react';

import { useAddonState, useChannel } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';

import { ADDON_ID, EVENTS } from './constants';

// See https://github.com/storybookjs/addon-kit/blob/main/src/components/PanelContent.tsx for an example of a PanelContent component
import { PanelContent } from './components/PanelContent';

interface PanelProps {
  active: boolean;
}

export const Panel: React.FC<PanelProps> = (props) => {
  // https://storybook.js.org/docs/addons/addons-api#useaddonstate
  const [results, setState] = useAddonState(ADDON_ID, {
    danger: [],
    warning: [],
  });

  // https://storybook.js.org/docs/addons/addons-api#usechannel
  const emit = useChannel({
    [EVENTS.RESULT]: (newResults) => setState(newResults),
  });

  return (
    <AddonPanel {...props}>
      <PanelContent
        results={results}
        fetchData={() => {
          emit(EVENTS.REQUEST);
        }}
        clearData={() => {
          emit(EVENTS.CLEAR);
        }}
      />
    </AddonPanel>
  );
};

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

### Storybook Addon Imports (src/Tool.tsx)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/writing-addons.mdx

Imports necessary modules for a Storybook toolbar addon, including hooks for Storybook APIs (`useGlobals`, `useStorybookApi`), UI components (`IconButton`), and icons (`LightningIcon`). These are essential for interacting with Storybook's manager and rendering the addon's UI.

```ts
import { useGlobals, useStorybookApi } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { LightningIcon } from '@storybook/icons';
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

### Registering a Storybook Panel Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-panel-example.md

This JavaScript code snippet shows how to register a new panel addon in Storybook. It uses `addons.register` to define the addon and `addons.add` to configure its properties, including its title, type (`types.PANEL`), and a React `render` function to display its content. The `AddonPanel` component is used to wrap the panel's UI.

```JavaScript
import React from 'react';

import { AddonPanel } from 'storybook/internal/components';

import { useGlobals, addons, types } from 'storybook/manager-api';

addons.register('my/panel', () => {
  addons.add('my-panel-addon/panel', {
    title: 'Example Storybook panel',
    //👇 Sets the type of UI element in Storybook
    type: types.PANEL,
    render: ({ active }) => (
      <AddonPanel active={active}>
        <h2>I'm a panel addon in Storybook</h2>
      </AddonPanel>
    )
  });
});
```

--------------------------------

### Configure Storybook Addon Themes in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/README.md

This JavaScript configuration snippet adds `@storybook/addon-themes` to the `addons` array in your `.storybook/main.js` file, enabling the addon within your Storybook project.

```js
export default {
  addons: ['@storybook/addon-themes']
};
```

--------------------------------

### Install Storybook Addon Manually via Package Manager

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/install-addons.mdx

Install a Storybook addon package using your preferred package manager (npm, yarn, pnpm). This example demonstrates installing the Accessibility addon.

```Shell
npm install --save-dev @storybook/addon-a11y
# or yarn add --dev @storybook/addon-a11y
# or pnpm add --save-dev @storybook/addon-a11y
```

--------------------------------

### Storybook Addon Toolbar Tool with Toggle Functionality

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-toolkit-types.md

This snippet demonstrates how to create a custom toolbar tool for a Storybook addon. It uses `useGlobals` to manage addon state, `useStorybookApi` to register keyboard shortcuts, and `IconButton` to render the tool. The tool toggles a global parameter and updates its active state, providing an interactive element in the Storybook UI.

```tsx
import React, { memo, useCallback, useEffect } from 'react';

import { useGlobals, useStorybookApi } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { LightningIcon } from '@storybook/icons';

import { ADDON_ID, PARAM_KEY, TOOL_ID } from './constants';

export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Measure [O]',
      defaultShortcut: ['O'],
      actionName: 'outline',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <IconButton key={TOOL_ID} active={isActive} title="Enable my addon" onClick={toggleMyTool}>
      <LightningIcon />
    </IconButton>
  );
});
```

--------------------------------

### Install and Configure Storybook Links Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/links/README.md

Instructions for installing the `@storybook/addon-links` package using yarn and configuring it in your Storybook `main.js` file by adding it to the `addons` array.

```sh
yarn add -D @storybook/addon-links
```

```js
export default {
  addons: ['@storybook/addon-links'],
};
```

--------------------------------

### Register Storybook Bootstrap Themes Addon in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/getting-started/bootstrap.md

This snippet demonstrates how to register the `@storybook/addon-themes` addon within your Storybook configuration. It shows the necessary modification to the `.storybook/main.js` file by adding the addon to the `addons` array.

```diff
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
+   '@storybook/addon-themes',
  ],
};
```

--------------------------------

### Registering a Storybook Addon and Tool (TypeScript)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-manager-initial-state.md

This TypeScript snippet demonstrates how to register a new addon in Storybook's manager UI. It uses `addons.register` to define the addon's entry point and then `addons.add` to introduce a specific tool. The tool's configuration includes its type (`types.TOOL`), display title, a `match` function to control its visibility based on Storybook's UI state (e.g., only in 'story' view mode and without an active tab), and the React component (`Tool`) responsible for rendering its UI.

```typescript
import { addons, types } from 'storybook/manager-api';
import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './Tool';

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: Tool,
  });
});
```

--------------------------------

### Install Storybook Webpack 5 SWC Compiler Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-compiler-swc-auto-install.md

These commands demonstrate how to install the `@storybook/addon-webpack5-compiler-swc` addon for Storybook. This addon integrates SWC for faster compilation with Webpack 5 in Storybook projects. Choose the command corresponding to your preferred package manager.

```shell
npx storybook@latest add @storybook/addon-webpack5-compiler-swc
```

```shell
pnpm dlx storybook@latest add @storybook/addon-webpack5-compiler-swc
```

```shell
yarn dlx storybook@latest add @storybook/addon-webpack5-compiler-swc
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

### Register Storybook Toolbar Addon with React Component

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-toolbar-example.md

This JavaScript code snippet demonstrates how to register a Storybook addon that adds a custom toolbar item. It uses the `addons.register` function to define the addon and `addons.add` to configure a UI element of type `TOOL`. The `match` property ensures the toolbar item is visible only when viewing a story, and the `render` function provides a React `IconButton` with an `OutlineIcon` for the toolbar.

```javascript
import React from 'react';

import { addons, types } from 'storybook/manager-api';
import { IconButton } from 'storybook/internal/components';
import { OutlineIcon } from '@storybook/icons';

addons.register('my-addon', () => {
  addons.add('my-addon/toolbar', {
    title: 'Example Storybook toolbar',
    type: types.TOOL,
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: ({ active }) => (
      <IconButton active={active} title="Show a Storybook toolbar">
        <OutlineIcon />
      </IconButton>
    )
  });
});
```

--------------------------------

### Configure Storybook Toolbar Options

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

Options configurable under the `toolbar` namespace for Storybook UI configuration.

```APIDOC
toolbar options:
- [id]: String - Toggle visibility for a specific toolbar item (e.g. title, zoom) (Example: { hidden: false })
```

--------------------------------

### Migrate Storybook Addon Knobs Import Path

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Storybook 4.x introduces generic addon decorators that are no longer tied to specific view layers. This change affects the import path for addons like `addon-knobs`, making them more universal.

```js
import { number } from "@storybook/addon-knobs/react";
```

```js
import { number } from "@storybook/addon-knobs";
```

--------------------------------

### Install Storybook Addon Outline

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/core/src/outline/README.md

This command installs the Storybook Addon Outline package as a development dependency using npm. It's required to use the addon in your Storybook project.

```sh
npm i -D @storybook/addon-outline
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

### Setting Query Parameters with api.setQueryParams()

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

The `api.setQueryParams()` method enables setting query string parameters, useful for temporary storage by addons. Parameters can be removed by setting their value to `null`.

```APIDOC
api.setQueryParams(params: object): void
  params: An object where keys are query parameter names and values are their desired string values. Set a value to 'null' to remove the parameter.
```

--------------------------------

### Remove Storybook Onboarding Addon from main.js configuration

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/onboarding/README.md

Modifies the `.storybook/main.js` configuration file to remove the `@storybook/addon-onboarding` entry from the `addons` array. This deactivates the addon within Storybook, completing its uninstallation.

```diff
const config = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
-   "@storybook/addon-onboarding"
  ],
};
export default config;
```

--------------------------------

### Configure Storybook Controls and Docs Addons

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-preview-auto-docs-override-theme.md

This configuration sets up Storybook's `controls` addon to automatically infer control types for properties matching color or date patterns. It also configures the `docs` addon to use the `dark` theme for documentation pages, ensuring a consistent visual experience.

```js
import { themes, ensure } from 'storybook/theming';

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: ensure(themes.dark),
    },
  },
};
```

```ts
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Preview } from '@storybook/your-framework';

import { themes, ensure } from 'storybook/theming';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: ensure(themes.dark),
    },
  },
};

export default preview;
```

--------------------------------

### Registering a Storybook Manager Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-selectincurrentkind.md

This snippet shows how to register a manager-side Storybook addon. The `addons.register` function takes a unique ID for the addon and a callback function. The callback receives the Storybook API object, which can be used to interact with the Storybook UI and data, such as programmatically selecting a story.

```JavaScript
addons.register('my-organisation/my-addon', (api) => {
  api.selectInCurrentKind('Default');
});
```

--------------------------------

### Storybook Info Addon: Custom Styles with Function

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/__mocks__/inject-decorator.stories.txt

Illustrates how to gain full control over Info Addon styles by providing a function to the `styles` option, which receives the default stylesheet and allows for comprehensive modifications.

```JavaScript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BaseButton from '../components/BaseButton';

storiesOf('Addons|Info.Options.styles', module)
  .add(
    'Full control over styles using a function',
    withInfo({
      styles: stylesheet => ({
        ...stylesheet,
        header: {
          ...stylesheet.header,
          h1: {
            ...stylesheet.header.h1,
            color: 'red',
          },
        },
      }),
    })(() => <BaseButton label="Button" />)
  );
```

--------------------------------

### Storybook UI Components Reference

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addon-knowledge-base.mdx

A list of recommended Storybook UI components available for addon development, including links to their source code and storybook examples.

```APIDOC
Action Bar:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/ActionBar/ActionBar.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-actionbar--single-item
Addon Panel:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/addon-panel/addon-panel.tsx
  Story: N/A
Badge:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/Badge/Badge.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-badge--all-badges
Button:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/Button/Button.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-button--all-buttons
Form:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/form/index.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-form-button--sizes
Loader:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/Loader/Loader.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-loader--progress-bar
PlaceHolder:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/placeholder/placeholder.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-placeholder--single-child
Scroll Area:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/ScrollArea/ScrollArea.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-scrollarea--vertical
Space:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/spaced/Spaced.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-spaced--row
Syntax Highlighter:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/syntaxhighlighter/syntaxhighlighter.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-syntaxhighlighter--bash
Tabs:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/tabs/tabs.tsx
  Story: https://main--5a375b97f4b14f0020b0cda3.chromatic.com/?path=/story/basics-tabs--stateful-static
ToolBar:
  Source: https://github.com/storybookjs/storybook/blob/next/code/core/src/components/components/bar/bar.tsx
  Story: N/A
```

--------------------------------

### Configure Storybook Addon Outline in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/core/src/outline/README.md

This JavaScript configuration snippet adds the '@storybook/addon-outline' addon to your Storybook project's `main.js` file. This makes the addon active and available in the Storybook UI.

```js
export default {
  addons: ['@storybook/addon-outline']
};
```

--------------------------------

### Registering Storybook Addons in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-main-register-addon.md

This JavaScript snippet demonstrates how to configure Storybook by registering manager-level addons. The `addons` array in `.storybook/main.js` specifies paths to custom manager entries or pre-built Storybook addons, extending Storybook's UI and functionality.

```js
export default {
  addons: ['path/to/manager.js'],
};
```

--------------------------------

### Registering a Storybook Tab Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Demonstrates how to register a TAB type addon using `addons.register` and `addons.add`. It highlights that `match` or `route` properties are no longer specified for TAB addons, as Storybook automatically handles routing based on the addon's ID.

```tsx
import { addons, types } from "@storybook/manager-api";

addons.register("my-addon", () => {
  addons.add("my-addon/tab", {
    type: types.TAB,
    title: "My Addon",
    render: () => <div>Hello World</div>
  });
});
```

--------------------------------

### Install Storybook Tailwind CSS Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/addons/themes/docs/getting-started/tailwind.md

Instructions to add the `@storybook/addon-themes` package as a development dependency using different package managers.

```zsh
yarn add -D @storybook/addon-themes
```

```zsh
npm install -D @storybook/addon-themes
```

```zsh
pnpm add -D @storybook/addon-themes
```

--------------------------------

### Configure Storybook Parameters for Pseudo States

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/configure-addons.mdx

This JavaScript snippet demonstrates how to define a story in Storybook and configure parameters for the `pseudo` addon, specifically enabling the `hover` state for a component. Parameters allow global, component, or story-level configuration of addon behavior, accessible via the `useParameter` hook.

```js
export const Hover = {
  render: () => <Button>Label</Button>,
  parameters: { pseudo: { hover: true } },
};
```

--------------------------------

### Configure Storybook Sidebar Options

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addons-api.mdx

Options configurable under the `sidebar` namespace for Storybook UI configuration.

```APIDOC
sidebar options:
- showRoots: Boolean - Display the top-level nodes as a "root" in the sidebar (Example: false)
- collapsedRoots: Array - Set of root node IDs to visually collapse by default (Example: ['misc', 'other'])
- renderLabel: Function - Create a custom label for tree nodes; must return a ReactNode (Example: (item, api) => <abbr title=\"...">{item.name}</abbr>)
```

--------------------------------

### Register Storybook Addon and Select Story (JavaScript)

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-selectstory.md

Registers a new Storybook addon with a unique ID ('my-organisation/my-addon') and uses the provided Storybook API instance to programmatically select a specific story ('Button', 'Default') when the addon is initialized. This code typically resides in a manager-side file for the addon.

```javascript
addons.register('my-organisation/my-addon', (api) => {
  api.selectStory('Button', 'Default');
});
```

--------------------------------

### Registering a Storybook Tab Addon in JavaScript

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addon-tab-example.md

This snippet demonstrates how to register a new tab within the Storybook manager UI. It uses the `addons.register` function to define the addon and `addons.add` to specify its type as a `TAB`, providing a title and a React component for rendering its content.

```JavaScript
import React from 'react';

import { addons, types } from 'storybook/manager-api';

addons.register('my-addon', () => {
  addons.add('my-addon/tab', {
    type: types.TAB,
    title: 'Example Storybook tab',
    render: () => (
      <div>
        <h2>I'm a tabbed addon in Storybook</h2>
      </div>
    )
  });
});
```

--------------------------------

### Configure Storybook to enable Accessibility Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/addon-a11y-register.md

This configuration snippet demonstrates how to add the `@storybook/addon-a11y` to your Storybook project. By including this addon in the `addons` array within your `.storybook/main.js` or `.storybook/main.ts` file, you enable automated accessibility checks for your stories.

```js
export default {
  // Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite, angular, etc.)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y' //👈 The a11y addon goes here
  ]
};
```

```ts
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite, angular, etc.)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y' //👈 The a11y addon goes here
  ]
};

export default config;
```

--------------------------------

### Storybook 6.0 Addon Deprecations

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Storybook 6.0 deprecates several addons, including `addon-info`, `addon-notes`, `addon-contexts`, `addon-centered`, and `polymer`. Users should migrate to recommended alternatives where available.

```APIDOC
Deprecated Addons in Storybook 6.0:
- addon-info
- addon-notes
- addon-contexts
- addon-centered
- polymer
```

--------------------------------

### Registering a Storybook Manager Addon

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/_snippets/storybook-addons-api-register.md

This snippet shows the basic structure for registering a new addon with Storybook's manager UI. The `addons.register` function takes a unique ID for the addon and a callback function that receives the Storybook API object.

```JavaScript
import { addons } from 'storybook/preview-api';

// Register the addon with a unique name.
addons.register('my-organisation/my-addon', (api) => {});
```