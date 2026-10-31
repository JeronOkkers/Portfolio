import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  Container,
  Spinner,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue
} from '@chakra-ui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import SectionHeading from '../components/section-heading'
import type {
  HealthNotConfigured,
  HealthResponse,
  HealthSummary, SeriesPoint, SleepStage } from '../libs/health/types'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const fmtDuration = (ms: number) => {
  const m = Math.round(ms / 60000)
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}

// Format times in the owner's timezone, regardless of where the visitor is
const fmtTime = (t: number, offsetMin: number) => {
  const d = new Date(t + offsetMin * 60000)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

const weekday = (date: string) =>
  new Date(date + 'T12:00:00Z').toLocaleDateString('en-ZA', { weekday: 'short', timeZone: 'UTC' })

const fmtKm = (m: number | null) => (m == null ? '—' : `${(m / 1000).toFixed(1)} km`)

const daysAgo = (t: number, now: number, offsetMin: number) => {
  const d = (x: number) => Math.floor((x + offsetMin * 60000) / 86400000)
  const n = d(now) - d(t)
  return n === 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`
}

const STAGE_META: { key: SleepStage; label: string; color: string }[] = [
  { key: 'deep', label: 'Deep', color: '#553c9a' },
  { key: 'light', label: 'Light', color: '#805ad5' },
  { key: 'rem', label: 'REM', color: '#b794f4' },
  { key: 'asleep', label: 'Asleep', color: '#9f7aea' },
  { key: 'awake', label: 'Awake', color: '#f6ad55' }
]

const Card = ({ children, ...rest }: any) => {
  return (
    <Box bg="var(--card)" border="1px solid var(--line)" borderRadius="xl" p={4} {...rest}>
      {children}
    </Box>
  )
}

const StatCard = ({ label, value, help }: { label: string; value: string; help?: string }) => (
  <Card>
    <Stat>
      <StatLabel opacity={0.8}>{label}</StatLabel>
      <StatNumber fontSize="2xl">{value}</StatNumber>
      {help && <StatHelpText mb={0}>{help}</StatHelpText>}
    </Stat>
  </Card>
)

const chartOptions = (gridColor: string, fromZero = false) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
    y: { grid: { color: gridColor }, beginAtZero: fromZero }
  }
})

const series = (points: SeriesPoint[], offset: number) => ({
  labels: points.map(p => fmtTime(p.t, offset)),
  values: points.map(p => p.v)
})

const Dashboard = ({
  data,
  onRefresh,
  refreshing
}: {
  data: HealthSummary
  onRefresh: () => void
  refreshing: boolean
}) => {
  const off = data.timezoneOffsetMinutes
  const accent =
    typeof window !== 'undefined'
      ? getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#d2452f'
      : '#d2452f'
  const gridColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)')
  const steps = series(data.steps.hourly, off)
  const hr = series(data.heartRate.hourly, off)
  const sleep = data.sleep
  const hrv = data.heartRate
  const stepPct = Math.min(100, (data.steps.today / data.steps.goal) * 100)
  const weekAvg = data.week.steps.reduce((a, d) => a + d.steps, 0) / Math.max(1, data.week.steps.length)
  const goalDays = data.week.steps.filter(d => d.steps >= data.steps.goal).length
  const weekWorkouts = data.workouts.filter(w => data.generatedAt - w.start < 7 * 86400000).length
  const hasSleepWeek = data.week.sleep.some(d => d.asleepMs > 0)

  return (
    <>
      <SimpleGrid columns={[2, 2, 4]} spacing={3} mb={4}>
        <StatCard
          label="Steps today"
          value={data.steps.today.toLocaleString('en-ZA')}
          help={`${Math.round(stepPct)}% of ${data.steps.goal.toLocaleString('en-ZA')}`}
        />
        <StatCard
          label="Sleep"
          value={sleep ? fmtDuration(sleep.asleepMs) : '—'}
          help={sleep ? `${fmtTime(sleep.start, off)} → ${fmtTime(sleep.end, off)}` : 'No sleep logged'}
        />
        <StatCard
          label="Heart rate"
          value={hrv.latest ? `${hrv.latest} bpm` : '—'}
          help={hrv.average ? `avg ${Math.round(hrv.average)} bpm (24h)` : undefined}
        />
        <StatCard
          label="Resting HR"
          value={hrv.resting ? `${Math.round(hrv.resting)} bpm` : '—'}
          help={data.oxygen.average ? `SpO₂ ${data.oxygen.average}%` : undefined}
        />
      </SimpleGrid>

      <Card mb={4}>
        <Text fontWeight="bold" mb={2}>
          Step goal
        </Text>
        <Progress value={stepPct} sx={{ "& > div": { bg: "var(--accent)" } }} bg="var(--line)" size="sm" borderRadius="md" />
      </Card>

      <SimpleGrid columns={[2, 2, 4]} spacing={3} mb={4}>
        <StatCard label="Distance today" value={fmtKm(data.today.distanceMeters)} />
        <StatCard
          label="Active energy"
          value={data.today.activeCalories != null ? `${Math.round(data.today.activeCalories)} kcal` : '—'}
        />
        <StatCard
          label="7-day avg steps"
          value={Math.round(weekAvg).toLocaleString('en-ZA')}
          help={`${goalDays} of 7 days hit ${data.steps.goal.toLocaleString('en-ZA')}`}
        />
        <StatCard
          label="Workouts (7 days)"
          value={String(weekWorkouts)}
          help={data.workouts[0] ? `last ${daysAgo(data.workouts[0].start, data.generatedAt, off)}` : 'none logged yet'}
        />
      </SimpleGrid>

      {sleep && (
        <Card mb={4}>
          <Text fontWeight="bold" mb={1}>
            Last night
          </Text>
          <Text fontSize="sm" opacity={0.75} mb={3}>
            {fmtDuration(sleep.asleepMs)} asleep · {fmtDuration(sleep.inBedMs)} in bed
            {sleep.source === 'session' && ' · no stage data recorded'}
          </Text>
          {sleep.source === 'segments' && (
            <>
              <Box display="flex" h="14px" borderRadius="full" overflow="hidden" mb={2}>
                {STAGE_META.filter(s => sleep.stages[s.key]).map(s => (
                  <Box
                    key={s.key}
                    bg={s.color}
                    flexGrow={sleep.stages[s.key]}
                    title={`${s.label}: ${fmtDuration(sleep.stages[s.key] || 0)}`}
                  />
                ))}
              </Box>
              <SimpleGrid columns={[2, 4]} spacing={1} fontSize="sm">
                {STAGE_META.filter(s => sleep.stages[s.key]).map(s => (
                  <Box key={s.key} display="flex" alignItems="center" gap={2}>
                    <Box w="10px" h="10px" borderRadius="sm" bg={s.color} />
                    {s.label} {fmtDuration(sleep.stages[s.key] || 0)}
                  </Box>
                ))}
              </SimpleGrid>
            </>
          )}
        </Card>
      )}

      <SimpleGrid columns={[1, 1, 2]} spacing={4} mb={4}>
        <Card>
          <Text fontWeight="bold" mb={2}>
            Steps by hour (today)
          </Text>
          <Box h="200px">
            {steps.values.some(v => v > 0) ? (
              <Bar
                options={chartOptions(gridColor, true) as any}
                data={{
                  labels: steps.labels,
                  datasets: [{ data: steps.values, backgroundColor: accent, borderRadius: 4 }]
                }}
              />
            ) : (
              <Text opacity={0.6}>No steps yet today.</Text>
            )}
          </Box>
        </Card>
        <Card>
          <Text fontWeight="bold" mb={2}>
            Heart rate (last 24h, 15-min avg)
          </Text>
          <Box h="200px">
            {hr.values.length ? (
              <Line
                options={chartOptions(gridColor) as any}
                data={{
                  labels: hr.labels,
                  datasets: [
                    {
                      data: hr.values,
                      borderColor: '#e53e3e',
                      backgroundColor: 'rgba(229,62,62,0.12)',
                      fill: true,
                      tension: 0.35,
                      // with only a few readings a line has nothing to join, so show dots
                      pointRadius: hr.values.length < 8 ? 3 : 0,
                      pointBackgroundColor: '#e53e3e'
                    }
                  ]
                }}
              />
            ) : (
              <Text opacity={0.6}>No heart rate data.</Text>
            )}
          </Box>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={[1, 1, 2]} spacing={4} mb={4}>
        <Card>
          <Text fontWeight="bold" mb={2}>
            Steps · last 7 days
          </Text>
          <Box h="200px">
            <Bar
              options={chartOptions(gridColor, true) as any}
              data={{
                labels: data.week.steps.map(d => weekday(d.date)),
                datasets: [
                  {
                    data: data.week.steps.map(d => d.steps),
                    // full colour on days that hit the goal
                    backgroundColor: data.week.steps.map(d =>
                      d.steps >= data.steps.goal ? accent : `${accent}66`
                    ),
                    borderRadius: 4
                  }
                ]
              }}
            />
          </Box>
        </Card>
        <Card>
          <Text fontWeight="bold" mb={2}>
            Sleep · last 7 nights
          </Text>
          <Box h="200px">
            {hasSleepWeek ? (
              <Bar
                options={{
                  ...(chartOptions(gridColor, true) as any),
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: (c: any) => fmtDuration(c.raw * 3600000) } }
                  }
                }}
                data={{
                  labels: data.week.sleep.map(d => weekday(d.date)),
                  datasets: [
                    {
                      data: data.week.sleep.map(d => Math.round((d.asleepMs / 3600000) * 10) / 10),
                      backgroundColor: '#805ad5',
                      borderRadius: 4
                    }
                  ]
                }}
              />
            ) : (
              <Text opacity={0.6}>No sleep logged this week.</Text>
            )}
          </Box>
        </Card>
      </SimpleGrid>

      {data.workouts.length > 0 && (
        <Card mb={4}>
          <Text fontWeight="bold" mb={3}>
            Recent workouts
          </Text>
          {data.workouts.map(w => (
            <Box
              key={w.start}
              display="flex"
              justifyContent="space-between"
              py={2}
              borderTop="1px solid var(--line)"
              fontSize="sm"
            >
              <Text>{w.name}</Text>
              <Text fontFamily="mono" opacity={0.75}>
                {fmtDuration(w.durationMs)} · {daysAgo(w.start, data.generatedAt, off)}
              </Text>
            </Box>
          ))}
        </Card>
      )}

      <Text fontSize="xs" opacity={0.6} textAlign="center">
        From {data.provider}
        {data.lastSyncAt && ` · last synced ${fmtTime(data.lastSyncAt, off)}`} · page updated{' '}
        {fmtTime(data.generatedAt, off)} SAST
        {data.warnings.length > 0 && ` · unavailable: ${data.warnings.join(', ')}`}
        {' · '}
        <Button size="xs" variant="link" onClick={onRefresh} isDisabled={refreshing}>
          {refreshing ? 'refreshing…' : 'refresh'}
        </Button>
      </Text>
    </>
  )
}

const HealthPage = () => {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [error, setError] = useState(false)

  const [refreshing, setRefreshing] = useState(false)

  // fresh = true → skip the shared cache (refresh button). Otherwise use it.
  const load = async (fresh = false) => {
    setError(false)
    if (fresh) setRefreshing(true)
    try {
      const res = await fetch(`/api/health/summary${fresh ? '?fresh=1' : ''}`, { cache: 'no-store' })
      setData(await res.json())
    } catch {
      setError(true)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
    // keep the page current while it's open
    const id = setInterval(() => load(), 2 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Layout title="Health">
      <Container>
        <Section delay={0.1}>
          <SectionHeading eyebrow="Health">
            Keeping the <em>body</em> running too.
          </SectionHeading>
          <Text mb={6} opacity={0.85}>
            Live data from my Galaxy Watch, updated automatically throughout
            the day.
          </Text>

          {!data && !error && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="var(--accent)" />
            </Box>
          )}
          {error && <Text>Couldn&apos;t load health data right now.</Text>}
          {data && data.configured === false && (
            <Card textAlign="center" py={8}>
              <Text fontWeight="bold">Live stats are offline</Text>
              <Text fontSize="sm" opacity={0.75}>
                {(data as HealthNotConfigured).reason}
              </Text>
            </Card>
          )}
          {data && data.configured === true && (
            <Dashboard data={data as HealthSummary} onRefresh={() => load(true)} refreshing={refreshing} />
          )}
        </Section>
      </Container>
    </Layout>
  )
}

export default HealthPage
