import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
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

const STAGE_META: { key: SleepStage; label: string; color: string }[] = [
  { key: 'deep', label: 'Deep', color: '#553c9a' },
  { key: 'light', label: 'Light', color: '#805ad5' },
  { key: 'rem', label: 'REM', color: '#b794f4' },
  { key: 'asleep', label: 'Asleep', color: '#9f7aea' },
  { key: 'awake', label: 'Awake', color: '#f6ad55' }
]

const Card = ({ children, ...rest }: any) => {
  const bg = useColorModeValue('whiteAlpha.600', 'whiteAlpha.100')
  return (
    <Box bg={bg} borderRadius="xl" p={4} {...rest}>
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

const chartOptions = (gridColor: string) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
    y: { grid: { color: gridColor }, beginAtZero: false }
  }
})

const series = (points: SeriesPoint[], offset: number) => ({
  labels: points.map(p => fmtTime(p.t, offset)),
  values: points.map(p => p.v)
})

const Dashboard = ({ data, onRefresh }: { data: HealthSummary; onRefresh: () => void }) => {
  const off = data.timezoneOffsetMinutes
  const gridColor = useColorModeValue('rgba(0,0,0,0.06)', 'rgba(255,255,255,0.08)')
  const steps = series(data.steps.hourly, off)
  const hr = series(data.heartRate.hourly, off)
  const sleep = data.sleep
  const hrv = data.heartRate
  const stepPct = Math.min(100, (data.steps.today / data.steps.goal) * 100)

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
        <Progress value={stepPct} colorScheme="orange" size="sm" borderRadius="md" />
      </Card>

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
                options={chartOptions(gridColor) as any}
                data={{
                  labels: steps.labels,
                  datasets: [{ data: steps.values, backgroundColor: '#ed8936', borderRadius: 4 }]
                }}
              />
            ) : (
              <Text opacity={0.6}>No steps yet today.</Text>
            )}
          </Box>
        </Card>
        <Card>
          <Text fontWeight="bold" mb={2}>
            Heart rate (last 24h)
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
                      pointRadius: 0
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

      <Text fontSize="xs" opacity={0.6} textAlign="center">
        From {data.provider} · updated {fmtTime(data.generatedAt, off)} SAST
        {data.warnings.length > 0 && ` · unavailable: ${data.warnings.join(', ')}`}
        {' · '}
        <Button size="xs" variant="link" onClick={onRefresh}>
          refresh
        </Button>
      </Text>
    </>
  )
}

const HealthPage = () => {
  const [data, setData] = useState<HealthResponse | null>(null)
  const [error, setError] = useState(false)

  const load = async () => {
    setError(false)
    try {
      const res = await fetch('/api/health/summary')
      setData(await res.json())
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <Layout title="Health">
      <Container>
        <Section delay={0.1}>
          <Heading as="h3" fontSize={20} mb={2}>
            Health
          </Heading>
          <Text mb={6} opacity={0.85}>
            I&apos;m getting back into training — calisthenics and core, three
            days a week. This page shows my own numbers, synced from my phone
            and cached on the server.
          </Text>

          {!data && !error && (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="orange.400" />
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
            <Dashboard data={data as HealthSummary} onRefresh={load} />
          )}
        </Section>
      </Container>
    </Layout>
  )
}

export default HealthPage
