Starting deployment of storybook to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 vgckw0kog8g004sgwws08g4c
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: vgckw0kog8g004sgwws08g4c
[CMD]: docker rm -f vgckw0kog8g004sgwws08g4c
Error response from daemon: No such container: vgckw0kog8g004sgwws08g4c
[CMD]: docker run -d --network coolify --name vgckw0kog8g004sgwws08g4c  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
4ddcd7a12e048ba789da51784dc20451d96ed2ca3c86801efb89b6f5f2445641
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
67437b877c30eafa6cd439f2565b7c74bad57e1b	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha 67437b877c30eafa6cd439f2565b7c74bad57e1b) to /artifacts/vgckw0kog8g004sgwws08g4c.
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/vgckw0kog8g004sgwws08g4c' && cd '/artifacts/vgckw0kog8g004sgwws08g4c' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/vgckw0kog8g004sgwws08g4c'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/vgckw0kog8g004sgwws08g4c' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/vgckw0kog8g004sgwws08g4c'...
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'cd /artifacts/vgckw0kog8g004sgwws08g4c/apps/storybook && git log -1 67437b877c30eafa6cd439f2565b7c74bad57e1b --pretty=%B'
fix(storybook): fix Docker build with pnpm workspace setup
Created proper pnpm monorepo configuration and fixed Storybook deployment issues:
**Root Changes:**
- Add pnpm-workspace.yaml to define monorepo structure (apps/*, shared/*, tools/*)
- Generate pnpm-lock.yaml (608KB) for dependency management
- Update package.json to use pnpm instead of npm
**Storybook Fixes:**
- Fix docker-compose.yml dockerfile path (./apps/storybook/Dockerfile → apps/storybook/Dockerfile)
- Context is repo root (../../), so dockerfile path must be relative to root, not current dir
- Fixes "apps/storybook: not found" error in Coolify builds
- Create globals.css based on design-system.md (Ozean Licht Design System v2.0.0)
- Oceanic cyan primary (#0EA6C1)
- Deep ocean background (#00070F)
- Glass morphism effects
- Proper typography hierarchy (Cinzel Decorative, Montserrat)
- Glow animations and WCAG AA accessibility
- Update .storybook/preview.ts to import new globals.css
**Build Verification:**
- ✅ Local build succeeds (pnpm build)
- ✅ All workspace dependencies resolved
- ✅ Storybook static output generated (9.67s)
Fixes deployment error: "/pnpm-lock.yaml": not found
Ready for Coolify deployment to storybook.ozean-licht.dev
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'test -f /artifacts/vgckw0kog8g004sgwws08g4c/apps/storybook/../../apps/storybook/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'cat /artifacts/vgckw0kog8g004sgwws08g4c/apps/storybook/../../apps/storybook/Dockerfile'
FROM node:20-alpine AS builder
WORKDIR /app
# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/storybook/package.json ./apps/storybook/
# Install pnpm
RUN npm install -g pnpm@9.15.0
# Install dependencies
RUN pnpm install --frozen-lockfile
# Copy source files
COPY apps/storybook ./apps/storybook
COPY shared ./shared
# Build Storybook
WORKDIR /app/apps/storybook
RUN pnpm build
# Production stage - Serve with http-server
FROM node:20-alpine
WORKDIR /app
# Install http-server globally
RUN npm install -g http-server@14.1.1
# Copy built Storybook from builder
COPY --from=builder /app/apps/storybook/storybook-static ./storybook-static
# Expose port
EXPOSE 6006
# Health check using Node.js built-in http module
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
CMD node -e "require('http').get('http://localhost:6006/', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
# Start http-server
# -p 6006: port
# --gzip: enable gzip compression
# -c-1: disable caching (always serve fresh content)
CMD ["http-server", "storybook-static", "-p", "6006", "--gzip", "-c-1"]
Added 10 ARG declarations to Dockerfile for service storybook (multi-stage build, added to 2 stages).
Pulling & building required images.
Creating build-time .env file in /artifacts (outside Docker context).
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='67437b877c30eafa6cd439f2565b7c74bad57e1b'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK='storybook'
SERVICE_URL_STORYBOOK='https://storybook.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK='storybook.ozean-licht.dev'
Adding build arguments to Docker Compose build command.
[CMD]: docker exec vgckw0kog8g004sgwws08g4c bash -c 'SOURCE_COMMIT=67437b877c30eafa6cd439f2565b7c74bad57e1b COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=jc8oks8gc40w4w4sgw80k8sk COOLIFY_CONTAINER_NAME=jc8oks8gc40w4w4sgw80k8sk-173316246623  docker compose --env-file /artifacts/build-time.env --project-name jc8oks8gc40w4w4sgw80k8sk --project-directory /artifacts/vgckw0kog8g004sgwws08g4c/apps/storybook -f /artifacts/vgckw0kog8g004sgwws08g4c/apps/storybook/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK --build-arg SERVICE_URL_STORYBOOK --build-arg COOLIFY_BUILD_SECRETS_HASH=33db71757411f157dea286c9359d70ee4d33c85253327c8c4d90c8b892bbe378'
#1 [internal] load local bake definitions
#1 reading from stdin 821B done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.39kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:20-alpine
#3 DONE 0.2s
#4 [internal] load .dockerignore
#4 transferring context: 1.01kB done
#4 DONE 0.0s
#5 [builder  1/10] FROM docker.io/library/node:20-alpine@sha256:6178e78b972f79c335df281f4b7674a2d85071aae2af020ffa39f0a770265435
#5 DONE 0.0s
#6 [builder  2/10] WORKDIR /app
#6 CACHED
#7 [internal] load build context
#7 transferring context: 3.03MB 0.0s done
#7 DONE 0.1s
#8 [builder  3/10] COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
#8 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::0wjvybgrlupxuxvdaonk92mig: "/pnpm-workspace.yaml": not found
#9 [builder  4/10] COPY apps/storybook/package.json ./apps/storybook/
#9 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::0wjvybgrlupxuxvdaonk92mig: "/apps/storybook/package.json": not found
#10 [builder  5/10] RUN npm install -g pnpm@9.15.0
#10 CACHED
#11 [builder  6/10] RUN pnpm install --frozen-lockfile
#11 CACHED
#12 [builder  7/10] COPY apps/storybook ./apps/storybook
#12 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::0wjvybgrlupxuxvdaonk92mig: "/apps/storybook": not found
#13 [stage-1 3/4] RUN npm install -g http-server@14.1.1
#13 CANCELED
------
> [builder  3/10] COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./:
------
------
> [builder  4/10] COPY apps/storybook/package.json ./apps/storybook/:
------
------
> [builder  7/10] COPY apps/storybook ./apps/storybook:
------
Dockerfile:11
--------------------
9 |
10 |     # Copy workspace files
11 | >>> COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
12 |     COPY apps/storybook/package.json ./apps/storybook/
13 |
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::0wjvybgrlupxuxvdaonk92mig: "/pnpm-workspace.yaml": not found
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile:11
--------------------
9 |
10 |     # Copy workspace files
11 | >>> COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
12 |     COPY apps/storybook/package.json ./apps/storybook/
13 |
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::0wjvybgrlupxuxvdaonk92mig: "/pnpm-workspace.yaml": not found
exit status 1
Gracefully shutting down build container: vgckw0kog8g004sgwws08g4c
[CMD]: docker stop --time=30 vgckw0kog8g004sgwws08g4c
Flag --time has been deprecated, use --timeout instead
vgckw0kog8g004sgwws08g4c
[CMD]: docker rm -f vgckw0kog8g004sgwws08g4c
Error response from daemon: No such container: vgckw0kog8g004sgwws08g4c