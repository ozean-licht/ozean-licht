# Storybook Version History and Changelog

**Query:** version history changelog
**Timestamp:** 2025-11-17T08:22:14.631Z
**Library:** /storybookjs/storybook/v9.0.15

---

### Write Release Changelogs

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Generates and writes the changelog file for the specified next version. This step ensures that all new features, bug fixes, and breaking changes are properly documented for the release.

```Yarn
yarn release:write-changelog <NEXT_VERSION_FROM_PREVIOUS_STEP> --verbose
```

--------------------------------

### Commit Changelog Update

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Commits the updated `CHANGELOG.md` file with a message indicating the new version has been added manually.

```Shell
git commit -m "Update CHANGELOG.md with <NEXT_VERSION> MANUALLY"
```

--------------------------------

### Stage All Git Changes

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Adds all modified, new, and deleted files to the Git staging area. This prepares the changes, including version bumps and changelog updates, for the next commit.

```Shell
git add .
```

--------------------------------

### Update Storybook devDependency in package.json

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/addons/addon-migration-guide.mdx

This snippet shows how to update the `storybook` package version in the `devDependencies` section of `package.json` for Storybook 9.0. It demonstrates using 'next', 'latest', or a specific version like '^9.0.0' to ensure the correct Storybook version is used during development.

```diff
{
  "devDependencies": {
    "storybook": "next" // or "latest", or "^9.0.0"
  }
}
```

--------------------------------

### Cherry-pick Changelog to Next Branch

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Checks out the `next` branch, cherry-picks the commit containing the changelog modifications, and pushes the changes to the remote repository.

```Shell
git checkout next
git cherry-pick <CHANGELOG_COMMIT_HASH>
git push
```

--------------------------------

### Ember HBS Import Path Migration

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CHANGELOG.v6.md

This snippet shows the updated import statement for the `hbs` helper in Ember applications, migrating to `ember-cli-htmlbars` for template compilation. This change ensures compatibility with newer Ember CLI versions.

```JavaScript
import { hbs } from 'ember-cli-htmlbars'
```

--------------------------------

### Migrate experimental_afterEach hook to stable afterEach

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/MIGRATION.md

Update Storybook stories and configuration files by renaming the `experimental_afterEach` hook to its stable counterpart, `afterEach`, for consistent API usage.

```diff
 export const MyStory = {
-   experimental_afterEach: async ({ canvasElement }) => {
+   afterEach: async ({ canvasElement }) => {
     // cleanup logic
   }
 };
```

--------------------------------

### Storybook 8: Removed Packages and Replacements

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/docs/migration-guide/from-older-version.mdx

Lists packages removed in Storybook 8 and their recommended replacements, guiding users on necessary dependency updates for a successful migration.

```APIDOC
Package Removals in Storybook 8:
- @storybook/addons: Replaced by @storybook/manager-api or @storyboook/preview-api
- @storybook/channel-postmessage: Replaced by @storybook/channels
- @storybook/channel-websocket: Replaced by @storybook/channels
- @storybook/client-api: Replaced by @storybook/preview-api
- @storybook/core-client: Replaced by @storybook/preview-api
- @storybook/preview-web: Replaced by @storybook/preview-api
- @storybook/store: Replaced by @storybook/preview-api
- @storybook/api: Replaced by @storybook/manager-api
```

--------------------------------

### Storybook Full Release Workflow

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING.old.md

This set of shell commands outlines the process for a full Storybook release. It requires syncing with the `main` branch, generating and committing the final changelog, executing a clean build, publishing the latest stable version, and then navigating to the GitHub releases page for post-publication tasks.

```sh
# make sure you current with origin/main.
git checkout main
git status

# generate changelog and edit as appropriate
# generates a vNext section
yarn changelog x.y.z

# Edit the changelog/PRs as needed, then commit
git commit -m "x.y.z changelog"

# clean build
yarn bootstrap --reset --core

# publish and tag the release
yarn run publish:latest

# update the release page
open https://github.com/storybookjs/storybook/releases
```

--------------------------------

### Commit Manual Version Bump

Source: https://github.com/storybookjs/storybook/blob/v9.0.15/CONTRIBUTING/RELEASING.md

Commits the version changes with a specific message indicating the manual version bump from the current to the next version.

```Shell
git commit -m "Bump version from <CURRENT_VERSION> to <NEXT_VERSION> MANUALLY"
```