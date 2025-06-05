### Dev

```sh
# spin up
pnpm docker:dev:up

pnpm dev \
 -F web \
 -F @repo/db \
 -F @repo/api \
 -F @repo/auth \
 -F @repo/store \
 -F @repo/validators


# reset
find . -name node_modules -type d -prune -exec rm -rf '{}' + && \
find . -name .turbo -type d -prune -exec rm -rf '{}' + && \
find packages -name dist -type d -prune -exec rm -rf '{}' + && \
find packages -name .cache -type d -prune -exec rm -rf '{}' + && \
rm -rf apps/web/.next && \
pnpm clean:workspaces && \
rm -f pnpm-lock.yaml && \
pnpm i && \
pnpm db:generate && \
pnpm build \
 -F @repo/db \
 -F @repo/validators \
 -F @repo/api \
 -F @repo/auth \
 -F @repo/store


# new migration
pnpm db:migrate init && \
# seed change
pnpm build -F @repo/db && \
pnpm db:seed

# apply migrations
pnpm with-env:dev pnpm db:migrate:prod

# reset images
find /app/apps/web/uploads/models -type f -name "*.webp" -exec rm -f {} +

# secrets
openssl rand -base64 32
```

### Stage

```sh
pnpm docker:stage:up db-stage
pnpm -F @repo/db db:migrate:stage
pnpm -F @repo/db db:seed:stage
pnpm docker:stage:build
pnpm docker:stage:up app-stage
# docker logs -f app-stage

# rebuild
docker rm -f app-stage
docker image prune -f
```

### Prod

```sh
docker network create proxy
pnpm docker:prod:up db-prod
pnpm -F @repo/db db:migrate:prod
pnpm db:generate
pnpm build -F @repo/db
pnpm -F @repo/db db:seed:prod
pnpm docker:prod:build
pnpm docker:prod:up
# docker logs -f souqkerdassacom-app-prod-1
```

### Utils

```sh
# generate secret
openssl rand -base64 32
```

## Mobile

```sh
# open emulator
~/Android/Sdk/emulator/emulator @Pixel_4_API_35

# develop
cd apps/mobile
npx expo start --dev-client
# or
npx expo run:android

# new package
npx expo install --pnpm package_name

# testing urls
npx uri-scheme open myapp://path/into/app?hello=world --android

# clear bundler cache
npx expo start --dev-client -c

# reset
rm -rf \
  apps/mobile/.expo \
  apps/mobile/android \
  apps/mobile/ios

# ci build (push tag)
git tag v0.0.0.preview && git push origin v0.0.0.preview
git tag v0.0.0.prod && git push origin v0.0.0.prod

# local build
eas build --local --platform=android --profile=preview --output=./app.preview.apk

# debug build
adb logcat -c && adb logcat | grep -iE "ReactNative|ReactNativeJS|your.bundle.identifier|AndroidRuntime|Exception"
```

# CI/CD

```sh
# manually trigger deploy
gh workflow run deploy.yml
```
