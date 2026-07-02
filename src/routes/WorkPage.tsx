import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Clock3,
  ListTodo,
  PauseCircle,
  PencilLine,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Card } from '../components/ui/Card'
import { MetricCard } from '../components/ui/MetricCard'
import { Pill } from '../components/ui/Pill'
import { SectionHero } from '../components/ui/SectionHero'
import {
  browserWorkRepository,
  formatMonthLabel,
  getCurrentMonthKey,
  shiftMonth,
  type WorkItem,
  type WorkPriority,
  type WorkStatus,
} from '../data/workRepository'

const statusLabels: Record<WorkStatus, string> = {
  planned: '计划中',
  in_progress: '进行中',
  blocked: '阻塞',
  done: '已完成',
}

const priorityLabels: Record<WorkPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

const statusMeta: Array<{ key: WorkStatus; icon: typeof ListTodo }> = [
  { key: 'planned', icon: ListTodo },
  { key: 'in_progress', icon: Clock3 },
  { key: 'blocked', icon: PauseCircle },
  { key: 'done', icon: CircleCheck },
]

export function WorkPage() {
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey())
  const [items, setItems] = useState<WorkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [draftTitle, setDraftTitle] = useState('')
  const [draftSummary, setDraftSummary] = useState('')
  const [draftPriority, setDraftPriority] = useState<WorkPriority>('medium')
  const [draftTargetDate, setDraftTargetDate] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingSummary, setEditingSummary] = useState('')
  const [editingPriority, setEditingPriority] = useState<WorkPriority>('medium')
  const [editingTargetDate, setEditingTargetDate] = useState('')

  useEffect(() => {
    let active = true

    async function loadMonth() {
      setLoading(true)
      setError(null)

      try {
        const nextItems = await browserWorkRepository.listByMonth(monthKey)

        if (active) {
          setItems(nextItems)
        }
      } catch {
        if (active) {
          setError('这个月的工作规划暂时没有成功载入。')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadMonth()

    return () => {
      active = false
    }
  }, [monthKey])

  const monthLabel = formatMonthLabel(monthKey)

  const groupedItems = useMemo(
    () =>
      statusMeta.map(({ key, icon }) => ({
        status: key,
        icon,
        title: statusLabels[key],
        items: items.filter((item) => item.status === key),
      })),
    [items],
  )

  const metrics = useMemo(() => {
    const total = items.length
    const inProgress = items.filter((item) => item.status === 'in_progress').length
    const blocked = items.filter((item) => item.status === 'blocked').length
    const done = items.filter((item) => item.status === 'done').length

    return [
      {
        label: '本月任务',
        value: String(total).padStart(2, '0'),
        detail: `${monthLabel} 已纳入规划的事项`,
        trend: total > 0 ? '持续更新真正重要的工作' : '从一项本月重点开始',
      },
      {
        label: '进行中',
        value: String(inProgress).padStart(2, '0'),
        detail: '本月正在推进的工作',
        trend: inProgress > 0 ? '聚焦最值得推进的事项' : '暂时还没有进入执行的任务',
      },
      {
        label: '阻塞',
        value: String(blocked).padStart(2, '0'),
        detail: '需要决策、反馈或资源支持',
        trend: blocked > 0 ? '优先清理阻塞，恢复推进节奏' : '当前没有明显阻塞项',
      },
      {
        label: '已完成',
        value: String(done).padStart(2, '0'),
        detail: '本月已经收尾的任务',
        trend: done > 0 ? '把完成项沉淀进复盘' : '完成项会在这里累计',
      },
    ]
  }, [items, monthLabel])

  async function refreshMonth() {
    const nextItems = await browserWorkRepository.listByMonth(monthKey)
    setItems(nextItems)
  }

  async function handleCreateItem() {
    if (!draftTitle.trim()) {
      setError('请先填写任务标题。')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await browserWorkRepository.create(monthKey, {
        title: draftTitle,
        summary: draftSummary,
        priority: draftPriority,
        targetDate: draftTargetDate,
      })
      setDraftTitle('')
      setDraftSummary('')
      setDraftPriority('medium')
      setDraftTargetDate('')
      await refreshMonth()
    } catch {
      setError('保存任务失败，请稍后再试。')
    } finally {
      setSaving(false)
    }
  }

  function startEditing(item: WorkItem) {
    setEditingId(item.id)
    setEditingTitle(item.title)
    setEditingSummary(item.summary)
    setEditingPriority(item.priority)
    setEditingTargetDate(item.targetDate)
    setError(null)
  }

  function stopEditing() {
    setEditingId(null)
    setEditingTitle('')
    setEditingSummary('')
    setEditingPriority('medium')
    setEditingTargetDate('')
  }

  async function handleSaveEdit() {
    if (!editingId) {
      return
    }

    if (!editingTitle.trim()) {
      setError('编辑时标题不能为空。')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await browserWorkRepository.update(monthKey, editingId, {
        title: editingTitle,
        summary: editingSummary,
        priority: editingPriority,
        targetDate: editingTargetDate,
      })
      stopEditing()
      await refreshMonth()
    } catch {
      setError('更新任务失败，请稍后再试。')
    } finally {
      setSaving(false)
    }
  }

  async function handleStatusChange(itemId: string, status: WorkStatus) {
    setSaving(true)
    setError(null)

    try {
      await browserWorkRepository.update(monthKey, itemId, { status })
      await refreshMonth()
    } catch {
      setError('状态更新失败，请稍后再试。')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteItem(itemId: string) {
    setSaving(true)
    setError(null)

    try {
      await browserWorkRepository.remove(monthKey, itemId)
      if (editingId === itemId) {
        stopEditing()
      }
      await refreshMonth()
    } catch {
      setError('删除任务失败，请稍后再试。')
    } finally {
      setSaving(false)
    }
  }

  function formatTargetDate(value: string) {
    if (!value) {
      return '未设定'
    }

    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(value))
  }

  return (
    <section className="work-planning-page">
      <SectionHero
        eyebrow="月度工作规划"
        title="Work"
        description="按月整理真正要推进的工作，把任务放进一个更平静、清晰、可持续更新的规划系统。"
        quote={`${monthLabel} 是当前工作周期。先写清重点，再判断哪些任务要开始、哪些被阻塞、哪些已经完成。`}
      />

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <Card className="work-toolbar">
        <div className="work-toolbar__month-switcher">
          <button
            type="button"
            className="flat-button"
            onClick={() => setMonthKey((current) => shiftMonth(current, -1))}
          >
            <ArrowLeft size={16} />
            上个月
          </button>

          <div className="work-toolbar__month-summary">
            <p className="work-toolbar__eyebrow">当前规划周期</p>
            <h2 className="work-toolbar__month-title">{monthLabel}</h2>
            <p className="work-toolbar__month-detail">按自然月组织任务，方便复盘、切换和延续下一阶段计划。</p>
          </div>

          <button
            type="button"
            className="flat-button"
            onClick={() => setMonthKey((current) => shiftMonth(current, 1))}
          >
            下个月
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="work-toolbar__meta">
          <Pill>{items.length} 项任务</Pill>
          <Pill>repository 已预留后端接口形态</Pill>
          <button type="button" className="flat-button flat-button--primary" onClick={() => setMonthKey(getCurrentMonthKey())}>
            <CalendarDays size={16} />
            回到本月
          </button>
        </div>
      </Card>

      <div className="work-planning-layout">
        <Card className="planning-composer">
          <div className="planning-composer__header">
            <div>
              <p className="panel-card__eyebrow">新增任务</p>
              <h2 className="panel-card__title">先写下本月真正要推进的事</h2>
            </div>
            <Pill variant="accent">写入 {monthLabel}</Pill>
          </div>

          <div className="planning-composer__fields">
            <label className="flat-field">
              <span className="flat-field__label">任务标题</span>
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="flat-input"
                placeholder="例如：完成首页改版交付"
              />
            </label>

            <label className="flat-field">
              <span className="flat-field__label">任务说明</span>
              <textarea
                value={draftSummary}
                onChange={(event) => setDraftSummary(event.target.value)}
                className="flat-textarea"
                rows={5}
                placeholder="写清楚目标、边界、或者当前判断依据。"
              />
            </label>

            <div className="planning-composer__split-fields">
              <label className="flat-field">
                <span className="flat-field__label">优先级</span>
                <select
                  className="flat-select"
                  value={draftPriority}
                  onChange={(event) => setDraftPriority(event.target.value as WorkPriority)}
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flat-field">
                <span className="flat-field__label">目标日期</span>
                <input
                  type="date"
                  value={draftTargetDate}
                  onChange={(event) => setDraftTargetDate(event.target.value)}
                  className="flat-input"
                />
              </label>
            </div>
          </div>

          <div className="planning-composer__actions">
            <button
              type="button"
              className="flat-button flat-button--primary"
              onClick={handleCreateItem}
              disabled={saving}
            >
              <Plus size={16} />
              添加任务
            </button>
            <p className="planning-composer__hint">第一版仍是本地存储，但数据结构已按未来后端同步准备好。</p>
          </div>

          {error ? <p className="planning-feedback">{error}</p> : null}
        </Card>

        <div className="planning-board">
          {groupedItems.map((group) => {
            const Icon = group.icon

            return (
              <Card className="planning-column" key={group.status}>
                <div className="planning-column__header">
                  <div className="planning-column__title-wrap">
                    <Icon size={18} />
                    <div>
                      <p className="panel-card__eyebrow">状态分组</p>
                      <h2 className="panel-card__title">{group.title}</h2>
                    </div>
                  </div>
                  <Pill>{group.items.length} 项</Pill>
                </div>

                {loading ? (
                  <div className="planning-empty-state">
                    <p>正在载入 {group.title}…</p>
                  </div>
                ) : group.items.length === 0 ? (
                  <div className="planning-empty-state">
                    <p className="planning-empty-state__title">这个分组目前为空。</p>
                    <p className="planning-empty-state__description">把真正该进入这一状态的工作放进来，系统才会保持诚实。</p>
                  </div>
                ) : (
                  <div className="planning-item-list">
                    {group.items.map((item) => {
                      const isEditing = editingId === item.id

                      return (
                        <article className={`planning-item planning-item--${item.status}`} key={item.id}>
                          <div className="planning-item__header">
                            <div>
                              <p className="planning-item__eyebrow">
                                最后更新 · {new Intl.DateTimeFormat('zh-CN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }).format(new Date(item.updatedAt))}
                              </p>
                              {isEditing ? (
                                <input
                                  value={editingTitle}
                                  onChange={(event) => setEditingTitle(event.target.value)}
                                  className="flat-input flat-input--inline"
                                />
                              ) : (
                                <h3 className="planning-item__title">{item.title}</h3>
                              )}
                            </div>

                            <div className="planning-item__chips">
                              <Pill>{priorityLabels[item.priority]}</Pill>
                              <Pill>{formatTargetDate(item.targetDate)}</Pill>
                            </div>
                          </div>

                          {isEditing ? (
                            <textarea
                              value={editingSummary}
                              onChange={(event) => setEditingSummary(event.target.value)}
                              className="flat-textarea flat-textarea--inline"
                              rows={4}
                            />
                          ) : (
                            <p className="planning-item__summary">{item.summary || '这项工作还没有补充说明。'}</p>
                          )}

                          <div className="planning-item__controls">
                            <label className="flat-field flat-field--inline">
                              <span className="flat-field__label">状态</span>
                              <select
                                className="flat-select"
                                value={item.status}
                                onChange={(event) => void handleStatusChange(item.id, event.target.value as WorkStatus)}
                                disabled={saving}
                              >
                                {Object.entries(statusLabels).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </label>

                            {isEditing ? (
                              <>
                                <label className="flat-field flat-field--inline">
                                  <span className="flat-field__label">优先级</span>
                                  <select
                                    className="flat-select"
                                    value={editingPriority}
                                    onChange={(event) => setEditingPriority(event.target.value as WorkPriority)}
                                  >
                                    {Object.entries(priorityLabels).map(([value, label]) => (
                                      <option key={value} value={value}>
                                        {label}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                <label className="flat-field flat-field--inline">
                                  <span className="flat-field__label">目标日期</span>
                                  <input
                                    type="date"
                                    value={editingTargetDate}
                                    onChange={(event) => setEditingTargetDate(event.target.value)}
                                    className="flat-input"
                                  />
                                </label>
                              </>
                            ) : null}
                          </div>

                          <div className="planning-item__footer">
                            <div className="planning-item__timestamps">
                              <span>创建于 {new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.createdAt))}</span>
                              <span>字段包含状态、优先级与目标日期，便于后续接入 API</span>
                            </div>

                            <div className="planning-item__actions">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    className="flat-button flat-button--primary"
                                    onClick={handleSaveEdit}
                                    disabled={saving}
                                  >
                                    <Save size={16} />
                                    保存
                                  </button>
                                  <button type="button" className="flat-button" onClick={stopEditing}>
                                    <RotateCcw size={16} />
                                    取消
                                  </button>
                                </>
                              ) : (
                                <button type="button" className="flat-button" onClick={() => startEditing(item)}>
                                  <PencilLine size={16} />
                                  编辑
                                </button>
                              )}

                              <button
                                type="button"
                                className="flat-button flat-button--danger"
                                onClick={() => void handleDeleteItem(item.id)}
                                disabled={saving}
                              >
                                <Trash2 size={16} />
                                删除
                              </button>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
