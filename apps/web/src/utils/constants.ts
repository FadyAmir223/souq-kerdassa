import { env } from '@/lib/env'

export const bcryptSalt = 10

export const assetEP = '/api/assets'

export const ASSETS = {
  path: env.NODE_ENV === 'production' ? '/app/apps/web/uploads' : 'uploads',
  images: `${assetEP}/images`,
} as const

export const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
  query: 'query',
  redirectTo: 'redirectTo',
  redirectedFrom: 'redirectedFrom',
} as const

export const PLACEHOLDER = {
  form: {
    name: 'سارة',
    phone: '01XXXXXXXXXX',
    password: '********',
  },
  address: {
    city: 'القاهرة',
    region: 'مدينة نصر / النزهة',
    street: 'اسم الشارع',
    building: 'اسم / رقم المبنى, رقم الطابق, رقم الشقة',
    mark: 'اختيارى',
  },
}

export const PAGES = {
  public: {
    main: '/',
    products: '/products',
    product: (id: string) => `/product/${id}`,
    cart: '/cart',
    search: '/search',
    terms: '/terms',
    privacy: '/privacy-policy',
  },
  auth: {
    register: '/register',
    login: '/login',
    resetPassword: '/password/reset',
    newPassword: '/password/new',
  },
  protected: {
    user: {
      profile: '/account/profile',
      address: '/account/address',
      orders: '/account/orders',
    },
    buy: {
      checkout: '/checkout',
    },
  },
  other: {
    robots: '/robots.txt',
    sitemap: (id: string) => `/sitemap.${id}.xml`,
    assets: ASSETS.path,
  },
  defaultLoginRedirect: () => PAGES.protected.user.profile,
  authRoutes: () => Object.values(PAGES.auth),
} as const

export const SIZES = {
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: '2XL',
  XXXL: '3XL',
  XXXXL: '4XL',
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
  status: {
    pending: 'جارى الوصول',
    completed: 'تم الوصول',
    cancelled: 'ملغى',
    refunded: 'مسترد',
  },
} as const

export const loginFormInputs = [
  {
    type: 'text',
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.form.phone,
  },
  {
    type: 'password',
    label: 'كلمة السر',
    name: 'password',
    placeholder: PLACEHOLDER.form.password,
    autoComplete: 'current-password',
  },
] as const
