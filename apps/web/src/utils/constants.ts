export const assetEP = `/api/assets`

export const ASSETS = {
  path: '/app/apps/web/uploads',
  images: `${assetEP}/images`,
} as const

export const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
  query: 'query',
  redirectTo: 'redirectTo',
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
    faq: '/faq',
    policy: '/policy',
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
}

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
  },
}

export const bcryptSalt = 10

// TODO: real cost
export const shippingCost = 0
