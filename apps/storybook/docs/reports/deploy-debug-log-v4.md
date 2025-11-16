Starting deployment of storybook to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 zg0s8k0g0cc0ko0c88080oc4
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: zg0s8k0g0cc0ko0c88080oc4
[CMD]: docker rm -f zg0s8k0g0cc0ko0c88080oc4
Error response from daemon: No such container: zg0s8k0g0cc0ko0c88080oc4
[CMD]: docker run -d --network coolify --name zg0s8k0g0cc0ko0c88080oc4  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
3c89667008146a8326c7dc51b76635a4f39c899e2e938241559204fc20176a7b
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
28608ee9b187e1f38790e14cdd182c8c67f04ec8	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha 28608ee9b187e1f38790e14cdd182c8c67f04ec8) to /artifacts/zg0s8k0g0cc0ko0c88080oc4.
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/zg0s8k0g0cc0ko0c88080oc4' && cd '/artifacts/zg0s8k0g0cc0ko0c88080oc4' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/zg0s8k0g0cc0ko0c88080oc4'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/zg0s8k0g0cc0ko0c88080oc4' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/zg0s8k0g0cc0ko0c88080oc4'...
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'cd /artifacts/zg0s8k0g0cc0ko0c88080oc4/apps/storybook && git log -1 28608ee9b187e1f38790e14cdd182c8c67f04ec8 --pretty=%B'
fix(storybook): correct Docker build context path
The build was failing because Coolify runs from apps/storybook/ directory
but the Dockerfile needs access to root files (package.json, pnpm-workspace.yaml).
Changed:
- context: ../.. → context: ../../
- dockerfile: apps/storybook/Dockerfile → dockerfile: ./apps/storybook/Dockerfile
This ensures the build context is the repository root when Coolify
executes from the apps/storybook directory.
Fixes: '/pnpm-workspace.yaml': not found error
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'test -f /artifacts/zg0s8k0g0cc0ko0c88080oc4/apps/storybook/../.././apps/storybook/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'cat /artifacts/zg0s8k0g0cc0ko0c88080oc4/apps/storybook/../.././apps/storybook/Dockerfile'
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
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='28608ee9b187e1f38790e14cdd182c8c67f04ec8'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK='storybook'
SERVICE_URL_STORYBOOK='https://storybook.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK='storybook.ozean-licht.dev'
Adding build arguments to Docker Compose build command.
[CMD]: docker exec zg0s8k0g0cc0ko0c88080oc4 bash -c 'SOURCE_COMMIT=28608ee9b187e1f38790e14cdd182c8c67f04ec8 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=jc8oks8gc40w4w4sgw80k8sk COOLIFY_CONTAINER_NAME=jc8oks8gc40w4w4sgw80k8sk-172315238055  docker compose --env-file /artifacts/build-time.env --project-name jc8oks8gc40w4w4sgw80k8sk --project-directory /artifacts/zg0s8k0g0cc0ko0c88080oc4/apps/storybook -f /artifacts/zg0s8k0g0cc0ko0c88080oc4/apps/storybook/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK --build-arg SERVICE_URL_STORYBOOK --build-arg COOLIFY_BUILD_SECRETS_HASH=8289ce56e837afb00c11c9829065ea7190e9163bdce36cfd91f7a61ce5956b18'
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
#8 [builder  5/10] RUN npm install -g pnpm@9.15.0
#8 CACHED
#9 [builder  6/10] RUN pnpm install --frozen-lockfile
#9 CACHED
#10 [builder  7/10] COPY apps/storybook ./apps/storybook
#10 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::m5f4dh1o9bwabzsy5scrai05i: "/apps/storybook": not found
#11 [builder  4/10] COPY apps/storybook/package.json ./apps/storybook/
#11 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::m5f4dh1o9bwabzsy5scrai05i: "/apps/storybook/package.json": not found
#12 [builder  3/10] COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
#12 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::m5f4dh1o9bwabzsy5scrai05i: "/pnpm-lock.yaml": not found
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
Dockerfile:21
--------------------
19 |
20 |     # Copy source files
21 | >>> COPY apps/storybook ./apps/storybook
22 |     COPY shared ./shared
23 |
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::m5f4dh1o9bwabzsy5scrai05i: "/apps/storybook": not found
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile:21
--------------------
19 |
20 |     # Copy source files
21 | >>> COPY apps/storybook ./apps/storybook
22 |     COPY shared ./shared
23 |
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::m5f4dh1o9bwabzsy5scrai05i: "/apps/storybook": not found
exit status 1
Gracefully shutting down build container: zg0s8k0g0cc0ko0c88080oc4
[CMD]: docker stop --time=30 zg0s8k0g0cc0ko0c88080oc4
Flag --time has been deprecated, use --timeout instead
zg0s8k0g0cc0ko0c88080oc4
[CMD]: docker rm -f zg0s8k0g0cc0ko0c88080oc4
Error response from daemon: No such container: zg0s8k0g0cc0ko0c88080oc4