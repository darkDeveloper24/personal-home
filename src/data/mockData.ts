import type { SectionKey } from './sections'

export interface MetricData {
  label: string
  value: string
  detail: string
  trend: string
}

export interface PanelItemData {
  title: string
  meta: string
  description: string
  tag?: string
}

export interface PanelData {
  eyebrow: string
  title: string
  badge?: string
  items: PanelItemData[]
}

export interface SectionContent {
  eyebrow: string
  title: string
  description: string
  quote: string
  metrics: MetricData[]
  panels: PanelData[]
}

export const dashboardContent: Record<SectionKey, SectionContent> = {
  work: {
    eyebrow: 'Operator mode',
    title: 'Work',
    description:
      'A composed command center for priorities, project cadence, and the few decisions that create leverage.',
    quote: 'Less noise. More signal. Protect the hours that move the needle.',
    metrics: [
      {
        label: 'Focus hours',
        value: '18.5h',
        detail: 'Deep work scheduled this week',
        trend: '+3.2h vs last week',
      },
      {
        label: 'Top priorities',
        value: '05',
        detail: 'Items with meaningful impact',
        trend: '2 ready for today',
      },
      {
        label: 'Meetings',
        value: '07',
        detail: 'High-context conversations only',
        trend: '41% fewer than last month',
      },
    ],
    panels: [
      {
        eyebrow: 'Priority stack',
        title: 'This week’s outcomes',
        badge: 'High leverage',
        items: [
          {
            title: 'Ship homepage refresh',
            meta: 'Design system · Today 14:00',
            description: 'Polish interaction details, verify mobile layout, and package a clean launch candidate.',
            tag: 'In motion',
          },
          {
            title: 'Outline Q3 roadmap',
            meta: 'Strategy · Tomorrow',
            description: 'Reduce the roadmap to three bets with measurable success signals and clear trade-offs.',
            tag: 'Drafting',
          },
          {
            title: 'Prepare hiring brief',
            meta: 'People · Friday',
            description: 'Define role scorecard, interview loop, and what excellent performance looks like in 90 days.',
            tag: 'Needs review',
          },
        ],
      },
      {
        eyebrow: 'Projects in motion',
        title: 'Where energy is going',
        badge: '3 active tracks',
        items: [
          {
            title: 'Creator dashboard',
            meta: 'Product build',
            description: 'UI architecture is stable; next step is analytics surface and onboarding refinements.',
            tag: '82%',
          },
          {
            title: 'Knowledge vault',
            meta: 'Internal systems',
            description: 'Organizing notes, prompts, and reusable frameworks into a searchable operating library.',
            tag: '58%',
          },
          {
            title: 'Brand refresh',
            meta: 'Narrative + visuals',
            description: 'Clarifying tone, typography, and landing page hierarchy for a more premium feel.',
            tag: '31%',
          },
        ],
      },
      {
        eyebrow: 'Calendar horizon',
        title: 'Upcoming checkpoints',
        badge: 'Next 72h',
        items: [
          {
            title: 'Design critique',
            meta: 'Wed · 10:30',
            description: 'Review concept variations, edge-case states, and narrative clarity before implementation.',
          },
          {
            title: 'Founder sync',
            meta: 'Thu · 16:00',
            description: 'Align on go/no-go criteria, resourcing, and the sequence of key product bets.',
          },
          {
            title: 'Async writing block',
            meta: 'Fri · 09:00',
            description: 'Protect an uninterrupted session for strategy memo drafting and decision framing.',
          },
        ],
      },
      {
        eyebrow: 'Signals',
        title: 'Blockers and notes',
        badge: 'Stay honest',
        items: [
          {
            title: 'Decision fatigue creeping in',
            meta: 'Pattern to watch',
            description: 'Cluster small approvals into one daily slot so they stop fragmenting high-quality work.',
          },
          {
            title: 'Design review loop too wide',
            meta: 'Process simplification',
            description: 'Tighten the approval group to reduce churn and preserve a coherent visual point of view.',
          },
          {
            title: 'Need a better weekly reset',
            meta: 'Operating system',
            description: 'A sharper Friday ritual would make Monday easier and keep the project list grounded.',
          },
        ],
      },
    ],
  },
  body: {
    eyebrow: 'Vital systems',
    title: 'Body',
    description:
      'A softer dashboard for rhythm, training, and recovery—designed to protect energy rather than simply count outputs.',
    quote: 'Sustainable intensity comes from recovery done on purpose.',
    metrics: [
      {
        label: 'Sleep average',
        value: '7.8h',
        detail: 'Seven-day rolling baseline',
        trend: '+0.6h from prior week',
      },
      {
        label: 'Training sessions',
        value: '04',
        detail: 'Completed this week',
        trend: '2 strength · 2 cardio',
      },
      {
        label: 'Recovery score',
        value: '86',
        detail: 'Readiness and strain balance',
        trend: 'Well positioned for intensity',
      },
    ],
    panels: [
      {
        eyebrow: 'Morning rhythm',
        title: 'Anchors for the day',
        badge: 'Keep simple',
        items: [
          {
            title: 'Hydrate before coffee',
            meta: 'Upon waking',
            description: '500ml of water, light exposure, and a few minutes of breathing before opening screens.',
            tag: 'Daily',
          },
          {
            title: 'Mobility sequence',
            meta: '8-minute reset',
            description: 'Neck, hips, thoracic spine, and hamstrings to undo desk posture before the first work block.',
            tag: 'Ready',
          },
          {
            title: 'Protein-forward breakfast',
            meta: 'Stability first',
            description: 'Aim for a meal that supports steady energy and avoids the sharp mid-morning crash.',
            tag: 'Consistent',
          },
        ],
      },
      {
        eyebrow: 'Training split',
        title: 'Movement this week',
        badge: 'Balanced load',
        items: [
          {
            title: 'Lower body strength',
            meta: 'Mon · Completed',
            description: 'Controlled volume, strong tempo, and no grinders—quality reps over ego.',
            tag: 'Done',
          },
          {
            title: 'Zone 2 session',
            meta: 'Wed · 45 min',
            description: 'Low-intensity cardio for recovery, mood, and metabolic support without extra fatigue.',
            tag: 'Planned',
          },
          {
            title: 'Upper body + core',
            meta: 'Fri · 60 min',
            description: 'Press, pull, carry, brace—keep it efficient and leave something in the tank.',
            tag: 'Scheduled',
          },
        ],
      },
      {
        eyebrow: 'Nutrition rhythm',
        title: 'Inputs that affect clarity',
        badge: 'Small edges',
        items: [
          {
            title: 'Lunch without heaviness',
            meta: 'Workday fuel',
            description: 'Favor meals that support steady concentration instead of demanding an afternoon recovery nap.',
          },
          {
            title: 'Electrolytes after training',
            meta: 'Recovery support',
            description: 'Keep post-session hydration intentional when temperatures rise or work blocks run long.',
          },
          {
            title: 'Evening cutoff',
            meta: 'Sleep protection',
            description: 'Tighten late caffeine and reduce random snacking so sleep quality remains predictable.',
          },
        ],
      },
      {
        eyebrow: 'Recovery signals',
        title: 'What to pay attention to',
        badge: 'Listen early',
        items: [
          {
            title: 'Shoulders feel loaded',
            meta: 'Desk posture signal',
            description: 'Add a mid-day decompression break and re-check monitor height before it turns into pain.',
          },
          {
            title: 'Evening energy dips',
            meta: 'Pattern emerging',
            description: 'A short walk after lunch and tighter meal timing may smooth the back half of the day.',
          },
          {
            title: 'Recovery window is improving',
            meta: 'Good sign',
            description: 'Sleep consistency appears to be working; keep the bedtime floor stable for another week.',
          },
        ],
      },
    ],
  },
  money: {
    eyebrow: 'Financial clarity',
    title: 'Money',
    description:
      'A calm overview of spending, reserves, and future optionality so decisions feel deliberate instead of reactive.',
    quote: 'Money becomes useful when it creates steadiness, freedom, and room to choose well.',
    metrics: [
      {
        label: 'Cash runway',
        value: '11.4 mo',
        detail: 'Based on current burn rate',
        trend: '+1.1 months since Q1',
      },
      {
        label: 'Monthly spend',
        value: '¥18.2k',
        detail: 'Current average outflow',
        trend: '-6.4% versus last month',
      },
      {
        label: 'Savings rate',
        value: '34%',
        detail: 'Income retained this month',
        trend: 'On track for annual target',
      },
    ],
    panels: [
      {
        eyebrow: 'Budget posture',
        title: 'Where the month is going',
        badge: 'Intentional spend',
        items: [
          {
            title: 'Housing + utilities',
            meta: 'Stable base',
            description: 'Core living costs remain predictable and well within the comfort range.',
            tag: '¥8.6k',
          },
          {
            title: 'Health + training',
            meta: 'Energy investment',
            description: 'Gym, quality food, and recovery tools continue to earn their keep.',
            tag: '¥2.4k',
          },
          {
            title: 'Learning + tools',
            meta: 'Leverage spend',
            description: 'Software and education costs are modest and tied directly to output quality.',
            tag: '¥1.8k',
          },
        ],
      },
      {
        eyebrow: 'Upcoming bills',
        title: 'Near-term obligations',
        badge: 'Next 14 days',
        items: [
          {
            title: 'Rent transfer',
            meta: 'Jul 05',
            description: 'Largest fixed payment of the month; already covered by the operating buffer.',
            tag: 'Scheduled',
          },
          {
            title: 'Cloud subscriptions',
            meta: 'Jul 09',
            description: 'Review which tools are truly active before the renewal window closes.',
            tag: 'Review',
          },
          {
            title: 'Insurance premium',
            meta: 'Jul 14',
            description: 'Annual protection expense—worth revisiting only if coverage assumptions changed.',
            tag: 'Auto-pay',
          },
        ],
      },
      {
        eyebrow: 'Savings goals',
        title: 'Building optionality',
        badge: 'Longer horizon',
        items: [
          {
            title: 'Six-month reserve',
            meta: 'Safety and flexibility',
            description: 'Maintain a cash cushion large enough to support creative risk without stress.',
            tag: '72%',
          },
          {
            title: 'Travel fund',
            meta: 'Autumn reset',
            description: 'Small recurring transfers keep the trip possible without disrupting other priorities.',
            tag: '48%',
          },
          {
            title: 'Studio upgrade',
            meta: 'Workspace quality',
            description: 'Budgeting for a calmer, better-lit environment that compounds work and wellbeing.',
            tag: '29%',
          },
        ],
      },
      {
        eyebrow: 'Recent activity',
        title: 'What deserves review',
        badge: 'Stay aware',
        items: [
          {
            title: 'Dining out trending higher',
            meta: 'Lifestyle drift',
            description: 'Not a problem yet, but worth watching if it begins crowding out more intentional spending.',
          },
          {
            title: 'Tool stack remains tidy',
            meta: 'Good discipline',
            description: 'Recurring software costs are still aligned with active projects and clear ROI.',
          },
          {
            title: 'Extra room for saving this month',
            meta: 'Opportunity',
            description: 'A lighter schedule of travel and events creates a nice window to overfund reserves.',
          },
        ],
      },
    ],
  },
}
