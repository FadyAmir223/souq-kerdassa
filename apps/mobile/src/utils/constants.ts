export const SEARCH_PARAMS = {
  path: 'p',
  width: 'w',
  quality: 'q',
  query: 'query',
  redirectTo: 'redirectTo',
  redirectedFrom: 'redirectedFrom',
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
