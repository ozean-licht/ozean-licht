Starting deployment of storybook to localhost.
Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.12
[CMD]: docker stop --time=30 gckk0swwkk400g8ogcosoggk
Flag --time has been deprecated, use --timeout instead
Error response from daemon: No such container: gckk0swwkk400g8ogcosoggk
[CMD]: docker rm -f gckk0swwkk400g8ogcosoggk
Error response from daemon: No such container: gckk0swwkk400g8ogcosoggk
[CMD]: docker run -d --network coolify --name gckk0swwkk400g8ogcosoggk  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.12
738706cc295d12760eec7adabff5304f6ba6fccd2beab5498a7a3ea06ca03b38
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://github.com/ozean-licht/ozean-licht refs/heads/main'
491a0eaf2038f265b4d03dcaed99b6c6b2955fe4	refs/heads/main
----------------------------------------
Importing ozean-licht/ozean-licht:main (commit sha 491a0eaf2038f265b4d03dcaed99b6c6b2955fe4) to /artifacts/gckk0swwkk400g8ogcosoggk.
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b 'main' 'https://github.com/ozean-licht/ozean-licht' '/artifacts/gckk0swwkk400g8ogcosoggk' && cd '/artifacts/gckk0swwkk400g8ogcosoggk' && if [ -f .gitmodules ]; then sed -i "s#git@\(.*\):#https://\1/#g" '/artifacts/gckk0swwkk400g8ogcosoggk'/.gitmodules || true && git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '/artifacts/gckk0swwkk400g8ogcosoggk' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
Cloning into '/artifacts/gckk0swwkk400g8ogcosoggk'...
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'cd /artifacts/gckk0swwkk400g8ogcosoggk/storybook && git log -1 491a0eaf2038f265b4d03dcaed99b6c6b2955fe4 --pretty=%B'
refactor(hooks): clean folder to minimal pure state
Removed all documentation, configuration, and non-essential files from
.claude/hooks folder, keeping only the 7 essential hook scripts.
Deleted:
- All markdown documentation (9 files, 68KB)
- .env and .env.example
- .gitignore
- verify-installation.sh
Remaining (4KB):
- pre-tool-use-simple
- post-tool-use-simple
- session-start-simple
- session-end-simple
- stop-simple
- user-prompt-submit-simple
- pre-compact-simple
Folder size: 32KB → 4KB (pure hooks only)
Status: Minimal, clean, production-ready
🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'test -f /artifacts/gckk0swwkk400g8ogcosoggk/storybook/../storybook/docker/Dockerfile && echo 'exists' || echo 'not found''
exists
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'cat /artifacts/gckk0swwkk400g8ogcosoggk/storybook/../storybook/docker/Dockerfile'
# Storybook Production Dockerfile
# Multi-stage build for optimal image size
FROM node:20-slim AS builder
# Set working directory
WORKDIR /app
# Install dependencies needed for build
RUN apt-get update && apt-get install -y \
git \
&& rm -rf /var/lib/apt/lists/*
# Copy package files
COPY package.json package-lock.json ./
# Install ALL dependencies (including devDependencies needed for build)
RUN npm ci --frozen-lockfile
# Copy source code
COPY . .
# Build Storybook static site
RUN npm run build-storybook
# Verify build output exists
RUN test -d storybook/build || (echo "ERROR: storybook/build not created!" && exit 1)
# Production stage - serve static files
FROM node:20-slim AS runner
# Install http-server for serving static files
RUN npm install -g http-server@14.1.1
# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
adduser --system --uid 1001 storybook
WORKDIR /app
# Copy built static files from builder
COPY --from=builder --chown=storybook:nodejs /app/storybook/build ./storybook
# Switch to non-root user
USER storybook
# Expose Storybook port
EXPOSE 6006
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
CMD node -e "require('http').get('http://localhost:6006/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"
# Start http-server with optimizations
CMD ["http-server", "storybook", \
"-p", "6006", \
"--gzip", \
"--brotli", \
"-c-1", \
"--proxy", "http://localhost:6006?", \
"--cors"]
Added 10 ARG declarations to Dockerfile for service storybook (multi-stage build, added to 2 stages).
Pulling & building required images.
Creating build-time .env file in /artifacts (outside Docker context).
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'cat /artifacts/build-time.env'
SOURCE_COMMIT='491a0eaf2038f265b4d03dcaed99b6c6b2955fe4'
COOLIFY_URL=''
COOLIFY_FQDN=''
SERVICE_NAME_STORYBOOK='storybook'
SERVICE_URL_STORYBOOK='https://storybook.ozean-licht.dev'
SERVICE_FQDN_STORYBOOK='storybook.ozean-licht.dev'
Adding build arguments to Docker Compose build command.
[CMD]: docker exec gckk0swwkk400g8ogcosoggk bash -c 'SOURCE_COMMIT=491a0eaf2038f265b4d03dcaed99b6c6b2955fe4 COOLIFY_BRANCH=main COOLIFY_RESOURCE_UUID=jc8oks8gc40w4w4sgw80k8sk COOLIFY_CONTAINER_NAME=jc8oks8gc40w4w4sgw80k8sk-213530843006  docker compose --env-file /artifacts/build-time.env --project-name jc8oks8gc40w4w4sgw80k8sk --project-directory /artifacts/gckk0swwkk400g8ogcosoggk/storybook -f /artifacts/gckk0swwkk400g8ogcosoggk/storybook/docker-compose.yml build --pull --build-arg SOURCE_COMMIT --build-arg COOLIFY_URL --build-arg COOLIFY_FQDN --build-arg SERVICE_FQDN_STORYBOOK --build-arg SERVICE_URL_STORYBOOK --build-arg COOLIFY_BUILD_SECRETS_HASH=1a5e9bec34e2716165246d14acda6bf7b0f37014834e2b73d51ad202a7ea89b5'
#1 [internal] load local bake definitions
#1 reading from stdin 823B done
#1 DONE 0.0s
#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 1.79kB done
#2 DONE 0.0s
#3 [internal] load metadata for docker.io/library/node:20-slim
#3 DONE 0.4s
#4 [internal] load .dockerignore
#4 transferring context: 2B done
#4 DONE 0.0s
#5 [builder 2/8] WORKDIR /app
#5 CACHED
#6 [builder 1/8] FROM docker.io/library/node:20-slim@sha256:12541e65a3777c6035245518eb43006ed08ca8c684e68cd04ecb4653bdf6cfe1
#6 CACHED
#7 [internal] load build context
#7 transferring context: 9.83MB 0.1s done
#7 DONE 0.1s
#8 [builder 3/8] RUN apt-get update && apt-get install -y     git     && rm -rf /var/lib/apt/lists/*
#8 0.204 Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]
#8 0.221 Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
#8 0.227 Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
#8 0.267 Get:4 http://deb.debian.org/debian bookworm/main amd64 Packages [8791 kB]
#8 0.366 Get:5 http://deb.debian.org/debian bookworm-updates/main amd64 Packages [6924 B]
#8 0.366 Get:6 http://deb.debian.org/debian-security bookworm-security/main amd64 Packages [285 kB]
#8 0.871 Fetched 9338 kB in 1s (13.8 MB/s)
#8 0.871 Reading package lists...
#8 ...
#9 [runner 2/5] RUN npm install -g http-server@14.1.1
#9 1.224
#9 1.224 added 48 packages in 1s
#9 1.224
#9 1.224 15 packages are looking for funding
#9 1.224   run `npm fund` for details
#9 1.225 npm notice
#9 1.225 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#9 1.225 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#9 1.225 npm notice To update run: npm install -g npm@11.6.2
#9 1.225 npm notice
#9 DONE 1.3s
#8 [builder 3/8] RUN apt-get update && apt-get install -y     git     && rm -rf /var/lib/apt/lists/*
#8 1.170 Reading package lists...
#8 1.455 Building dependency tree...
#8 1.531 Reading state information...
#8 ...
#10 [runner 3/5] RUN addgroup --system --gid 1001 nodejs &&     adduser --system --uid 1001 storybook
#10 0.223 Adding group `nodejs' (GID 1001) ...
#10 0.239 Done.
#10 0.254 Adding system user `storybook' (UID 1001) ...
#10 0.254 Adding new user `storybook' (UID 1001) with group `nogroup' ...
#10 0.260 useradd warning: storybook's uid 1001 is greater than SYS_UID_MAX 999
#10 0.272 Not creating `/nonexistent'.
#10 DONE 0.3s
#11 [runner 4/5] WORKDIR /app
#11 DONE 0.0s
#8 [builder 3/8] RUN apt-get update && apt-get install -y     git     && rm -rf /var/lib/apt/lists/*
#8 1.612 The following additional packages will be installed:
#8 1.612   ca-certificates git-man krb5-locales less libbrotli1 libbsd0 libcbor0.8
#8 1.612   libcurl3-gnutls libedit2 liberror-perl libexpat1 libfido2-1 libgdbm-compat4
#8 1.612   libgdbm6 libgssapi-krb5-2 libk5crypto3 libkeyutils1 libkrb5-3
#8 1.612   libkrb5support0 libldap-2.5-0 libldap-common libnghttp2-14 libperl5.36
#8 1.612   libpsl5 librtmp1 libsasl2-2 libsasl2-modules libsasl2-modules-db libssh2-1
#8 1.612   libssl3 libx11-6 libx11-data libxau6 libxcb1 libxdmcp6 libxext6 libxmuu1
#8 1.612   netbase openssh-client openssl patch perl perl-modules-5.36 publicsuffix
#8 1.612   xauth
#8 1.614 Suggested packages:
#8 1.614   gettext-base git-daemon-run | git-daemon-sysvinit git-doc git-email git-gui
#8 1.614   gitk gitweb git-cvs git-mediawiki git-svn gdbm-l10n krb5-doc krb5-user
#8 1.614   sensible-utils libsasl2-modules-gssapi-mit | libsasl2-modules-gssapi-heimdal
#8 1.614   libsasl2-modules-ldap libsasl2-modules-otp libsasl2-modules-sql keychain
#8 1.614   libpam-ssh monkeysphere ssh-askpass ed diffutils-doc perl-doc
#8 1.614   libterm-readline-gnu-perl | libterm-readline-perl-perl make
#8 1.614   libtap-harness-archive-perl
#8 1.764 The following NEW packages will be installed:
#8 1.765   ca-certificates git git-man krb5-locales less libbrotli1 libbsd0 libcbor0.8
#8 1.765   libcurl3-gnutls libedit2 liberror-perl libexpat1 libfido2-1 libgdbm-compat4
#8 1.765   libgdbm6 libgssapi-krb5-2 libk5crypto3 libkeyutils1 libkrb5-3
#8 1.765   libkrb5support0 libldap-2.5-0 libldap-common libnghttp2-14 libperl5.36
#8 1.765   libpsl5 librtmp1 libsasl2-2 libsasl2-modules libsasl2-modules-db libssh2-1
#8 1.765   libssl3 libx11-6 libx11-data libxau6 libxcb1 libxdmcp6 libxext6 libxmuu1
#8 1.765   netbase openssh-client openssl patch perl perl-modules-5.36 publicsuffix
#8 1.765   xauth
#8 1.790 0 upgraded, 46 newly installed, 0 to remove and 0 not upgraded.
#8 1.790 Need to get 25.5 MB of archives.
#8 1.790 After this operation, 124 MB of additional disk space will be used.
#8 1.790 Get:1 http://deb.debian.org/debian bookworm/main amd64 perl-modules-5.36 all 5.36.0-7+deb12u3 [2815 kB]
#8 1.837 Get:2 http://deb.debian.org/debian bookworm/main amd64 libgdbm6 amd64 1.23-3 [72.2 kB]
#8 1.838 Get:3 http://deb.debian.org/debian bookworm/main amd64 libgdbm-compat4 amd64 1.23-3 [48.2 kB]
#8 1.839 Get:4 http://deb.debian.org/debian bookworm/main amd64 libperl5.36 amd64 5.36.0-7+deb12u3 [4196 kB]
#8 1.882 Get:5 http://deb.debian.org/debian bookworm/main amd64 perl amd64 5.36.0-7+deb12u3 [239 kB]
#8 1.883 Get:6 http://deb.debian.org/debian bookworm/main amd64 less amd64 590-2.1~deb12u2 [132 kB]
#8 1.883 Get:7 http://deb.debian.org/debian bookworm/main amd64 netbase all 6.4 [12.8 kB]
#8 1.883 Get:8 http://deb.debian.org/debian-security bookworm-security/main amd64 libssl3 amd64 3.0.17-1~deb12u3 [2028 kB]
#8 1.895 Get:9 http://deb.debian.org/debian-security bookworm-security/main amd64 openssl amd64 3.0.17-1~deb12u3 [1434 kB]
#8 1.908 Get:10 http://deb.debian.org/debian bookworm/main amd64 ca-certificates all 20230311+deb12u1 [155 kB]
#8 1.909 Get:11 http://deb.debian.org/debian bookworm/main amd64 krb5-locales all 1.20.1-2+deb12u4 [63.4 kB]
#8 1.909 Get:12 http://deb.debian.org/debian bookworm/main amd64 libbsd0 amd64 0.11.7-2 [117 kB]
#8 1.910 Get:13 http://deb.debian.org/debian bookworm/main amd64 libedit2 amd64 3.1-20221030-2 [93.0 kB]
#8 1.911 Get:14 http://deb.debian.org/debian bookworm/main amd64 libcbor0.8 amd64 0.8.0-2+b1 [27.4 kB]
#8 1.911 Get:15 http://deb.debian.org/debian bookworm/main amd64 libfido2-1 amd64 1.12.0-2+b1 [77.2 kB]
#8 1.912 Get:16 http://deb.debian.org/debian bookworm/main amd64 libkrb5support0 amd64 1.20.1-2+deb12u4 [33.2 kB]
#8 1.912 Get:17 http://deb.debian.org/debian bookworm/main amd64 libk5crypto3 amd64 1.20.1-2+deb12u4 [79.8 kB]
#8 1.913 Get:18 http://deb.debian.org/debian bookworm/main amd64 libkeyutils1 amd64 1.6.3-2 [8808 B]
#8 1.913 Get:19 http://deb.debian.org/debian bookworm/main amd64 libkrb5-3 amd64 1.20.1-2+deb12u4 [334 kB]
#8 1.919 Get:20 http://deb.debian.org/debian bookworm/main amd64 libgssapi-krb5-2 amd64 1.20.1-2+deb12u4 [135 kB]
#8 1.921 Get:21 http://deb.debian.org/debian bookworm/main amd64 openssh-client amd64 1:9.2p1-2+deb12u7 [992 kB]
#8 1.931 Get:22 http://deb.debian.org/debian bookworm/main amd64 libbrotli1 amd64 1.0.9-2+b6 [275 kB]
#8 1.933 Get:23 http://deb.debian.org/debian bookworm/main amd64 libsasl2-modules-db amd64 2.1.28+dfsg-10 [20.3 kB]
#8 1.933 Get:24 http://deb.debian.org/debian bookworm/main amd64 libsasl2-2 amd64 2.1.28+dfsg-10 [59.7 kB]
#8 1.934 Get:25 http://deb.debian.org/debian bookworm/main amd64 libldap-2.5-0 amd64 2.5.13+dfsg-5 [183 kB]
#8 1.935 Get:26 http://deb.debian.org/debian bookworm/main amd64 libnghttp2-14 amd64 1.52.0-1+deb12u2 [73.0 kB]
#8 1.936 Get:27 http://deb.debian.org/debian bookworm/main amd64 libpsl5 amd64 0.21.2-1 [58.7 kB]
#8 1.936 Get:28 http://deb.debian.org/debian bookworm/main amd64 librtmp1 amd64 2.4+20151223.gitfa8646d.1-2+b2 [60.8 kB]
#8 1.937 Get:29 http://deb.debian.org/debian bookworm/main amd64 libssh2-1 amd64 1.10.0-3+b1 [179 kB]
#8 1.938 Get:30 http://deb.debian.org/debian bookworm/main amd64 libcurl3-gnutls amd64 7.88.1-10+deb12u14 [386 kB]
#8 1.942 Get:31 http://deb.debian.org/debian bookworm/main amd64 libexpat1 amd64 2.5.0-1+deb12u2 [99.9 kB]
#8 1.946 Get:32 http://deb.debian.org/debian bookworm/main amd64 liberror-perl all 0.17029-2 [29.0 kB]
#8 1.946 Get:33 http://deb.debian.org/debian bookworm/main amd64 git-man all 1:2.39.5-0+deb12u2 [2053 kB]
#8 1.965 Get:34 http://deb.debian.org/debian bookworm/main amd64 git amd64 1:2.39.5-0+deb12u2 [7260 kB]
#8 2.028 Get:35 http://deb.debian.org/debian bookworm/main amd64 libldap-common all 2.5.13+dfsg-5 [29.3 kB]
#8 2.028 Get:36 http://deb.debian.org/debian bookworm/main amd64 libsasl2-modules amd64 2.1.28+dfsg-10 [66.6 kB]
#8 2.028 Get:37 http://deb.debian.org/debian bookworm/main amd64 libxau6 amd64 1:1.0.9-1 [19.7 kB]
#8 2.028 Get:38 http://deb.debian.org/debian bookworm/main amd64 libxdmcp6 amd64 1:1.1.2-3 [26.3 kB]
#8 2.029 Get:39 http://deb.debian.org/debian bookworm/main amd64 libxcb1 amd64 1.15-1 [144 kB]
#8 2.029 Get:40 http://deb.debian.org/debian bookworm/main amd64 libx11-data all 2:1.8.4-2+deb12u2 [292 kB]
#8 2.031 Get:41 http://deb.debian.org/debian bookworm/main amd64 libx11-6 amd64 2:1.8.4-2+deb12u2 [760 kB]
#8 2.038 Get:42 http://deb.debian.org/debian bookworm/main amd64 libxext6 amd64 2:1.3.4-1+b1 [52.9 kB]
#8 2.038 Get:43 http://deb.debian.org/debian bookworm/main amd64 libxmuu1 amd64 2:1.1.3-3 [23.9 kB]
#8 2.038 Get:44 http://deb.debian.org/debian bookworm/main amd64 patch amd64 2.7.6-7 [128 kB]
#8 2.042 Get:45 http://deb.debian.org/debian bookworm/main amd64 publicsuffix all 20230209.2326-1 [126 kB]
#8 2.043 Get:46 http://deb.debian.org/debian bookworm/main amd64 xauth amd64 1:1.1.2-1 [36.0 kB]
#8 2.109 debconf: delaying package configuration, since apt-utils is not installed
#8 2.128 Fetched 25.5 MB in 0s (94.4 MB/s)
#8 2.144 Selecting previously unselected package perl-modules-5.36.
#8 2.144 (Reading database ... 
(Reading database ... 5%
(Reading database ... 10%
(Reading database ... 15%
(Reading database ... 20%
(Reading database ... 25%
(Reading database ... 30%
(Reading database ... 35%
(Reading database ... 40%
(Reading database ... 45%
(Reading database ... 50%
(Reading database ... 55%
(Reading database ... 60%
(Reading database ... 65%
(Reading database ... 70%
(Reading database ... 75%
(Reading database ... 80%
(Reading database ... 85%
(Reading database ... 90%
(Reading database ... 95%
(Reading database ... 100%
(Reading database ... 6095 files and directories currently installed.)
#8 2.148 Preparing to unpack .../00-perl-modules-5.36_5.36.0-7+deb12u3_all.deb ...
#8 2.150 Unpacking perl-modules-5.36 (5.36.0-7+deb12u3) ...
#8 2.330 Selecting previously unselected package libgdbm6:amd64.
#8 2.331 Preparing to unpack .../01-libgdbm6_1.23-3_amd64.deb ...
#8 2.336 Unpacking libgdbm6:amd64 (1.23-3) ...
#8 2.361 Selecting previously unselected package libgdbm-compat4:amd64.
#8 2.362 Preparing to unpack .../02-libgdbm-compat4_1.23-3_amd64.deb ...
#8 2.364 Unpacking libgdbm-compat4:amd64 (1.23-3) ...
#8 2.388 Selecting previously unselected package libperl5.36:amd64.
#8 2.389 Preparing to unpack .../03-libperl5.36_5.36.0-7+deb12u3_amd64.deb ...
#8 2.391 Unpacking libperl5.36:amd64 (5.36.0-7+deb12u3) ...
#8 2.578 Selecting previously unselected package perl.
#8 2.579 Preparing to unpack .../04-perl_5.36.0-7+deb12u3_amd64.deb ...
#8 2.586 Unpacking perl (5.36.0-7+deb12u3) ...
#8 2.617 Selecting previously unselected package less.
#8 2.618 Preparing to unpack .../05-less_590-2.1~deb12u2_amd64.deb ...
#8 2.622 Unpacking less (590-2.1~deb12u2) ...
#8 2.648 Selecting previously unselected package netbase.
#8 2.650 Preparing to unpack .../06-netbase_6.4_all.deb ...
#8 2.652 Unpacking netbase (6.4) ...
#8 2.675 Selecting previously unselected package libssl3:amd64.
#8 2.676 Preparing to unpack .../07-libssl3_3.0.17-1~deb12u3_amd64.deb ...
#8 2.678 Unpacking libssl3:amd64 (3.0.17-1~deb12u3) ...
#8 2.763 Selecting previously unselected package openssl.
#8 2.764 Preparing to unpack .../08-openssl_3.0.17-1~deb12u3_amd64.deb ...
#8 2.766 Unpacking openssl (3.0.17-1~deb12u3) ...
#8 2.839 Selecting previously unselected package ca-certificates.
#8 2.840 Preparing to unpack .../09-ca-certificates_20230311+deb12u1_all.deb ...
#8 2.842 Unpacking ca-certificates (20230311+deb12u1) ...
#8 2.885 Selecting previously unselected package krb5-locales.
#8 2.886 Preparing to unpack .../10-krb5-locales_1.20.1-2+deb12u4_all.deb ...
#8 2.889 Unpacking krb5-locales (1.20.1-2+deb12u4) ...
#8 2.912 Selecting previously unselected package libbsd0:amd64.
#8 2.913 Preparing to unpack .../11-libbsd0_0.11.7-2_amd64.deb ...
#8 2.915 Unpacking libbsd0:amd64 (0.11.7-2) ...
#8 2.941 Selecting previously unselected package libedit2:amd64.
#8 2.942 Preparing to unpack .../12-libedit2_3.1-20221030-2_amd64.deb ...
#8 2.945 Unpacking libedit2:amd64 (3.1-20221030-2) ...
#8 2.970 Selecting previously unselected package libcbor0.8:amd64.
#8 2.971 Preparing to unpack .../13-libcbor0.8_0.8.0-2+b1_amd64.deb ...
#8 2.973 Unpacking libcbor0.8:amd64 (0.8.0-2+b1) ...
#8 2.997 Selecting previously unselected package libfido2-1:amd64.
#8 2.998 Preparing to unpack .../14-libfido2-1_1.12.0-2+b1_amd64.deb ...
#8 3.000 Unpacking libfido2-1:amd64 (1.12.0-2+b1) ...
#8 3.025 Selecting previously unselected package libkrb5support0:amd64.
#8 3.026 Preparing to unpack .../15-libkrb5support0_1.20.1-2+deb12u4_amd64.deb ...
#8 3.028 Unpacking libkrb5support0:amd64 (1.20.1-2+deb12u4) ...
#8 3.058 Selecting previously unselected package libk5crypto3:amd64.
#8 3.059 Preparing to unpack .../16-libk5crypto3_1.20.1-2+deb12u4_amd64.deb ...
#8 3.061 Unpacking libk5crypto3:amd64 (1.20.1-2+deb12u4) ...
#8 3.087 Selecting previously unselected package libkeyutils1:amd64.
#8 3.088 Preparing to unpack .../17-libkeyutils1_1.6.3-2_amd64.deb ...
#8 3.091 Unpacking libkeyutils1:amd64 (1.6.3-2) ...
#8 3.113 Selecting previously unselected package libkrb5-3:amd64.
#8 3.114 Preparing to unpack .../18-libkrb5-3_1.20.1-2+deb12u4_amd64.deb ...
#8 3.117 Unpacking libkrb5-3:amd64 (1.20.1-2+deb12u4) ...
#8 3.155 Selecting previously unselected package libgssapi-krb5-2:amd64.
#8 3.156 Preparing to unpack .../19-libgssapi-krb5-2_1.20.1-2+deb12u4_amd64.deb ...
#8 3.159 Unpacking libgssapi-krb5-2:amd64 (1.20.1-2+deb12u4) ...
#8 3.187 Selecting previously unselected package openssh-client.
#8 3.188 Preparing to unpack .../20-openssh-client_1%3a9.2p1-2+deb12u7_amd64.deb ...
#8 3.193 Unpacking openssh-client (1:9.2p1-2+deb12u7) ...
#8 3.253 Selecting previously unselected package libbrotli1:amd64.
#8 3.254 Preparing to unpack .../21-libbrotli1_1.0.9-2+b6_amd64.deb ...
#8 3.257 Unpacking libbrotli1:amd64 (1.0.9-2+b6) ...
#8 3.292 Selecting previously unselected package libsasl2-modules-db:amd64.
#8 3.293 Preparing to unpack .../22-libsasl2-modules-db_2.1.28+dfsg-10_amd64.deb ...
#8 3.295 Unpacking libsasl2-modules-db:amd64 (2.1.28+dfsg-10) ...
#8 3.318 Selecting previously unselected package libsasl2-2:amd64.
#8 3.319 Preparing to unpack .../23-libsasl2-2_2.1.28+dfsg-10_amd64.deb ...
#8 3.321 Unpacking libsasl2-2:amd64 (2.1.28+dfsg-10) ...
#8 3.344 Selecting previously unselected package libldap-2.5-0:amd64.
#8 3.345 Preparing to unpack .../24-libldap-2.5-0_2.5.13+dfsg-5_amd64.deb ...
#8 3.348 Unpacking libldap-2.5-0:amd64 (2.5.13+dfsg-5) ...
#8 3.378 Selecting previously unselected package libnghttp2-14:amd64.
#8 3.379 Preparing to unpack .../25-libnghttp2-14_1.52.0-1+deb12u2_amd64.deb ...
#8 3.382 Unpacking libnghttp2-14:amd64 (1.52.0-1+deb12u2) ...
#8 3.406 Selecting previously unselected package libpsl5:amd64.
#8 3.407 Preparing to unpack .../26-libpsl5_0.21.2-1_amd64.deb ...
#8 3.409 Unpacking libpsl5:amd64 (0.21.2-1) ...
#8 3.433 Selecting previously unselected package librtmp1:amd64.
#8 3.434 Preparing to unpack .../27-librtmp1_2.4+20151223.gitfa8646d.1-2+b2_amd64.deb ...
#8 3.436 Unpacking librtmp1:amd64 (2.4+20151223.gitfa8646d.1-2+b2) ...
#8 3.460 Selecting previously unselected package libssh2-1:amd64.
#8 3.461 Preparing to unpack .../28-libssh2-1_1.10.0-3+b1_amd64.deb ...
#8 3.463 Unpacking libssh2-1:amd64 (1.10.0-3+b1) ...
#8 3.492 Selecting previously unselected package libcurl3-gnutls:amd64.
#8 3.493 Preparing to unpack .../29-libcurl3-gnutls_7.88.1-10+deb12u14_amd64.deb ...
#8 3.495 Unpacking libcurl3-gnutls:amd64 (7.88.1-10+deb12u14) ...
#8 3.530 Selecting previously unselected package libexpat1:amd64.
#8 3.531 Preparing to unpack .../30-libexpat1_2.5.0-1+deb12u2_amd64.deb ...
#8 3.534 Unpacking libexpat1:amd64 (2.5.0-1+deb12u2) ...
#8 3.556 Selecting previously unselected package liberror-perl.
#8 3.557 Preparing to unpack .../31-liberror-perl_0.17029-2_all.deb ...
#8 3.559 Unpacking liberror-perl (0.17029-2) ...
#8 3.586 Selecting previously unselected package git-man.
#8 3.587 Preparing to unpack .../32-git-man_1%3a2.39.5-0+deb12u2_all.deb ...
#8 3.589 Unpacking git-man (1:2.39.5-0+deb12u2) ...
#8 3.655 Selecting previously unselected package git.
#8 3.656 Preparing to unpack .../33-git_1%3a2.39.5-0+deb12u2_amd64.deb ...
#8 3.662 Unpacking git (1:2.39.5-0+deb12u2) ...
#8 3.864 Selecting previously unselected package libldap-common.
#8 3.866 Preparing to unpack .../34-libldap-common_2.5.13+dfsg-5_all.deb ...
#8 3.868 Unpacking libldap-common (2.5.13+dfsg-5) ...
#8 3.892 Selecting previously unselected package libsasl2-modules:amd64.
#8 3.893 Preparing to unpack .../35-libsasl2-modules_2.1.28+dfsg-10_amd64.deb ...
#8 3.899 Unpacking libsasl2-modules:amd64 (2.1.28+dfsg-10) ...
#8 3.922 Selecting previously unselected package libxau6:amd64.
#8 3.923 Preparing to unpack .../36-libxau6_1%3a1.0.9-1_amd64.deb ...
#8 3.925 Unpacking libxau6:amd64 (1:1.0.9-1) ...
#8 3.948 Selecting previously unselected package libxdmcp6:amd64.
#8 3.949 Preparing to unpack .../37-libxdmcp6_1%3a1.1.2-3_amd64.deb ...
#8 3.951 Unpacking libxdmcp6:amd64 (1:1.1.2-3) ...
#8 3.974 Selecting previously unselected package libxcb1:amd64.
#8 3.975 Preparing to unpack .../38-libxcb1_1.15-1_amd64.deb ...
#8 3.977 Unpacking libxcb1:amd64 (1.15-1) ...
#8 3.999 Selecting previously unselected package libx11-data.
#8 4.000 Preparing to unpack .../39-libx11-data_2%3a1.8.4-2+deb12u2_all.deb ...
#8 4.002 Unpacking libx11-data (2:1.8.4-2+deb12u2) ...
#8 4.047 Selecting previously unselected package libx11-6:amd64.
#8 4.048 Preparing to unpack .../40-libx11-6_2%3a1.8.4-2+deb12u2_amd64.deb ...
#8 4.051 Unpacking libx11-6:amd64 (2:1.8.4-2+deb12u2) ...
#8 4.096 Selecting previously unselected package libxext6:amd64.
#8 4.097 Preparing to unpack .../41-libxext6_2%3a1.3.4-1+b1_amd64.deb ...
#8 4.100 Unpacking libxext6:amd64 (2:1.3.4-1+b1) ...
#8 4.123 Selecting previously unselected package libxmuu1:amd64.
#8 4.124 Preparing to unpack .../42-libxmuu1_2%3a1.1.3-3_amd64.deb ...
#8 4.126 Unpacking libxmuu1:amd64 (2:1.1.3-3) ...
#8 4.145 Selecting previously unselected package patch.
#8 4.147 Preparing to unpack .../43-patch_2.7.6-7_amd64.deb ...
#8 4.149 Unpacking patch (2.7.6-7) ...
#8 4.172 Selecting previously unselected package publicsuffix.
#8 4.174 Preparing to unpack .../44-publicsuffix_20230209.2326-1_all.deb ...
#8 4.178 Unpacking publicsuffix (20230209.2326-1) ...
#8 4.201 Selecting previously unselected package xauth.
#8 4.202 Preparing to unpack .../45-xauth_1%3a1.1.2-1_amd64.deb ...
#8 4.205 Unpacking xauth (1:1.1.2-1) ...
#8 4.232 Setting up libexpat1:amd64 (2.5.0-1+deb12u2) ...
#8 4.238 Setting up libxau6:amd64 (1:1.0.9-1) ...
#8 4.245 Setting up libkeyutils1:amd64 (1.6.3-2) ...
#8 4.251 Setting up libpsl5:amd64 (0.21.2-1) ...
#8 4.258 Setting up libcbor0.8:amd64 (0.8.0-2+b1) ...
#8 4.265 Setting up libbrotli1:amd64 (1.0.9-2+b6) ...
#8 4.271 Setting up libssl3:amd64 (3.0.17-1~deb12u3) ...
#8 4.278 Setting up libnghttp2-14:amd64 (1.52.0-1+deb12u2) ...
#8 4.284 Setting up less (590-2.1~deb12u2) ...
#8 4.297 Setting up krb5-locales (1.20.1-2+deb12u4) ...
#8 4.304 Setting up libldap-common (2.5.13+dfsg-5) ...
#8 4.313 Setting up libkrb5support0:amd64 (1.20.1-2+deb12u4) ...
#8 4.319 Setting up libsasl2-modules-db:amd64 (2.1.28+dfsg-10) ...
#8 4.326 Setting up perl-modules-5.36 (5.36.0-7+deb12u3) ...
#8 4.333 Setting up libx11-data (2:1.8.4-2+deb12u2) ...
#8 4.339 Setting up librtmp1:amd64 (2.4+20151223.gitfa8646d.1-2+b2) ...
#8 4.346 Setting up patch (2.7.6-7) ...
#8 4.353 Setting up libk5crypto3:amd64 (1.20.1-2+deb12u4) ...
#8 4.359 Setting up libsasl2-2:amd64 (2.1.28+dfsg-10) ...
#8 4.366 Setting up git-man (1:2.39.5-0+deb12u2) ...
#8 4.372 Setting up libssh2-1:amd64 (1.10.0-3+b1) ...
#8 4.379 Setting up netbase (6.4) ...
#8 4.397 Setting up libkrb5-3:amd64 (1.20.1-2+deb12u4) ...
#8 4.403 Setting up libfido2-1:amd64 (1.12.0-2+b1) ...
#8 4.410 Setting up openssl (3.0.17-1~deb12u3) ...
#8 4.421 Setting up libbsd0:amd64 (0.11.7-2) ...
#8 4.427 Setting up publicsuffix (20230209.2326-1) ...
#8 4.434 Setting up libgdbm6:amd64 (1.23-3) ...
#8 4.440 Setting up libxdmcp6:amd64 (1:1.1.2-3) ...
#8 4.447 Setting up libxcb1:amd64 (1.15-1) ...
#8 4.454 Setting up libedit2:amd64 (3.1-20221030-2) ...
#8 4.461 Setting up libsasl2-modules:amd64 (2.1.28+dfsg-10) ...
#8 4.471 Setting up libldap-2.5-0:amd64 (2.5.13+dfsg-5) ...
#8 4.478 Setting up ca-certificates (20230311+deb12u1) ...
#8 4.523 debconf: unable to initialize frontend: Dialog
#8 4.523 debconf: (TERM is not set, so the dialog frontend is not usable.)
#8 4.523 debconf: falling back to frontend: Readline
#8 4.528 debconf: unable to initialize frontend: Readline
#8 4.528 debconf: (This frontend requires a controlling tty.)
#8 4.528 debconf: falling back to frontend: Teletype
#8 4.820 Updating certificates in /etc/ssl/certs...
#8 5.257 142 added, 0 removed; done.
#8 5.275 Setting up libgssapi-krb5-2:amd64 (1.20.1-2+deb12u4) ...
#8 5.282 Setting up libgdbm-compat4:amd64 (1.23-3) ...
#8 5.289 Setting up libx11-6:amd64 (2:1.8.4-2+deb12u2) ...
#8 5.296 Setting up libperl5.36:amd64 (5.36.0-7+deb12u3) ...
#8 5.302 Setting up libxmuu1:amd64 (2:1.1.3-3) ...
#8 5.309 Setting up openssh-client (1:9.2p1-2+deb12u7) ...
#8 5.359 Setting up libxext6:amd64 (2:1.3.4-1+b1) ...
#8 5.366 Setting up libcurl3-gnutls:amd64 (7.88.1-10+deb12u14) ...
#8 5.372 Setting up perl (5.36.0-7+deb12u3) ...
#8 5.386 Setting up xauth (1:1.1.2-1) ...
#8 5.392 Setting up liberror-perl (0.17029-2) ...
#8 5.399 Setting up git (1:2.39.5-0+deb12u2) ...
#8 5.412 Processing triggers for libc-bin (2.36-9+deb12u13) ...
#8 5.425 Processing triggers for ca-certificates (20230311+deb12u1) ...
#8 5.430 Updating certificates in /etc/ssl/certs...
#8 5.763 0 added, 0 removed; done.
#8 5.763 Running hooks in /etc/ca-certificates/update.d...
#8 5.764 done.
#8 DONE 5.9s
#12 [builder 4/8] COPY package.json package-lock.json ./
#12 DONE 0.0s
#13 [builder 5/8] RUN npm ci --frozen-lockfile
#13 0.696 npm error code EUSAGE
#13 0.696 npm error
#13 0.696 npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
#13 0.696 npm error
#13 0.696 npm error Invalid: lock file's react@18.2.0 does not satisfy react@18.3.1
#13 0.696 npm error Invalid: lock file's react-dom@18.2.0 does not satisfy react-dom@18.3.1
#13 0.696 npm error
#13 0.696 npm error Clean install a project
#13 0.696 npm error
#13 0.696 npm error Usage:
#13 0.696 npm error npm ci
#13 0.696 npm error
#13 0.696 npm error Options:
#13 0.696 npm error [--install-strategy <hoisted|nested|shallow|linked>] [--legacy-bundling]
#13 0.696 npm error [--global-style] [--omit <dev|optional|peer> [--omit <dev|optional|peer> ...]]
#13 0.696 npm error [--include <prod|dev|optional|peer> [--include <prod|dev|optional|peer> ...]]
#13 0.696 npm error [--strict-peer-deps] [--foreground-scripts] [--ignore-scripts] [--no-audit]
#13 0.696 npm error [--no-bin-links] [--no-fund] [--dry-run]
#13 0.696 npm error [-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
#13 0.696 npm error [-ws|--workspaces] [--include-workspace-root] [--install-links]
#13 0.696 npm error
#13 0.696 npm error aliases: clean-install, ic, install-clean, isntall-clean
#13 0.696 npm error
#13 0.696 npm error Run "npm help ci" for more info
#13 0.697 npm notice
#13 0.697 npm notice New major version of npm available! 10.8.2 -> 11.6.2
#13 0.697 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
#13 0.697 npm notice To update run: npm install -g npm@11.6.2
#13 0.697 npm notice
#13 0.697 npm error A complete log of this run can be found in: /root/.npm/_logs/2025-11-12T21_35_44_610Z-debug-0.log
#13 ERROR: process "/bin/sh -c npm ci --frozen-lockfile" did not complete successfully: exit code: 1
------
> [builder 5/8] RUN npm ci --frozen-lockfile:
0.696 npm error
0.696 npm error aliases: clean-install, ic, install-clean, isntall-clean
0.696 npm error
0.696 npm error Run "npm help ci" for more info
0.697 npm notice
0.697 npm notice New major version of npm available! 10.8.2 -> 11.6.2
0.697 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.6.2
0.697 npm notice To update run: npm install -g npm@11.6.2
0.697 npm notice
0.697 npm error A complete log of this run can be found in: /root/.npm/_logs/2025-11-12T21_35_44_610Z-debug-0.log
------
Dockerfile:22
--------------------
20 |
21 |     # Install ALL dependencies (including devDependencies needed for build)
22 | >>> RUN npm ci --frozen-lockfile
23 |
24 |     # Copy source code
--------------------
failed to solve: process "/bin/sh -c npm ci --frozen-lockfile" did not complete successfully: exit code: 1
exit status 1
Oops something is not okay, are you okay? 😢
Dockerfile:22
--------------------
20 |
21 |     # Install ALL dependencies (including devDependencies needed for build)
22 | >>> RUN npm ci --frozen-lockfile
23 |
24 |     # Copy source code
--------------------
failed to solve: process "/bin/sh -c npm ci --frozen-lockfile" did not complete successfully: exit code: 1
exit status 1
Gracefully shutting down build container: gckk0swwkk400g8ogcosoggk
[CMD]: docker stop --time=30 gckk0swwkk400g8ogcosoggk
Flag --time has been deprecated, use --timeout instead
gckk0swwkk400g8ogcosoggk
[CMD]: docker rm -f gckk0swwkk400g8ogcosoggk
Error response from daemon: No such container: gckk0swwkk400g8ogcosoggk