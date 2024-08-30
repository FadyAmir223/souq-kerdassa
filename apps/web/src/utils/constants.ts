const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
  query: 'q',
} as const

const assetEP = `/api/assets`

const ASSETS = {
  path: '/app/apps/web/uploads',
  images: `${assetEP}/images`,
} as const

const ar = {
  season: {
    summer: 'صيفى',
    winter: 'شتوى',
  },
  category: {
    women: 'نساء',
    children: 'اطفال',
  },
}

export { ar, assetEP, ASSETS, SEARCH_PARAMS }
