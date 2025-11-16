Starting deployment of Components to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 j4woo04o8so8wko4sw4g0s8k
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: j4woo04o8so8wko4sw4g0s8k
[CMD]: docker rm -f j4woo04o8so8wko4sw4g0s8k
Error response from daemon: No such container: j4woo04o8so8wko4sw4g0s8k
[CMD]: docker run -d --network coolify --name j4woo04o8so8wko4sw4g0s8k  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
27fadd9c64621bd5302d4fd49a0738193f76784d7aeb5c676fb87c6d807444bd
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
f8fba599ec64f8652ce8f154aec9264f4b89d882	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha f8fba599ec64f8652ce8f154aec9264f4b89d882) to /artifacts/j4woo04o8so8wko4sw4g0s8k.
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/j4woo04o8so8wko4sw4g0s8k' && cd '/artifacts/j4woo04o8so8wko4sw4g0s8k' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/j4woo04o8so8wko4sw4g0s8k'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/j4woo04o8so8wko4sw4g0s8k' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/j4woo04o8so8wko4sw4g0s8k'...
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'cd /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper && git log -1 f8fba599ec64f8652ce8f154aec9264f4b89d882 --pretty=%B'
fix(storybook-auth): create network instead of requiring external
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'test -f /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'cat /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/../../storybook/auth-wrapper/Dockerfile'
# Multi-stage Dockerfile for Storybook Auth Wrapper
# Stage 1: Build Storybook from source
# Stage 2: Build Next.js application
# Stage 3: Production runtime
# Stage 1: Copy pre-built Storybook (built locally with `npm run build-storybook`)
FROM node:18-alpine AS storybook-provider
WORKDIR /build
# Copy pre-built Storybook static files
# IMPORTANT: Run `npm run build-storybook` locally before Docker build
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
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='f8fba599ec64f8652ce8f154aec9264f4b89d882'
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
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'SOURCE_COMMIT=f8fba599ec64f8652ce8f154aec9264f4b89d882 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=bokockkgwggccwg04k0ow0cs COOLIFY_CONTAINER_NAME=bokockkgwggccwg04k0ow0cs-130642743946  docker compose --env-file /artifacts/build-time.env --project-name bokockkgwggccwg04k0ow0cs --project-directory /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper -f /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK_AUTH --build-arg SERVICE_URL_STORYBOOK_AUTH --build-arg AUTH_SECRET --build-arg DATABASE_URL --build-arg NEXT_PUBLIC_STORYBOOK_DEV_URL --build-arg NEXTAUTH_SECRET --build-arg NEXTAUTH_URL --build-arg POSTGRES_DATABASE --build-arg POSTGRES_HOST --build-arg POSTGRES_PASSWORD --build-arg POSTGRES_PORT --build-arg POSTGRES_USER --build-arg STORYBOOK_DEV_URL --build-arg COOLIFY_BUILD_SECRETS_HASH=3f57dfbbea2abf216e3736de87b6c57f9da49807b23a7a197ce215cf96f853e1'
#1 [internal] load local bake definitions
#1 reading from stdin 1.55kB done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 2.49kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:18-alpine
#3 DONE 0.1s
#4 [internal] load metadata for docker.io/library/node:18
#4 DONE 0.3s
#5 [internal] load .dockerignore
#5 transferring context: 1.01kB done
#5 DONE 0.0s
#6 [nextjs-builder 1/7] FROM docker.io/library/node:18@sha256:c6ae79e38498325db67193d391e6ec1d224d96c693a8a4d943498556716d3783
#6 DONE 0.0s
#7 [storybook-provider 1/3] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e
#7 DONE 0.0s
#8 [runner 2/7] WORKDIR /app
#8 CACHED
#9 [internal] load build context
#9 transferring context: 4.43MB 0.0s done
#9 DONE 0.0s
#10 [nextjs-builder 2/7] WORKDIR /app
#10 CACHED
#11 [nextjs-builder 3/7] COPY storybook/auth-wrapper/package*.json ./
#11 CACHED
#12 [storybook-provider 2/3] WORKDIR /build
#12 CACHED
#13 [storybook-provider 3/3] COPY storybook/build ./storybook-static
#13 CACHED
#14 [runner 3/7] RUN addgroup --system --gid 1001 nodejs
#14 DONE 0.2s
#15 [nextjs-builder 4/7] RUN npm ci
#15 ...
#16 [runner 4/7] RUN adduser --system --uid 1001 nextjs
#16 DONE 0.3s
#15 [nextjs-builder 4/7] RUN npm ci
#15 1.363 npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
#15 1.748 npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
#15 2.254 npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
#15 2.282 npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
#15 2.332 npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
#15 2.842 npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
#15 5.190
#15 5.190 added 430 packages, and audited 431 packages in 5s
#15 5.190
#15 5.190 156 packages are looking for funding
#15 5.190   run `npm fund` for details
#15 5.190
#15 5.190 found 0 vulnerabilities
#15 5.191 npm notice
#15 5.191 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#15 5.191 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#15 5.191 npm notice To update run: npm install -g npm@11.6.2
#15 5.191 npm notice
#15 DONE 5.3s
#17 [nextjs-builder 5/7] COPY storybook/auth-wrapper .
#17 DONE 0.0s
#18 [nextjs-builder 6/7] COPY --from=storybook-provider /build/storybook-static ./public/storybook-static
#18 DONE 0.1s
#19 [nextjs-builder 7/7] RUN npm run build
#19 0.328
#19 0.328 > @storybook/auth-wrapper@1.0.0 build
#19 0.328 > next build
#19 0.328
#19 0.674   ▲ Next.js 14.2.33
#19 0.674
#19 0.682    Creating an optimized production build ...
#19 4.635  ✓ Compiled successfully
#19 4.635    Linting and checking validity of types ...
#19 5.978    Collecting page data ...
#19 6.647    Generating static pages (0/5) ...
#19 6.846    Generating static pages (1/5)
#19 6.846    Generating static pages (2/5)
#19 6.852    Generating static pages (3/5)
#19 6.881  ✓ Generating static pages (5/5)
#19 7.135    Finalizing page optimization ...
#19 7.135    Collecting build traces ...
#19 12.09
#19 12.10 Route (app)                              Size     First Load JS
#19 12.10 ┌ ƒ /                                    138 B          87.4 kB
#19 12.10 ├ ○ /_not-found                          873 B          88.1 kB
#19 12.10 ├ ƒ /api/auth/[...nextauth]              0 B                0 B
#19 12.10 ├ ƒ /login                               1.97 kB        92.3 kB
#19 12.10 └ ƒ /storybook/[[...path]]               1.28 kB        91.6 kB
#19 12.10 + First Load JS shared by all            87.3 kB
#19 12.10   ├ chunks/117-b53b99d61411d7eb.js       31.7 kB
#19 12.10   ├ chunks/fd9d1056-72ef1b92e01f1388.js  53.6 kB
#19 12.10   └ other shared chunks (total)          1.92 kB
#19 12.10
#19 12.10
#19 12.10 ƒ Middleware                             38.1 kB
#19 12.10
#19 12.10 ○  (Static)   prerendered as static content
#19 12.10 ƒ  (Dynamic)  server-rendered on demand
#19 12.10
#19 DONE 12.2s
#20 [runner 5/7] COPY --from=nextjs-builder /app/public ./public
#20 DONE 0.0s
#21 [runner 6/7] COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/standalone ./
#21 DONE 0.2s
#22 [runner 7/7] COPY --from=nextjs-builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#22 DONE 0.1s
#23 exporting to image
#23 exporting layers 0.1s done
#23 writing image sha256:1e676152e0f26c5e669456340c2ba9db33680664391119c7e924218055b91c4f done
#23 naming to docker.io/library/bokockkgwggccwg04k0ow0cs-storybook-auth done
#23 DONE 0.1s
#24 resolving provenance for metadata file
#24 DONE 0.0s
storybook-auth  Built
Creating .env file with runtime variables for build phase.
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'cat /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/.env'
SOURCE_COMMIT=f8fba599ec64f8652ce8f154aec9264f4b89d882
COOLIFY_URL=
COOLIFY_FQDN=
SERVICE_URL_STORYBOOK_AUTH=components.ozean-licht.dev
SERVICE_FQDN_STORYBOOK_AUTH=
SERVICE_NAME_STORYBOOK-AUTH=storybook-auth
NEXTAUTH_URL=https://components.ozean-licht.dev
NEXTAUTH_SECRET=DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U=
AUTH_SECRET=DKQv/fnXXUY2t1Go2unrI+75PWxA1zsY2VP0uFFao7U=
DATABASE_URL=postgresql://postgres:7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ@localhost:32771/shared-users-db
POSTGRES_HOST=localhost
POSTGRES_PORT=32771
POSTGRES_DATABASE=shared-users-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=7M6jFrr7IYILOa67MxnfkpUxxNiDVp9IjHN60bkIR0QpbC40DRgzXkVAeVEkdWbJ
STORYBOOK_DEV_URL=http://localhost:6006
NEXT_PUBLIC_STORYBOOK_DEV_URL=http://localhost:6006
NODE_ENV=production
HOST=0.0.0.0
Removing old containers.
Starting new application.
[CMD]: docker exec j4woo04o8so8wko4sw4g0s8k bash -c 'SOURCE_COMMIT=f8fba599ec64f8652ce8f154aec9264f4b89d882 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=bokockkgwggccwg04k0ow0cs COOLIFY_CONTAINER_NAME=bokockkgwggccwg04k0ow0cs-130642743946  docker compose --env-file /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/.env --project-name bokockkgwggccwg04k0ow0cs --project-directory /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper -f /artifacts/j4woo04o8so8wko4sw4g0s8k/storybook/auth-wrapper/docker-compose.yml up -d'
Network bokockkgwggccwg04k0ow0cs_ozean-licht-network  Creating
Network bokockkgwggccwg04k0ow0cs_ozean-licht-network  Created
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Creating
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Created
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Starting
Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594 (6ab045876b9b3bb86451ba8b515fbb2b228e25a654c88752af47a8a7a2efe9d5): failed to bind host port for 0.0.0.0:3002:10.0.12.2:3002/tcp: address already in use
exit status 1
Oops something is not okay, are you okay? 😢
Network bokockkgwggccwg04k0ow0cs_ozean-licht-network  Creating
Network bokockkgwggccwg04k0ow0cs_ozean-licht-network  Created
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Creating
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Created
Container storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594  Starting
Error response from daemon: failed to set up container networking: driver failed programming external connectivity on endpoint storybook-auth-bokockkgwggccwg04k0ow0cs-130648322594 (6ab045876b9b3bb86451ba8b515fbb2b228e25a654c88752af47a8a7a2efe9d5): failed to bind host port for 0.0.0.0:3002:10.0.12.2:3002/tcp: address already in use
exit status 1
Gracefully shutting down build container: j4woo04o8so8wko4sw4g0s8k
[CMD]: docker stop --time=30 j4woo04o8so8wko4sw4g0s8k
Flag --time has been deprecated, use --timeout instead
j4woo04o8so8wko4sw4g0s8k
[CMD]: docker rm -f j4woo04o8so8wko4sw4g0s8k
Error response from daemon: No such container: j4woo04o8so8wko4sw4g0s8k