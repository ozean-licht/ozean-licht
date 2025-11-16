Starting deployment of Components to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 hwwkokg0kgsc80cc40sggcsg
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: hwwkokg0kgsc80cc40sggcsg
[CMD]: docker rm -f hwwkokg0kgsc80cc40sggcsg
Error response from daemon: No such container: hwwkokg0kgsc80cc40sggcsg
[CMD]: docker run -d --network coolify --name hwwkokg0kgsc80cc40sggcsg  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
60f1e55cbd4720b9ae33acb426f9e9cb0f01e9839ba83aceecb6cb2524c295e9
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
5ced476c2633b7aafef496d1192834fdb0858893	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha 5ced476c2633b7aafef496d1192834fdb0858893) to /artifacts/hwwkokg0kgsc80cc40sggcsg.
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/hwwkokg0kgsc80cc40sggcsg' && cd '/artifacts/hwwkokg0kgsc80cc40sggcsg' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/hwwkokg0kgsc80cc40sggcsg'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/hwwkokg0kgsc80cc40sggcsg' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/hwwkokg0kgsc80cc40sggcsg'...
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'cd /artifacts/hwwkokg0kgsc80cc40sggcsg/storybook/auth-wrapper && git log -1 5ced476c2633b7aafef496d1192834fdb0858893 --pretty=%B'
fix(storybook): use full Node.js image instead of Alpine
Alpine Linux doesn't properly support crypto.hash() required by Vite 7.
Switching to full node:18 image resolves the build error.
Error: crypto.hash is not a function (Vite build)
Trade-off: Slightly larger image (~300MB vs ~100MB) but builds succeed.
🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
----------------------------------------
⚠️ Build-time environment variable warning: NODE_ENV=developement
Affects: Node.js/npm/yarn/bun/pnpm
Issue: Skips devDependencies installation which are often required for building (webpack, typescript, etc.)
Recommendation: Uncheck "Available at Buildtime" or use "development" during build
💡 Tips to resolve build issues:
1. Set these variables as "Runtime only" in the environment variables settings
2. Use different values for build-time (e.g., NODE_ENV=development for build)
3. Consider using multi-stage Docker builds to separate build and runtime environments
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'test -f /artifacts/hwwkokg0kgsc80cc40sggcsg/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'cat /artifacts/hwwkokg0kgsc80cc40sggcsg/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile'
# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook static files
# Stage 2: Build Next.js application
# Stage 3: Production runtime
# Stage 1: Build Storybook (use full image for crypto support)
FROM node:18 AS storybook-builder
WORKDIR /build
# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./
# Install pnpm
RUN npm install -g pnpm
# Copy source files needed for Storybook build
COPY storybook/config ./storybook/config
COPY storybook/ai-mvp ./storybook/ai-mvp
COPY storybook/mocks ./storybook/mocks
COPY storybook/templates ./storybook/templates
COPY storybook/postcss.config.js ./storybook/
COPY storybook/tailwind.config.js ./storybook/
COPY shared/ui ./shared/ui
COPY apps/admin/app/globals.css ./apps/admin/app/globals.css
COPY apps/admin/tailwind.config.js ./apps/admin/
# Install dependencies (allow lockfile updates for Docker build)
RUN pnpm install --no-frozen-lockfile
# Build Storybook static files
RUN pnpm build-storybook
# Stage 2: Build Next.js wrapper (use full image for consistency)
FROM node:18 AS nextjs-builder
WORKDIR /app
# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci --only=production
# Copy source code
COPY storybook/auth-wrapper .
# Copy Storybook build from previous stage
COPY --from=storybook-builder /build/storybook-static ./public/storybook-static
# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN npm run build
# Stage 3: Production runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Copy necessary files
COPY --from=nextjs-builder /app/public ./public
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3002
ENV PORT 3002
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
Added 51 ARG declarations to Dockerfile for service storybook-auth (multi-stage build, added to 3 stages).
Pulling & building required images.
Creating build-time .env file in /artifacts (outside Docker context).
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='5ced476c2633b7aafef496d1192834fdb0858893'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK-AUTH='storybook-auth'
SERVICE_URL_STORYBOOK_AUTH='components.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK_AUTH=''
AUTH_SECRET="DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U="
DATABASE_URL="postgresql://postgres:7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ@localhost:32771/shared-users-db"
NEXT_PUBLIC_STORYBOOK_DEV_URL="http://localhost:6006"
NEXTAUTH_SECRET="DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U="
NEXTAUTH_URL="http://localhost:3002"
NODE_ENV="developement"
POSTGRES_DATABASE="shared-users-db"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ"
POSTGRES_PORT="32771"
POSTGRES_USER="postgres"
STORYBOOK_DEV_URL="http://localhost:6006"
Adding build arguments to Docker Compose build command.
[CMD]: docker exec hwwkokg0kgsc80cc40sggcsg bash -c 'SOURCE_COMMIT=5ced476c2633b7aafef496d1192834fdb0858893 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=bokockkgwggccwg04k0ow0cs COOLIFY_CONTAINER_NAME=bokockkgwggccwg04k0ow0cs-123033661668  docker compose --env-file /artifacts/build-time.env --project-name bokockkgwggccwg04k0ow0cs --project-directory /artifacts/hwwkokg0kgsc80cc40sggcsg/storybook/auth-wrapper -f /artifacts/hwwkokg0kgsc80cc40sggcsg/storybook/auth-wrapper/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK_AUTH --build-arg SERVICE_URL_STORYBOOK_AUTH --build-arg AUTH_SECRET --build-arg DATABASE_URL --build-arg NEXT_PUBLIC_STORYBOOK_DEV_URL --build-arg NEXTAUTH_SECRET --build-arg NEXTAUTH_URL --build-arg NODE_ENV --build-arg POSTGRES_DATABASE --build-arg POSTGRES_HOST --build-arg POSTGRES_PASSWORD --build-arg POSTGRES_PORT --build-arg POSTGRES_USER --build-arg STORYBOOK_DEV_URL --build-arg COOLIFY_BUILD_SECRETS_HASH=3eb25300136a229b8b85cc709d1795f778578988d9056c249778110638184aed'
#1 [internal] load local bake definitions
#1 reading from stdin 1.57kB done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 3.13kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 0.2s
#4 [internal] load metadata for docker.io/library/node:18
#4 DONE 0.8s
#5 [internal] load .dockerignore
#5 transferring context: 2B done
#5 DONE 0.0s
#6 [runner 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#6 DONE 0.0s
#7 [runner 2/7] WORKDIR /app
#7 CACHED
#8 [internal] load build context
#8 transferring context: 3.15MB 0.0s done
#8 DONE 0.1s
#9 [storybook-builder  1/15] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#9 resolve docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783 0.0s done
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 0B / 48.49MB 0.1s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 0B / 64.40MB 0.1s
#9 sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783 6.41kB / 6.41kB done
#9 sha256:eb29363371ee2859fad6a3c5af88d4abc6ff7d399addb13b7de3c1f11bdee6b9 2.49kB / 2.49kB done
#9 sha256:b50082bc3670d0396b2d90e4b0e5bb10265ba5d0ee16bf40f9a505f7045ee563 6.39kB / 6.39kB done
#9 sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84 0B / 24.02MB 0.1s
#9 ...
#10 [runner 3/7] RUN addgroup --system --gid 1001 nodejs
#10 DONE 0.2s
#9 [storybook-builder  1/15] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#9 sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84 3.15MB / 24.02MB 0.2s
#9 ...
#11 [runner 4/7] RUN adduser --system --uid 1001 nextjs
#11 DONE 0.2s
#9 [storybook-builder  1/15] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#9 sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84 13.63MB / 24.02MB 0.3s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 5.74MB / 48.49MB 0.5s
#9 sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84 24.02MB / 24.02MB 0.4s done
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 0B / 211.36MB 0.5s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 11.53MB / 48.49MB 0.6s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 5.24MB / 64.40MB 0.6s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 22.02MB / 48.49MB 0.8s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 16.78MB / 64.40MB 0.8s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 28.31MB / 48.49MB 0.9s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 23.07MB / 64.40MB 0.9s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 36.70MB / 48.49MB 1.1s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 33.55MB / 64.40MB 1.1s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 46.14MB / 48.49MB 1.3s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 42.99MB / 64.40MB 1.3s
#9 sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 48.49MB / 48.49MB 1.3s done
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 49.28MB / 64.40MB 1.4s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 12.58MB / 211.36MB 1.4s
#9 extracting sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 0.1s
#9 sha256:cda7f44f2bddcc4bb7514474024b3f3705de00ddb6355a33be5ac7808e5b7125 0B / 3.32kB 1.4s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 54.53MB / 64.40MB 1.5s
#9 sha256:cda7f44f2bddcc4bb7514474024b3f3705de00ddb6355a33be5ac7808e5b7125 3.32kB / 3.32kB 1.5s done
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 0B / 45.68MB 1.5s
#9 sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 64.40MB / 64.40MB 1.7s done
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 27.26MB / 211.36MB 1.7s
#9 sha256:3697be50c98b9d071df4637e1d3491d00e7b9f3a732768c876d82309b3c5a145 0B / 1.25MB 1.7s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 40.89MB / 211.36MB 2.0s
#9 extracting sha256:3e6b9d1a95114e19f12262a4e8a59ad1d1a10ca7b82108adcf0605a200294964 0.7s done
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 9.44MB / 45.68MB 2.0s
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 15.73MB / 45.68MB 2.1s
#9 sha256:3697be50c98b9d071df4637e1d3491d00e7b9f3a732768c876d82309b3c5a145 1.25MB / 1.25MB 2.1s done
#9 extracting sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 57.67MB / 211.36MB 2.3s
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 25.17MB / 45.68MB 2.3s
#9 sha256:461077a72fb7fe40d34a37d6a1958c4d16772d0dd77f572ec50a1fdc41a3754d 0B / 446B 2.3s
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 29.36MB / 45.68MB 2.4s
#9 extracting sha256:37927ed901b1b2608b72796c6881bf645480268eca4ac9a37b9219e050bb4d84 0.2s done
#9 sha256:461077a72fb7fe40d34a37d6a1958c4d16772d0dd77f572ec50a1fdc41a3754d 446B / 446B 2.4s
#9 extracting sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 69.21MB / 211.36MB 2.5s
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 34.60MB / 45.68MB 2.5s
#9 sha256:461077a72fb7fe40d34a37d6a1958c4d16772d0dd77f572ec50a1fdc41a3754d 446B / 446B 2.4s done
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 45.68MB / 45.68MB 2.7s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 83.89MB / 211.36MB 2.8s
#9 sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 45.68MB / 45.68MB 2.8s done
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 97.52MB / 211.36MB 3.0s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 110.10MB / 211.36MB 3.2s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 122.68MB / 211.36MB 3.4s
#9 extracting sha256:79b2f47ad4443652b9b5cc81a95ede249fd976310efdbee159f29638783778c0 0.8s done
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 137.36MB / 211.36MB 3.6s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 149.95MB / 211.36MB 3.8s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 163.58MB / 211.36MB 4.0s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 178.26MB / 211.36MB 4.2s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 196.08MB / 211.36MB 4.5s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 208.67MB / 211.36MB 4.7s
#9 sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 211.36MB / 211.36MB 4.8s done
#9 extracting sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 0.1s
#9 extracting sha256:e23f099911d692f62b851cf49a1e93294288a115f5cd2d014180e4d3684d34ab 2.1s done
#9 extracting sha256:cda7f44f2bddcc4bb7514474024b3f3705de00ddb6355a33be5ac7808e5b7125 done
#9 extracting sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7
#9 extracting sha256:c6b30c3f16966552af10ac00521f60355b1fcfd46ac1c20b1038587e28583ce7 0.7s done
#9 extracting sha256:3697be50c98b9d071df4637e1d3491d00e7b9f3a732768c876d82309b3c5a145 0.0s done
#9 extracting sha256:461077a72fb7fe40d34a37d6a1958c4d16772d0dd77f572ec50a1fdc41a3754d done
#9 DONE 7.8s
#12 [nextjs-builder 2/7] WORKDIR /app
#12 DONE 0.5s
#13 [storybook-builder  2/15] WORKDIR /build
#13 DONE 0.5s
#14 [nextjs-builder 3/7] COPY storybook/auth-wrapper/package*.json ./
#14 DONE 0.0s
#15 [storybook-builder  3/15] COPY package.json pnpm-lock.yaml* ./
#15 DONE 0.0s
#16 [storybook-builder  4/15] RUN npm install -g pnpm
#16 0.853
#16 0.853 added 1 package in 626ms
#16 0.853
#16 0.853 1 package is looking for funding
#16 0.853   run `npm fund` for details
#16 0.855 npm notice
#16 0.855 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#16 0.855 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#16 0.855 npm notice To update run: npm install -g npm@11.6.2
#16 0.855 npm notice
#16 DONE 0.9s
#17 [storybook-builder  5/15] COPY storybook/config ./storybook/config
#17 DONE 0.1s
#18 [nextjs-builder 4/7] RUN npm ci --only=production
#18 0.255 npm warn config only Use `--omit=dev` to omit dev dependencies from the install.
#18 ...
#19 [storybook-builder  6/15] COPY storybook/ai-mvp ./storybook/ai-mvp
#19 DONE 0.1s
#20 [storybook-builder  7/15] COPY storybook/mocks ./storybook/mocks
#20 DONE 0.3s
#18 [nextjs-builder 4/7] RUN npm ci --only=production
#18 ...
#21 [storybook-builder  8/15] COPY storybook/templates ./storybook/templates
#21 DONE 0.1s
#22 [storybook-builder  9/15] COPY storybook/postcss.config.js ./storybook/
#22 DONE 0.0s
#23 [storybook-builder 10/15] COPY storybook/tailwind.config.js ./storybook/
#23 DONE 0.1s
#18 [nextjs-builder 4/7] RUN npm ci --only=production
#18 ...
#24 [storybook-builder 11/15] COPY shared/ui ./shared/ui
#24 DONE 0.1s
#25 [storybook-builder 12/15] COPY apps/admin/app/globals.css ./apps/admin/app/globals.css
#25 DONE 0.0s
#26 [storybook-builder 13/15] COPY apps/admin/tailwind.config.js ./apps/admin/
#26 DONE 0.0s
#27 [storybook-builder 14/15] RUN pnpm install --no-frozen-lockfile
#27 0.559 Progress: resolved 1, reused 0, downloaded 0, added 0
#27 1.561 Progress: resolved 67, reused 0, downloaded 64, added 0
#27 ...
#18 [nextjs-builder 4/7] RUN npm ci --only=production
#18 3.850
#18 3.850 added 52 packages, and audited 53 packages in 4s
#18 3.850
#18 3.850 9 packages are looking for funding
#18 3.850   run `npm fund` for details
#18 3.851
#18 3.851 found 0 vulnerabilities
#18 3.852 npm notice
#18 3.852 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#18 3.852 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#18 3.852 npm notice To update run: npm install -g npm@11.6.2
#18 3.852 npm notice
#18 DONE 4.3s
#28 [nextjs-builder 5/7] COPY storybook/auth-wrapper .
#28 DONE 0.0s
#27 [storybook-builder 14/15] RUN pnpm install --no-frozen-lockfile
#27 2.562 Progress: resolved 98, reused 0, downloaded 94, added 0
#27 3.579 Progress: resolved 173, reused 0, downloaded 155, added 0
#27 4.579 Progress: resolved 312, reused 0, downloaded 289, added 0
#27 5.579 Progress: resolved 504, reused 0, downloaded 447, added 0
#27 6.580 Progress: resolved 610, reused 0, downloaded 563, added 0
#27 6.922 Packages: +568
#27 6.922 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
#27 7.254 Progress: resolved 614, reused 0, downloaded 568, added 568, done
#27 7.490  WARN  Issues with peer dependencies found
#27 7.490 .
#27 7.490 └─┬ @storybook/react-vite 8.6.14
#27 7.490   ├── ✕ unmet peer vite@"^4.0.0 || ^5.0.0 || ^6.0.0": found 7.2.2
#27 7.490   ├─┬ @joshwooding/vite-plugin-react-docgen-typescript 0.5.0
#27 7.490   │ └── ✕ unmet peer vite@"^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0": found 7.2.2
#27 7.490   └─┬ @storybook/builder-vite 8.6.14
#27 7.490     └── ✕ unmet peer vite@"^4.0.0 || ^5.0.0 || ^6.0.0": found 7.2.2
#27 7.493
#27 7.493 dependencies:
#27 7.493 + @anthropic-ai/sdk 0.67.1 (0.69.0 is available)
#27 7.493
#27 7.493 devDependencies:
#27 7.493 + @headlessui/react 2.2.9
#27 7.493 + @hookform/resolvers 5.2.2
#27 7.493 + @radix-ui/react-accordion 1.2.12
#27 7.493 + @radix-ui/react-alert-dialog 1.1.15
#27 7.493 + @radix-ui/react-aspect-ratio 1.1.8
#27 7.493 + @radix-ui/react-avatar 1.1.11
#27 7.493 + @radix-ui/react-checkbox 1.3.3
#27 7.493 + @radix-ui/react-collapsible 1.1.12
#27 7.493 + @radix-ui/react-context-menu 2.2.16
#27 7.493 + @radix-ui/react-dialog 1.1.15
#27 7.493 + @radix-ui/react-dropdown-menu 2.1.16
#27 7.493 + @radix-ui/react-hover-card 1.1.15
#27 7.493 + @radix-ui/react-icons 1.3.2
#27 7.493 + @radix-ui/react-label 2.1.8
#27 7.493 + @radix-ui/react-menubar 1.1.16
#27 7.493 + @radix-ui/react-navigation-menu 1.2.14
#27 7.493 + @radix-ui/react-popover 1.1.15
#27 7.493 + @radix-ui/react-progress 1.1.8
#27 7.493 + @radix-ui/react-radio-group 1.3.8
#27 7.493 + @radix-ui/react-scroll-area 1.2.10
#27 7.493 + @radix-ui/react-select 2.2.6
#27 7.493 + @radix-ui/react-separator 1.1.8
#27 7.493 + @radix-ui/react-slider 1.3.6
#27 7.493 + @radix-ui/react-slot 1.2.4
#27 7.493 + @radix-ui/react-switch 1.2.6
#27 7.493 + @radix-ui/react-tabs 1.1.13
#27 7.493 + @radix-ui/react-toast 1.2.15
#27 7.493 + @radix-ui/react-toggle 1.1.10
#27 7.493 + @radix-ui/react-toggle-group 1.1.11
#27 7.493 + @radix-ui/react-tooltip 1.2.8
#27 7.493 + @storybook/addon-a11y 8.6.14 (10.0.7 is available)
#27 7.493 + @storybook/addon-essentials 8.6.14
#27 7.493 + @storybook/addon-interactions 8.6.14
#27 7.493 + @storybook/react-vite 8.6.14 (10.0.7 is available)
#27 7.493 + @storybook/test 8.6.14
#27 7.493 + @testing-library/jest-dom 6.9.1
#27 7.493 + @testing-library/react 16.3.0
#27 7.493 + @vitejs/plugin-react 5.1.1
#27 7.493 + @vitest/ui 4.0.9
#27 7.493 + autoprefixer 10.4.22
#27 7.493 + class-variance-authority 0.7.1
#27 7.493 + clsx 2.1.1
#27 7.493 + cmdk 1.1.1
#27 7.493 + date-fns 4.1.0
#27 7.493 + embla-carousel-react 8.6.0
#27 7.493 + happy-dom 20.0.10
#27 7.493 + input-otp 1.4.2
#27 7.493 + lucide-react 0.553.0
#27 7.493 + motion 12.23.24
#27 7.493 + next-themes 0.4.6
#27 7.493 + postcss 8.5.6
#27 7.493 + react 18.3.1 (19.2.0 is available)
#27 7.493 + react-day-picker 9.11.1
#27 7.493 + react-dom 18.3.1 (19.2.0 is available)
#27 7.493 + react-hook-form 7.66.0
#27 7.493 + react-resizable-panels 3.0.6
#27 7.493 + recharts 2.15.4 (3.4.1 is available)
#27 7.493 + sonner 2.0.7
#27 7.493 + storybook 8.6.14 (10.0.7 is available)
#27 7.493 + style-dictionary 4.4.0 (5.1.1 is available)
#27 7.493 + tailwind-merge 2.6.0 (3.4.0 is available)
#27 7.493 + tailwindcss 3.4.18 (4.1.17 is available)
#27 7.493 + tailwindcss-animate 1.0.7
#27 7.493 + terser 5.44.1
#27 7.493 + vaul 1.1.2
#27 7.493 + vitest 4.0.9
#27 7.493 + zod 4.1.12
#27 7.493
#27 7.493 ╭ Warning ─────────────────────────────────────────────────────────────────────╮
#27 7.493 │                                                                              │
#27 7.493 │   Ignored build scripts: @bundled-es-modules/glob, esbuild,                  │
#27 7.493 │   style-dictionary.                                                          │
#27 7.493 │   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
#27 7.493 │   to run scripts.                                                            │
#27 7.493 │                                                                              │
#27 7.493 ╰──────────────────────────────────────────────────────────────────────────────╯
#27 7.493
#27 7.529 Done in 7.3s using pnpm v10.22.0
#27 DONE 7.9s
#29 [storybook-builder 15/15] RUN pnpm build-storybook
#29 0.345
#29 0.345 > @ build-storybook /build
#29 0.345 > storybook build --config-dir storybook/config -o storybook/build
#29 0.345
#29 0.676 @storybook/core v8.6.14
#29 0.676
#29 0.678 info => Cleaning outputDir: storybook/build
#29 0.755 info => Loading presets
#29 1.000 info => Building manager..
#29 1.080 info => Manager built (80 ms)
#29 1.082 info => Building preview..
#29 1.093 WARN No story files found for the specified pattern: apps/admin/components/**/*.stories.@(js|jsx|mjs|ts|tsx)
#29 1.093 WARN No story files found for the specified pattern: apps/ozean-licht/components/**/*.stories.@(js|jsx|mjs|ts|tsx)
#29 3.195 ⚠ AI Iteration plugin not available: Cannot find module '/build/storybook/ai-mvp/vite-plugin' imported from /build/storybook/config/main.ts
#29 4.291 vite v7.2.2 building client environment for production...
#29 4.321 ✓ 0 modules transformed.
#29 4.323 ✗ Build failed in 18ms
#29 4.323 => Failed to build the preview
#29 4.323 [vite:build-html] crypto.hash is not a function
#29 4.323 file: ./storybook/iframe.html
#29 4.323     at getHash (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:2680:21)
#29 4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24611:22
#29 4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24384:2)
#29 4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
#29 4.323     at Array.forEach (<anonymous>)
#29 4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:118)
#29 4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
#29 4.323     at Array.forEach (<anonymous>)
#29 4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:118)
#29 4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
#29 4.368  ELIFECYCLE  Command failed with exit code 1.
#29 ERROR: process "/bin/sh -c pnpm build-storybook" did not complete successfully: exit code: 1
------
> [storybook-builder 15/15] RUN pnpm build-storybook:
4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24611:22
4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24384:2)
4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
4.323     at Array.forEach (<anonymous>)
4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:118)
4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
4.323     at Array.forEach (<anonymous>)
4.323     at traverseNodes (file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:118)
4.323     at file://./node_modules/.pnpm/vite@7.2.2_@types+node@20.19.25_jiti@1.21.7_terser@5.44.1_yaml@2.8.1/node_modules/vite/dist/node/chunks/config.js:24385:141
4.368  ELIFECYCLE  Command failed with exit code 1.
------
Dockerfile:49
--------------------
47 |
48 |     # Build Storybook static files
49 | >>> RUN pnpm build-storybook
50 |
51 |     # Stage 2: Build Next.js wrapper (use full image for consistency)
--------------------
failed to solve: process "/bin/sh -c pnpm build-storybook" did not complete successfully: exit code: 1
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile:49
--------------------
47 |
48 |     # Build Storybook static files
49 | >>> RUN pnpm build-storybook
50 |
51 |     # Stage 2: Build Next.js wrapper (use full image for consistency)
--------------------
failed to solve: process "/bin/sh -c pnpm build-storybook" did not complete successfully: exit code: 1
exit status 1
Gracefully shutting down build container: hwwkokg0kgsc80cc40sggcsg
[CMD]: docker stop --time=30 hwwkokg0kgsc80cc40sggcsg
Flag --time has been deprecated, use --timeout instead
hwwkokg0kgsc80cc40sggcsg
[CMD]: docker rm -f hwwkokg0kgsc80cc40sggcsg
Error response from daemon: No such container: hwwkokg0kgsc80cc40sggcsg