#!/bin/sh

PRISMA_QUERY_ENGINE_PATH=$(find / -name libquery_engine-linux-musl-openssl-3.0.x.so.node 2>/dev/null | tail -n 1)
export PRISMA_QUERY_ENGINE_LIBRARY=$PRISMA_QUERY_ENGINE_PATH

pnpm -F @repo/db db:migrate:prod

node apps/web/server.js
