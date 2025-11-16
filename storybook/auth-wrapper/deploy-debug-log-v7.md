Starting deployment of Components to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 dgkws0sk8o04o0w8s0gwcsws
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: dgkws0sk8o04o0w8s0gwcsws
[CMD]: docker rm -f dgkws0sk8o04o0w8s0gwcsws
Error response from daemon: No such container: dgkws0sk8o04o0w8s0gwcsws
[CMD]: docker run -d --network coolify --name dgkws0sk8o04o0w8s0gwcsws  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
25194d1951b2f5a5dadf315d868e8856b6537ff87dab9d17033c3d2c8bbbd1f5
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
e17be75416a7352aa09c7a7550f9f585f30a242d	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha e17be75416a7352aa09c7a7550f9f585f30a242d) to /artifacts/dgkws0sk8o04o0w8s0gwcsws.
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/dgkws0sk8o04o0w8s0gwcsws' && cd '/artifacts/dgkws0sk8o04o0w8s0gwcsws' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/dgkws0sk8o04o0w8s0gwcsws'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/dgkws0sk8o04o0w8s0gwcsws' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/dgkws0sk8o04o0w8s0gwcsws'...
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'cd /artifacts/dgkws0sk8o04o0w8s0gwcsws/storybook/auth-wrapper && git log -1 e17be75416a7352aa09c7a7550f9f585f30a242d --pretty=%B'
fix(storybook-auth): complete Docker build fixes for production deployment
Critical fixes for successful Coolify deployment:
1. **Fixed .dockerignore** - Proper pattern to include storybook/build
- Use /* pattern to exclude root items
- Explicitly include !/ storybook, then exclude /storybook/*
- Then include !/storybook/build and !/storybook/auth-wrapper
2. **Fixed npm install** - Changed from `npm ci --only=production` to `npm ci`
- Production-only skips TypeScript and Next.js build dependencies
- Full install needed for successful build
3. **Fixed TypeScript linting error** - lib/auth/config.ts:67
- Changed authorize return type from Promise<any> to proper union type
- Promise<{id: string; email: string; adminUserId: string; adminRole: string} | null>
Build tested locally and succeeds in ~12 seconds.
Ready for Coolify deployment.
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'test -f /artifacts/dgkws0sk8o04o0w8s0gwcsws/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'cat /artifacts/dgkws0sk8o04o0w8s0gwcsws/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile'
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
RUN npm ci
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
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='e17be75416a7352aa09c7a7550f9f585f30a242d'
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
[CMD]: docker exec dgkws0sk8o04o0w8s0gwcsws bash -c 'SOURCE_COMMIT=e17be75416a7352aa09c7a7550f9f585f30a242d COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=bokockkgwggccwg04k0ow0cs COOLIFY_CONTAINER_NAME=bokockkgwggccwg04k0ow0cs-125410020190  docker compose --env-file /artifacts/build-time.env --project-name bokockkgwggccwg04k0ow0cs --project-directory /artifacts/dgkws0sk8o04o0w8s0gwcsws/storybook/auth-wrapper -f /artifacts/dgkws0sk8o04o0w8s0gwcsws/storybook/auth-wrapper/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK_AUTH --build-arg SERVICE_URL_STORYBOOK_AUTH --build-arg AUTH_SECRET --build-arg DATABASE_URL --build-arg NEXT_PUBLIC_STORYBOOK_DEV_URL --build-arg NEXTAUTH_SECRET --build-arg NEXTAUTH_URL --build-arg POSTGRES_DATABASE --build-arg POSTGRES_HOST --build-arg POSTGRES_PASSWORD --build-arg POSTGRES_PORT --build-arg POSTGRES_USER --build-arg STORYBOOK_DEV_URL --build-arg COOLIFY_BUILD_SECRETS_HASH=cd30f93c2fde0e80f079b1161351f52768c6bf5d306427074c9242872ae3b3b8'
#1 [internal] load local bake definitions
#1 reading from stdin 1.55kB done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.49kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 0.2s
#4 [internal] load metadata for docker.io/library/node:18
#4 DONE 0.2s
#5 [internal] load .dockerignore
#5 transferring context: 729B done
#5 DONE 0.0s
#6 [nextjs-builder 1/7] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#6 DONE 0.0s
#7 [storybook-provider 1/3] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#7 DONE 0.0s
#8 [runner 2/7] WORKDIR /app
#8 CACHED
#9 [runner 3/7] RUN addgroup --system --gid 1001 nodejs
#9 CACHED
#10 [internal] load build context
#10 transferring context: 271.56kB done
#10 DONE 0.0s
#11 [storybook-provider 2/3] WORKDIR /build
#11 CACHED
#12 [storybook-provider 3/3] COPY storybook/build ./storybook-static
#12 ERROR: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::f13yzjchy8cnm8zhce9acr3in: "/storybook/build": not found
#13 [nextjs-builder 2/7] WORKDIR /app
#13 CACHED
#14 [nextjs-builder 3/7] COPY storybook/auth-wrapper/package*.json ./
#14 CACHED
#15 [runner 4/7] RUN adduser --system --uid 1001 nextjs
#15 DONE 0.2s
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
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::f13yzjchy8cnm8zhce9acr3in: "/storybook/build": not found
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
failed to solve: failed to compute cache key: failed to calculate checksum of ref 85b54d85-a7b8-40e3-85e5-b96f5eb0ecb6::f13yzjchy8cnm8zhce9acr3in: "/storybook/build": not found
exit status 1
Gracefully shutting down build container: dgkws0sk8o04o0w8s0gwcsws
[CMD]: docker stop --time=30 dgkws0sk8o04o0w8s0gwcsws
Flag --time has been deprecated, use --timeout instead
dgkws0sk8o04o0w8s0gwcsws
[CMD]: docker rm -f dgkws0sk8o04o0w8s0gwcsws
Error response from daemon: No such container: dgkws0sk8o04o0w8s0gwcsws