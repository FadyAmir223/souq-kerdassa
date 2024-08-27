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

const ar = {
  season: {
    SUMMER: 'صيفى',
    WINTER: 'شتوى',
  },
  category: {
    WOMEN: 'نساء',
    CHILDREN: 'اطفال',
  },
}

export { ar,assetEP, ASSETS, SEARCH_PARAMS }
