# Storybook Addons General

**Query:** addons
**Timestamp:** 2025-11-17T08:22:14.631Z
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

### Remove Storybook Addon with CLI

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/install-addons.mdx

Use the `storybook remove` command to automatically uninstall an addon and remove its configuration from Storybook. This simplifies the cleanup process for unwanted addons.

```Shell
npx storybook remove <addon-name>
```

--------------------------------

### Configure Storybook Viewport Addon in main.js

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/code/core/src/viewport/README.md

JavaScript configuration to enable the Viewport Addon in your Storybook project. This snippet should be added to your `.storybook/main.js` file to activate the addon.

```js
export default {
  addons: ['storybook/viewport']
};
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