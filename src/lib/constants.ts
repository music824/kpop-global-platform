export const EVENT_TYPES = {
  concert: '演唱会',
  fansign: '签售会',
  popup: '快闪店',
  fanmeeting: '粉丝会',
  festival: '音乐节',
  broadcast: '直播',
} as const

export const NEWS_TYPES = {
  schedule: '日程',
  achievement: '成就',
  comeback: '回归',
  event: '活动',
  controversy: '争议',
} as const

export const COUNTRIES = [
  { code: 'KR', name: '韩国', flag: '🇰🇷' },
  { code: 'CN', name: '中国', flag: '🇨🇳' },
  { code: 'US', name: '美国', flag: '🇺🇸' },
  { code: 'JP', name: '日本', flag: '🇯🇵' },
  { code: 'SG', name: '新加坡', flag: '🇸🇬' },
  { code: 'TH', name: '泰国', flag: '🇹🇭' },
] as const

export const SITE_NAME = 'KPOP Global Platform'
export const SITE_DESCRIPTION = 'AI驱动的全球KPOP实时活动与数据平台'