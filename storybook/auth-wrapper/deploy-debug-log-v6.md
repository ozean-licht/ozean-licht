Starting deployment of Components to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 fgk80wcco44sssk0s040sgwc
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: fgk80wcco44sssk0s040sgwc
[CMD]: docker rm -f fgk80wcco44sssk0s040sgwc
Error response from daemon: No such container: fgk80wcco44sssk0s040sgwc
[CMD]: docker run -d --network coolify --name fgk80wcco44sssk0s040sgwc  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
7a7e60eba89369ec2573b3b4bc3f91ae9c657cc8511c0870370f49b0dd9109da
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
fe5fae34f3baf234354e66e93e818ac6d86cabe9	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha fe5fae34f3baf234354e66e93e818ac6d86cabe9) to /artifacts/fgk80wcco44sssk0s040sgwc.
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/fgk80wcco44sssk0s040sgwc' && cd '/artifacts/fgk80wcco44sssk0s040sgwc' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/fgk80wcco44sssk0s040sgwc'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/fgk80wcco44sssk0s040sgwc' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/fgk80wcco44sssk0s040sgwc'...
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'cd /artifacts/fgk80wcco44sssk0s040sgwc/storybook/auth-wrapper && git log -1 fe5fae34f3baf234354e66e93e818ac6d86cabe9 --pretty=%B'
fix(docker): add root .dockerignore to include storybook/build
Docker was using .gitignore as fallback, which excluded storybook/build/.
This caused "storybook/build not found" errors during Coolify deployment.
Solution: Create explicit .dockerignore at monorepo root that:
- Excludes everything by default (*)
- Explicitly includes storybook/build/ and storybook/auth-wrapper/
- Excludes node_modules and build artifacts from auth-wrapper
The build context is the monorepo root (context: ../..), so Docker
needs .dockerignore at that level, not in subdirectories.
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'test -f /artifacts/fgk80wcco44sssk0s040sgwc/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'cat /artifacts/fgk80wcco44sssk0s040sgwc/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile'
# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook static files
# Stage 2: Build Next.js application
# Stage 3: Production runtime
# Stage 1: Copy pre-built Storybook files
FROM node:18-alpine AS storybook-provider
WORKDIR /build
# IMPORTANT: Storybook must be built BEFORE Docker build
# Run: pnpm build-storybook
# This copies the pre-built static files instead of building in Docker
COPY storybook/build ./storybook-static
# Stage 2: Build Next.js wrapper
FROM node:18 AS nextjs-builder
WORKDIR /app
# Copy package files
COPY storybook/auth-wrapper/package*.json ./
RUN npm ci --only=production
# Copy source code
COPY storybook/auth-wrapper .
# Copy Storybook build from previous stage
COPY --from=storybook-provider /build/storybook-static ./public/storybook-static
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
Added 48 ARG declarations to Dockerfile for service storybook-auth (multi-stage build, added to 3 stages).
Pulling & building required images.
Creating build-time .env file in /artifacts (outside Docker context).
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='fe5fae34f3baf234354e66e93e818ac6d86cabe9'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK-AUTH='storybook-auth'
SERVICE_URL_STORYBOOK_AUTH='components.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK_AUTH=''
AUTH_SECRET="DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U="
DATABASE_URL="postgresql://postgres:7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ@localhost:32771/shared-users-db"
NEXT_PUBLIC_STORYBOOK_DEV_URL="http://localhost:6006"
NEXTAUTH_SECRET="DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U="
NEXTAUTH_URL="https://components.ozean-licht.dev"
POSTGRES_DATABASE="shared-users-db"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ"
POSTGRES_PORT="32771"
POSTGRES_USER="postgres"
STORYBOOK_DEV_URL="http://localhost:6006"
Adding build arguments to Docker Compose build command.
[CMD]: docker exec fgk80wcco44sssk0s040sgwc bash -c 'SOURCE_COMMIT=fe5fae34f3baf234354e66e93e818ac6d86cabe9 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=bokockkgwggccwg04k0ow0cs COOLIFY_CONTAINER_NAME=bokockkgwggccwg04k0ow0cs-124605387726  docker compose --env-file /artifacts/build-time.env --project-name bokockkgwggccwg04k0ow0cs --project-directory /artifacts/fgk80wcco44sssk0s040sgwc/storybook/auth-wrapper -f /artifacts/fgk80wcco44sssk0s040sgwc/storybook/auth-wrapper/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK_AUTH --build-arg SERVICE_URL_STORYBOOK_AUTH --build-arg AUTH_SECRET --build-arg DATABASE_URL --build-arg NEXT_PUBLIC_STORYBOOK_DEV_URL --build-arg NEXTAUTH_SECRET --build-arg NEXTAUTH_URL --build-arg POSTGRES_DATABASE --build-arg POSTGRES_HOST --build-arg POSTGRES_PASSWORD --build-arg POSTGRES_PORT --build-arg POSTGRES_USER --build-arg STORYBOOK_DEV_URL --build-arg COOLIFY_BUILD_SECRETS_HASH=71b99a1dde23fe7b54d2f2e5330d52df1c087c696455295bffa19962e79baac7'
#1 [internal] load local bake definitions
#1 reading from stdin 1.55kB done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.51kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 0.6s
#4 [internal] load metadata for docker.io/library/node:18
#4 DONE 0.6s
#5 [internal] load .dockerignore
#5 transferring context: 570B done
#5 DONE 0.0s
#6 [nextjs-builder 1/7] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#6 DONE 0.0s
#7 [storybook-provider 1/3] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#7 DONE 0.0s
#8 [runner 2/7] WORKDIR /app
#8 CACHED
#9 [internal] load build context
#9 transferring context: 271.93kB done
#9 DONE 0.0s
#10 [storybook-provider 2/3] WORKDIR /build
#10 CACHED
#11 [storybook-provider 3/3] COPY storybook/build ./storybook-static
#11 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::syudytftmel0yttcwp05ulw4p: "/storybook/build": not found
#12 [runner 3/7] RUN addgroup --system --gid 1001 nodejs
#12 DONE 0.2s
------
> [storybook-provider 3/3] COPY storybook/build ./storybook-static:
------
Dockerfile:30
--------------------
28 |     # Run: pnpm build-storybook
29 |     # This copies the pre-built static files instead of building in Docker
30 | >>> COPY storybook/build ./storybook-static
31 |
32 |     # Stage 2: Build Next.js wrapper
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::syudytftmel0yttcwp05ulw4p: "/storybook/build": not found
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile:30
--------------------
28 |     # Run: pnpm build-storybook
29 |     # This copies the pre-built static files instead of building in Docker
30 | >>> COPY storybook/build ./storybook-static
31 |
32 |     # Stage 2: Build Next.js wrapper
--------------------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::syudytftmel0yttcwp05ulw4p: "/storybook/build": not found
exit status 1
Gracefully shutting down build container: fgk80wcco44sssk0s040sgwc
[CMD]: docker stop --time=30 fgk80wcco44sssk0s040sgwc
Flag --time has been deprecated, use --timeout instead
fgk80wcco44sssk0s040sgwc
[CMD]: docker rm -f fgk80wcco44sssk0s040sgwc
Error response from daemon: No such container: fgk80wcco44sssk0s040sgwc