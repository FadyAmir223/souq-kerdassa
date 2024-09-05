export const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
  query: 'query',
  redirectTo: 'redirectTo',
} as const

export const bcryptSalt = 10

export const assetEP = `/api/assets`

export const ASSETS = {
  path: '/app/apps/web/uploads',
  images: `${assetEP}/images`,
} as const

export const AR = {
  season: {
    summer: 'صيفى',
    winter: 'شتوى',
  },
  category: {
    women: 'نساء',
    children: 'اطفال',
  },
}

export const PLACEHOLDER = {
  name: 'سارة',
  phone: '01XXXXXXXXXX',
  password: '********',
  address: {
    city: 'القاهرة',
    region: 'مدينة نصر / النزهة',
    street: 'اسم الشارع',
    building: 'اسم / رقم المبنى, رقم الطابق, رقم الشقة',
    mark: 'اختيارى',
  },
}

const registerRoute = '/register'
const loginRoute = '/login'
const resetPasswordRoute = '/reset-password'
const newPasswordRoute = '/new-password'

export const ROUTES = {
  defaultLoginRedirect: '/account/profile',
  register: registerRoute,
  login: loginRoute,
  resetPassword: resetPasswordRoute,
  newPassword: newPasswordRoute,
  authRoutes: [registerRoute, loginRoute, resetPasswordRoute, newPasswordRoute],
  publicRoutesRegex: [
    '^/$',
    '^/products$',
    '^/product/.+$',
    '^/search$',
    '^/cart$',
    '^/faq$',
    '^/policy$',
    '^/robots.txt$',
    '^.*/sitemap.*.xml.*$',
    `^${ASSETS.path}/.*$`,
  ],
}
