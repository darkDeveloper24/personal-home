export type IdeaStatus = 'capturing' | 'incubating' | 'ready'

export interface IdeaItem {
  id: string
  title: string
  summary: string
  status: IdeaStatus
  createdAt: string
  updatedAt: string
}

export interface MonthIdeas {
  monthKey: string
  items: IdeaItem[]
}

export interface IdeaRepository {
  listByMonth(monthKey: string): Promise<IdeaItem[]>
  create(monthKey: string, input: { title: string; summary: string }): Promise<IdeaItem>
  update(
    monthKey: string,
    ideaId: string,
    patch: Partial<Pick<IdeaItem, 'title' | 'summary' | 'status'>>,
  ): Promise<IdeaItem>
  remove(monthKey: string, ideaId: string): Promise<void>
}

interface IdeasStore {
  version: 1
  months: Record<string, MonthIdeas>
}

const STORAGE_KEY = 'personal-home:ideas:v1'

const seedMonthKey = getCurrentMonthKey()
const seedTimestamp = new Date().toISOString()

const seedStore: IdeasStore = {
  version: 1,
  months: {
    [seedMonthKey]: {
      monthKey: seedMonthKey,
      items: [
        {
          id: 'seed-quiet-os',
          title: '做一个个人灵感操作台',
          summary: '把日常闪现的产品、写作、系统化想法集中在一个月度面板里，方便回顾和筛选。',
          status: 'incubating',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
        {
          id: 'seed-daily-notes',
          title: '把零散记录变成周复盘素材',
          summary: '每月沉淀的 idea 可以在月底自动挑选，成为写作提纲、项目方向或下一步实验。',
          status: 'capturing',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
      ],
    },
  },
}

function cloneStore(store: IdeasStore): IdeasStore {
  return {
    version: store.version,
    months: Object.fromEntries(
      Object.entries(store.months).map(([monthKey, month]) => [
        monthKey,
        {
          monthKey,
          items: month.items.map((item) => ({ ...item })),
        },
      ]),
    ),
  }
}

function safeParseStore(raw: string | null): IdeasStore {
  if (!raw) {
    return cloneStore(seedStore)
  }

  try {
    const parsed = JSON.parse(raw) as IdeasStore

    if (parsed.version !== 1 || typeof parsed.months !== 'object' || !parsed.months) {
      return cloneStore(seedStore)
    }

    return parsed
  } catch {
    return cloneStore(seedStore)
  }
}

function readStore(): IdeasStore {
  if (typeof window === 'undefined') {
    return cloneStore(seedStore)
  }

  return safeParseStore(window.localStorage.getItem(STORAGE_KEY))
}

function writeStore(store: IdeasStore) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function ensureMonth(store: IdeasStore, monthKey: string): MonthIdeas {
  if (!store.months[monthKey]) {
    store.months[monthKey] = {
      monthKey,
      items: [],
    }
  }

  return store.months[monthKey]
}

function createIdeaId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `idea-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${year}-${month}`
}

export function shiftMonth(monthKey: string, delta: number) {
  const [yearText, monthText] = monthKey.split('-')
  const date = new Date(Number(yearText), Number(monthText) - 1 + delta, 1)

  return getCurrentMonthKey(date)
}

export function formatMonthLabel(monthKey: string, locale = 'zh-CN') {
  const [yearText, monthText] = monthKey.split('-')
  const date = new Date(Number(yearText), Number(monthText) - 1, 1)

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
  }).format(date)
}

export const browserIdeaRepository: IdeaRepository = {
  async listByMonth(monthKey) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    writeStore(store)

    return [...month.items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },

  async create(monthKey, input) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    const timestamp = new Date().toISOString()
    const idea: IdeaItem = {
      id: createIdeaId(),
      title: input.title.trim(),
      summary: input.summary.trim(),
      status: 'capturing',
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    month.items.unshift(idea)
    writeStore(store)

    return idea
  },

  async update(monthKey, ideaId, patch) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    const current = month.items.find((item) => item.id === ideaId)

    if (!current) {
      throw new Error('Idea not found')
    }

    const nextIdea: IdeaItem = {
      ...current,
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() : current.title,
      summary: patch.summary !== undefined ? patch.summary.trim() : current.summary,
      updatedAt: new Date().toISOString(),
    }

    month.items = month.items.map((item) => (item.id === ideaId ? nextIdea : item))
    writeStore(store)

    return nextIdea
  },

  async remove(monthKey, ideaId) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    month.items = month.items.filter((item) => item.id !== ideaId)
    writeStore(store)
  },
}
