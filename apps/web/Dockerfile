FROM node:22.12.0-alpine3.20 AS base

FROM base AS builder
RUN apk update && \
    apk add --no-cache libc6-compat

WORKDIR /app
COPY . .
RUN npx turbo prune web --docker


# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && \
    apk add --no-cache libc6-compat

WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json /app/out/pnpm-lock.yaml ./
# for prisma
COPY --from=builder /app/out/full/packages/db packages/db
COPY --from=builder /app/out/full/tooling/eslint tooling/eslint
COPY --from=builder /app/out/full/tooling/prettier tooling/prettier
COPY --from=builder /app/out/full/tooling/typescript tooling/typescript

ARG ENVIRONMENT
COPY --from=builder /app/out/full/apps/web/envs/${ENVIRONMENT}/.env.${ENVIRONMENT}.local apps/web

RUN --mount=type=cache,id=pnmcache,target=/pnpm_store \
    npm install -g pnpm && \
    pnpm config set store-dir /pnpm_store && \
    pnpm config set package-import-method copy && \
    pnpm install --prefer-offline --ignore-scripts --frozen-lockfile && \
    pnpm -F @repo/db db:generate:dev && \
    pnpm -F @repo/db build

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json .

ARG ARG_NEXT_PUBLIC_SITE_URL

RUN --mount=type=secret,id=SECRET_ENVS,required \
    source /run/secrets/SECRET_ENVS && \
      NEXT_TELEMETRY_DISABLED=1 \
      TURBO_TELEMETRY_DISABLED=1 \
      SKIP_ENV_VALIDATION=1 \
      NEXT_PUBLIC_SITE_URL=$ARG_NEXT_PUBLIC_SITE_URL \
      DATABASE_URL=$DATABASE_URL \
    pnpm turbo build --filter=web...


FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

USER node

COPY --from=installer /app/apps/web/next.config.mjs .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=node:node /app/apps/web/.next/standalone .
COPY --from=installer --chown=node:node /app/apps/web/.next/static apps/web/.next/static

COPY --from=installer --chown=node:node /app/apps/web/public apps/web/public

COPY --from=builder --chown=node:node /app/out/full/packages/db/src packages/db/src
COPY --from=installer /app/apps/web/start.sh .

ENV PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["sh", "start.sh"]
