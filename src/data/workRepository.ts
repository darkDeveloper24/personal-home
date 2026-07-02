export type WorkStatus = 'planned' | 'in_progress' | 'blocked' | 'done'
export type WorkPriority = 'high' | 'medium' | 'low'

export interface WorkItem {
  id: string
  title: string
  summary: string
  status: WorkStatus
  priority: WorkPriority
  targetDate: string
  createdAt: string
  updatedAt: string
}

interface MonthWorkPlan {
  monthKey: string
  items: WorkItem[]
}

interface WorkPlanStore {
  version: 1
  months: Record<string, MonthWorkPlan>
}

export interface WorkRepository {
  listByMonth(monthKey: string): Promise<WorkItem[]>
  create(
    monthKey: string,
    input: { title: string; summary: string; priority: WorkPriority; targetDate: string },
  ): Promise<WorkItem>
  update(
    monthKey: string,
    workId: string,
    patch: Partial<Pick<WorkItem, 'title' | 'summary' | 'status' | 'priority' | 'targetDate'>>,
  ): Promise<WorkItem>
  remove(monthKey: string, workId: string): Promise<void>
}

const STORAGE_KEY = 'personal-home:work-plans:v1'
const seedMonthKey = getCurrentMonthKey()
const seedTimestamp = new Date().toISOString()

const seedStore: WorkPlanStore = {
  version: 1,
  months: {
    [seedMonthKey]: {
      monthKey: seedMonthKey,
      items: [
        {
          id: 'seed-planning-review',
          title: '梳理本月工作重点',
          summary: '把本月最重要的 3 件事写清楚，再决定哪些任务应该进入进行中。',
          status: 'planned',
          priority: 'high',
          targetDate: '',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
        {
          id: 'seed-delivery',
          title: '推进主页改版交付',
          summary: '补齐关键信息层级，完成细节调整，并准备一次可演示版本。',
          status: 'in_progress',
          priority: 'high',
          targetDate: '',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
        {
          id: 'seed-blocked',
          title: '等待设计评审反馈',
          summary: '在设计方案冻结前先暂停后续实现，避免反复返工。',
          status: 'blocked',
          priority: 'medium',
          targetDate: '',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
        {
          id: 'seed-done',
          title: '完成月度复盘模板',
          summary: '把输入、输出、风险和下月行动整理成可复用模板。',
          status: 'done',
          priority: 'low',
          targetDate: '',
          createdAt: seedTimestamp,
          updatedAt: seedTimestamp,
        },
      ],
    },
  },
}

function cloneStore(store: WorkPlanStore): WorkPlanStore {
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

function safeParseStore(raw: string | null): WorkPlanStore {
  if (!raw) {
    return cloneStore(seedStore)
  }

  try {
    const parsed = JSON.parse(raw) as WorkPlanStore

    if (parsed.version !== 1 || typeof parsed.months !== 'object' || !parsed.months) {
      return cloneStore(seedStore)
    }

    return parsed
  } catch {
    return cloneStore(seedStore)
  }
}

function readStore(): WorkPlanStore {
  if (typeof window === 'undefined') {
    return cloneStore(seedStore)
  }

  return safeParseStore(window.localStorage.getItem(STORAGE_KEY))
}

function writeStore(store: WorkPlanStore) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function ensureMonth(store: WorkPlanStore, monthKey: string): MonthWorkPlan {
  if (!store.months[monthKey]) {
    store.months[monthKey] = {
      monthKey,
      items: [],
    }
  }

  return store.months[monthKey]
}

function createWorkId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `work-${Date.now()}-${Math.random().toString(16).slice(2)}`
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

function comparePriority(a: WorkPriority, b: WorkPriority) {
  const priorityWeight: Record<WorkPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return priorityWeight[b] - priorityWeight[a]
}

export const browserWorkRepository: WorkRepository = {
  async listByMonth(monthKey) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    writeStore(store)

    return [...month.items].sort((a, b) => {
      const byStatusTime = b.updatedAt.localeCompare(a.updatedAt)
      const byPriority = comparePriority(a.priority, b.priority)
      return byPriority || byStatusTime
    })
  },

  async create(monthKey, input) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    const timestamp = new Date().toISOString()
    const workItem: WorkItem = {
      id: createWorkId(),
      title: input.title.trim(),
      summary: input.summary.trim(),
      status: 'planned',
      priority: input.priority,
      targetDate: input.targetDate,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    month.items.unshift(workItem)
    writeStore(store)

    return workItem
  },

  async update(monthKey, workId, patch) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    const current = month.items.find((item) => item.id === workId)

    if (!current) {
      throw new Error('Work item not found')
    }

    const nextWorkItem: WorkItem = {
      ...current,
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() : current.title,
      summary: patch.summary !== undefined ? patch.summary.trim() : current.summary,
      targetDate: patch.targetDate !== undefined ? patch.targetDate : current.targetDate,
      updatedAt: new Date().toISOString(),
    }

    month.items = month.items.map((item) => (item.id === workId ? nextWorkItem : item))
    writeStore(store)

    return nextWorkItem
  },

  async remove(monthKey, workId) {
    const store = readStore()
    const month = ensureMonth(store, monthKey)
    month.items = month.items.filter((item) => item.id !== workId)
    writeStore(store)
  },
}
