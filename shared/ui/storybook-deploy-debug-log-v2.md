Starting deployment of storybook to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 ooooccg08swwwog8g4oss0o4
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: ooooccg08swwwog8g4oss0o4
[CMD]: docker rm -f ooooccg08swwwog8g4oss0o4
Error response from daemon: No such container: ooooccg08swwwog8g4oss0o4
[CMD]: docker run -d --network coolify --name ooooccg08swwwog8g4oss0o4  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
62b37c96f69779bb5f1e7a7fe0e370c5d4eb545644988a8b615c6fb921ae8c2c
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
37ff72f435efede50cb851a2b10b081a6c36a553	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha 37ff72f435efede50cb851a2b10b081a6c36a553) to /artifacts/ooooccg08swwwog8g4oss0o4.
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/ooooccg08swwwog8g4oss0o4' && cd '/artifacts/ooooccg08swwwog8g4oss0o4' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/ooooccg08swwwog8g4oss0o4'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/ooooccg08swwwog8g4oss0o4' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/ooooccg08swwwog8g4oss0o4'...
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'cd /artifacts/ooooccg08swwwog8g4oss0o4 && git log -1 37ff72f435efede50cb851a2b10b081a6c36a553 --pretty=%B'
fix(deployment): resolve Coolify build failures for Storybook
- Created standalone Dockerfile.storybook at root for Coolify deployment
- Fixed .dockerignore to properly include packages/shared-ui directory
- Updated docker-compose.storybook.yml to use the new Dockerfile
- Ensures complete monorepo structure is available during build
- Successfully tested local Docker build and container runtime
The issue was that .dockerignore was excluding the packages directory,
causing the build to fail when Coolify cloned and built the repository.
🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'test -f /artifacts/ooooccg08swwwog8g4oss0o4/Dockerfile.storybook && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'cat /artifacts/ooooccg08swwwog8g4oss0o4/Dockerfile.storybook'
# Standalone Dockerfile for Storybook deployment via Coolify
# This file should be at the root of the repository
FROM node:20-alpine AS builder
# Install pnpm
RUN npm install -g pnpm@9
WORKDIR /app
# Copy all monorepo files
# This ensures we have the complete structure even if Coolify does shallow clones
COPY . .
# Install dependencies for the entire workspace
RUN pnpm install --frozen-lockfile
# Build Storybook directly in the shared-ui package
WORKDIR /app/packages/shared-ui
RUN npx storybook build -o storybook-static
# Production stage
FROM nginx:alpine
# Copy built storybook to nginx
COPY --from=builder /app/packages/shared-ui/storybook-static /usr/share/nginx/html
# Custom nginx config
RUN echo 'server { \
listen 80; \
server_name _; \
root /usr/share/nginx/html; \
index index.html; \
location / { \
try_files $uri $uri/ /index.html; \
} \
gzip on; \
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
Added 10 ARG declarations to Dockerfile for service storybook (multi-stage build, added to 2 stages).
Pulling & building required images.
Creating build-time .env file in /artifacts (outside Docker context).
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='37ff72f435efede50cb851a2b10b081a6c36a553'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK='storybook'
SERVICE_URL_STORYBOOK='https://storybook.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK='storybook.ozean-licht.dev'
Adding build arguments to Docker Compose build command.
[CMD]: docker exec ooooccg08swwwog8g4oss0o4 bash -c 'SOURCE_COMMIT=37ff72f435efede50cb851a2b10b081a6c36a553 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=jc8oks8gc40w4w4sgw80k8sk COOLIFY_CONTAINER_NAME=jc8oks8gc40w4w4sgw80k8sk-114917086167  docker compose --env-file /artifacts/build-time.env --project-name jc8oks8gc40w4w4sgw80k8sk --project-directory /artifacts/ooooccg08swwwog8g4oss0o4 -f /artifacts/ooooccg08swwwog8g4oss0o4/docker-compose.storybook.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK --build-arg SERVICE_URL_STORYBOOK --build-arg COOLIFY_BUILD_SECRETS_HASH=4d9b9dd6724314933b76d1010bc1ab7c99a6d0122f9258483976788871dccbe8'
#1 [internal] load local bake definitions
#1 reading from stdin 816B done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile.storybook
#2 transferring dockerfile: 1.39kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 ...
#4 [internal] load metadata for docker.io/library/nginx:alpine
#4 DONE 0.8s
#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.8s
#5 [internal] load .dockerignore
#5 transferring context: 1.17kB done
#5 DONE 0.0s
#6 [stage-1 1/3] FROM docker.io/library/nginx:alpine@sha256:b3c656d55d7ad751196f21b7fd2e8d4da9cb430e32f646adcf92441b72f82b14
#6 DONE 0.0s
#7 [builder 1/7] FROM docker.io/library/node:20-alpine@sha256:6178e78b972f79c335df281f4b7674a2d85071aae2af020ffa39f0a770265435
#7 CACHED
#8 [internal] load build context
#8 transferring context: 1.50MB 0.0s done
#8 DONE 0.0s
#9 [builder 2/7] RUN npm install -g pnpm@9
#9 0.785
#9 0.785 added 1 package in 605ms
#9 0.785
#9 0.785 1 package is looking for funding
#9 0.785   run `npm fund` for details
#9 0.785 npm notice
#9 0.785 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#9 0.785 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#9 0.785 npm notice To update run: npm install -g npm@11.6.2
#9 0.785 npm notice
#9 DONE 0.8s
#10 [builder 3/7] WORKDIR /app
#10 DONE 0.0s
#11 [builder 4/7] COPY . .
#11 DONE 0.0s
#12 [builder 5/7] RUN pnpm install --frozen-lockfile
#12 0.410 Scope: all 3 workspace projects
#12 0.492 Lockfile is up to date, resolution step is skipped
#12 0.550 Progress: resolved 1, reused 0, downloaded 0, added 0
#12 0.680 Packages: +1008
#12 0.680 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#12 0.794
#12 0.794    ╭───────────────────────────────────────────────────────────────────╮
#12 0.794    │                                                                   │
#12 0.794    │                Update available! 9.15.9 → 10.22.0.                │
#12 0.794    │   Changelog: https://github.com/pnpm/pnpm/releases/tag/v10.22.0   │
#12 0.794    │                 Run "pnpm add -g pnpm" to update.                 │
#12 0.794    │                                                                   │
#12 0.794    ╰───────────────────────────────────────────────────────────────────╯
#12 0.794
#12 1.550 Progress: resolved 1008, reused 0, downloaded 243, added 242
#12 2.550 Progress: resolved 1008, reused 0, downloaded 515, added 512
#12 3.550 Progress: resolved 1008, reused 0, downloaded 713, added 711
#12 4.551 Progress: resolved 1008, reused 0, downloaded 1007, added 1007
#12 4.948 Progress: resolved 1008, reused 0, downloaded 1008, added 1008, done
#12 5.210 .../node_modules/@prisma/engines postinstall$ node scripts/postinstall.js
#12 5.243 .../node_modules/unrs-resolver postinstall$ napi-postinstall unrs-resolver 1.11.1 check
#12 5.244 .../@bundled-es-modules/glob postinstall$ patch-package
#12 5.297 .../esbuild@0.25.12/node_modules/esbuild postinstall$ node install.js
#12 5.325 .../node_modules/unrs-resolver postinstall: Done
#12 5.339 .../node_modules/@prisma/engines postinstall: prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#12 5.339 .../node_modules/@prisma/engines postinstall: Please manually install OpenSSL and try installing Prisma again.
#12 5.357 .../esbuild@0.25.12/node_modules/esbuild postinstall: Done
#12 5.422 .../@bundled-es-modules/glob postinstall: patch-package 8.0.1
#12 5.422 .../@bundled-es-modules/glob postinstall: Applying patches...
#12 5.423 .../@bundled-es-modules/glob postinstall: No patch files found
#12 5.428 .../@bundled-es-modules/glob postinstall: Done
#12 5.646 .../node_modules/@prisma/engines postinstall: Done
#12 5.712 .../node_modules/style-dictionary postinstall$ patch-package
#12 5.740 .../prisma@5.22.0/node_modules/prisma preinstall$ node scripts/preinstall-entry.js
#12 5.789 .../prisma@5.22.0/node_modules/prisma preinstall: Done
#12 5.842 .../node_modules/style-dictionary postinstall: patch-package 8.0.1
#12 5.842 .../node_modules/style-dictionary postinstall: Applying patches...
#12 5.842 .../node_modules/style-dictionary postinstall: No patch files found
#12 5.849 .../node_modules/style-dictionary postinstall: Done
#12 5.917 .../node_modules/@prisma/client postinstall$ node scripts/postinstall.js
#12 6.219 .../node_modules/@prisma/client postinstall: prisma:warn Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-1.1.x".
#12 6.219 .../node_modules/@prisma/client postinstall: Please manually install OpenSSL and try installing Prisma again.
#12 6.284 .../node_modules/@prisma/client postinstall: prisma:warn We could not find your Prisma schema in the default locations (see: https://pris.ly/d/prisma-schema-location).
#12 6.284 .../node_modules/@prisma/client postinstall: If you have a Prisma schema file in a custom path, you will need to run
#12 6.284 .../node_modules/@prisma/client postinstall: `prisma generate --schema=./path/to/your/schema.prisma` to generate Prisma Client.
#12 6.284 .../node_modules/@prisma/client postinstall: If you do not have a Prisma schema file yet, you can ignore this message.
#12 6.297 .../node_modules/@prisma/client postinstall: Done
#12 6.429
#12 6.429 dependencies:
#12 6.429 + @anthropic-ai/sdk 0.67.1
#12 6.429
#12 6.429 devDependencies:
#12 6.429 + @headlessui/react 2.2.9
#12 6.429 + @hookform/resolvers 5.2.2
#12 6.429 + @radix-ui/react-accordion 1.2.12
#12 6.429 + @radix-ui/react-alert-dialog 1.1.15
#12 6.429 + @radix-ui/react-aspect-ratio 1.1.8
#12 6.429 + @radix-ui/react-avatar 1.1.11
#12 6.429 + @radix-ui/react-checkbox 1.3.3
#12 6.429 + @radix-ui/react-collapsible 1.1.12
#12 6.429 + @radix-ui/react-context-menu 2.2.16
#12 6.429 + @radix-ui/react-dialog 1.1.15
#12 6.429 + @radix-ui/react-dropdown-menu 2.1.16
#12 6.429 + @radix-ui/react-hover-card 1.1.15
#12 6.429 + @radix-ui/react-icons 1.3.2
#12 6.429 + @radix-ui/react-label 2.1.8
#12 6.429 + @radix-ui/react-menubar 1.1.16
#12 6.429 + @radix-ui/react-navigation-menu 1.2.14
#12 6.429 + @radix-ui/react-popover 1.1.15
#12 6.429 + @radix-ui/react-progress 1.1.8
#12 6.429 + @radix-ui/react-radio-group 1.3.8
#12 6.429 + @radix-ui/react-scroll-area 1.2.10
#12 6.429 + @radix-ui/react-select 2.2.6
#12 6.429 + @radix-ui/react-separator 1.1.8
#12 6.429 + @radix-ui/react-slider 1.3.6
#12 6.429 + @radix-ui/react-slot 1.2.4
#12 6.429 + @radix-ui/react-switch 1.2.6
#12 6.429 + @radix-ui/react-tabs 1.1.13
#12 6.429 + @radix-ui/react-toast 1.2.15
#12 6.429 + @radix-ui/react-toggle 1.1.10
#12 6.429 + @radix-ui/react-toggle-group 1.1.11
#12 6.429 + @radix-ui/react-tooltip 1.2.8
#12 6.429 + @storybook/addon-a11y 8.6.14
#12 6.429 + @storybook/addon-essentials 8.6.14
#12 6.429 + @storybook/addon-interactions 8.6.14
#12 6.429 + @storybook/react-vite 8.6.14
#12 6.429 + @storybook/test 8.6.14
#12 6.429 + @testing-library/jest-dom 6.9.1
#12 6.429 + @testing-library/react 16.3.0
#12 6.429 + @vitejs/plugin-react 5.1.1
#12 6.429 + @vitest/ui 4.0.9
#12 6.429 + autoprefixer 10.4.22
#12 6.429 + class-variance-authority 0.7.1
#12 6.429 + clsx 2.1.1
#12 6.429 + cmdk 1.1.1
#12 6.429 + date-fns 4.1.0
#12 6.429 + embla-carousel-react 8.6.0
#12 6.429 + happy-dom 20.0.10
#12 6.429 + input-otp 1.4.2
#12 6.429 + lucide-react 0.553.0
#12 6.429 + motion 12.23.24
#12 6.429 + next-themes 0.4.6
#12 6.429 + pnpm 9.15.9
#12 6.429 + postcss 8.5.6
#12 6.429 + react 18.3.1
#12 6.429 + react-day-picker 9.11.1
#12 6.429 + react-dom 18.3.1
#12 6.429 + react-hook-form 7.66.0
#12 6.429 + react-resizable-panels 3.0.6
#12 6.429 + recharts 2.15.4
#12 6.429 + sonner 2.0.7
#12 6.429 + storybook 8.6.14
#12 6.429 + style-dictionary 4.4.0
#12 6.429 + tailwind-merge 2.6.0
#12 6.429 + tailwindcss 3.4.18
#12 6.429 + tailwindcss-animate 1.0.7
#12 6.429 + terser 5.44.1
#12 6.429 + vaul 1.1.2
#12 6.429 + vitest 4.0.9
#12 6.429 + zod 4.1.12
#12 6.429
#12 6.525 Done in 6.3s using pnpm v9.15.9
#12 DONE 6.7s
#13 [builder 6/7] WORKDIR /app/packages/shared-ui
#13 DONE 0.0s
#14 [builder 7/7] RUN npx storybook build -o storybook-static
#14 0.741 @storybook/core v8.6.14
#14 0.741
#14 0.744 info => Cleaning outputDir: storybook-static
#14 0.790 SB_CORE-SERVER_0006 (MainFileMissingError): No configuration files have been found in your configDir: ./.storybook.
#14 0.790 Storybook needs a "main.js" file, please add it.
#14 0.790
#14 0.790 You can pass a --config-dir flag to tell Storybook, where your main.js file is located at.
#14 0.790
#14 0.790 More info: https://storybook.js.org/docs/configure
#14 0.790
#14 0.790     at validateConfigurationFiles (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/common/index.cjs:16327:11)
#14 0.790     at async loadMainConfig (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/common/index.cjs:17535:3)
#14 0.790     at async buildStaticStandalone (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/core-server/index.cjs:35427:11)
#14 0.790     at async withTelemetry (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/core-server/index.cjs:35788:12)
#14 0.790     at async build (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/cli/bin/index.cjs:5837:3)
#14 0.790     at async s.<anonymous> (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/cli/bin/index.cjs:6072:7)
#14 0.793 /app/node_modules/.pnpm/storybook@8.6.14_prettier@3.6.2/node_modules/storybook/bin/index.cjs:23
#14 0.793   throw error;
#14 0.793   ^
#14 0.793
#14 0.793 SB_CORE-SERVER_0006 (MainFileMissingError): No configuration files have been found in your configDir: /app/packages/shared-ui/.storybook.
#14 0.793 Storybook needs a "main.js" file, please add it.
#14 0.793
#14 0.793 You can pass a --config-dir flag to tell Storybook, where your main.js file is located at.
#14 0.793
#14 0.793 More info: https://storybook.js.org/docs/configure
#14 0.793
#14 0.793     at validateConfigurationFiles (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/common/index.cjs:16327:11) {
#14 0.793   data: { location: '/app/packages/shared-ui/.storybook' },
#14 0.793   fromStorybook: true,
#14 0.793   category: 'CORE-SERVER',
#14 0.793   documentation: 'https://storybook.js.org/docs/configure',
#14 0.793   code: 6
#14 0.793 }
#14 0.793
#14 0.793 Node.js v20.19.5
#14 ERROR: process "/bin/sh -c npx storybook build -o storybook-static" did not complete successfully: exit code: 7
------
> [builder 7/7] RUN npx storybook build -o storybook-static:
0.793
0.793     at validateConfigurationFiles (/app/node_modules/.pnpm/@storybook+core@8.6.14_prettier@3.6.2_storybook@8.6.14_prettier@3.6.2_/node_modules/@storybook/core/dist/common/index.cjs:16327:11) {
0.793   data: { location: '/app/packages/shared-ui/.storybook' },
0.793   fromStorybook: true,
0.793   category: 'CORE-SERVER',
0.793   documentation: 'https://storybook.js.org/docs/configure',
0.793   code: 6
0.793 }
0.793
0.793 Node.js v20.19.5
------
Dockerfile.storybook:24
--------------------
22 |     # Build Storybook directly in the shared-ui package
23 |     WORKDIR /app/packages/shared-ui
24 | >>> RUN npx storybook build -o storybook-static
25 |
26 |     # Production stage
--------------------
failed to solve: process "/bin/sh -c npx storybook build -o storybook-static" did not complete successfully: exit code: 7
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile.storybook:24
--------------------
22 |     # Build Storybook directly in the shared-ui package
23 |     WORKDIR /app/packages/shared-ui
24 | >>> RUN npx storybook build -o storybook-static
25 |
26 |     # Production stage
--------------------
failed to solve: process "/bin/sh -c npx storybook build -o storybook-static" did not complete successfully: exit code: 7
exit status 1
Gracefully shutting down build container: ooooccg08swwwog8g4oss0o4
[CMD]: docker stop --time=30 ooooccg08swwwog8g4oss0o4
Flag --time has been deprecated, use --timeout instead
ooooccg08swwwog8g4oss0o4
[CMD]: docker rm -f ooooccg08swwwog8g4oss0o4
Error response from daemon: No such container: ooooccg08swwwog8g4oss0o4