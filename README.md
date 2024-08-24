### getting started

```sh
pnpm docker:dev:up
pnpm -F web dev
/home/fezza/Android/Sdk/emulator/emulator @Pixel_4_API_35
pnpm -F mobile dev
```


### reset

```sh
find . -name .turbo -type d -prune -exec rm -rf '{}' + && \
find . -name node_modules -type d -prune -exec rm -rf '{}' + && \
find . -name dist -type d -prune -exec rm -rf '{}' + && \
rm pnpm-lock.yaml && \
pnpm i && \
pnpm db:generate && \
pnpm build \
 -F @repo/validators \
 -F @repo/store \
 -F @repo/db \
 -F @repo/auth \
 -F @repo/api
```


### TODO (setup):

@repo/shared?: react-native-web <br>
@repo/ui: shadcn-ui <br>
docker osx (ios simulator)
