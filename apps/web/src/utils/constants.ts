const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
} as const

const assetEP = `/api/assets`

const ASSETS = {
  path: '/app/uploads',
  images: `${assetEP}/images`,
} as const

export { assetEP, ASSETS, SEARCH_PARAMS }
