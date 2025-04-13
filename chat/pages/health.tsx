// Import statements remain unchanged...
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Progress
} from '@chakra-ui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Layout from '../components/layouts/article'
import Section from '../components/section'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Interfaces remain unchanged...
interface DataPoint {
  startTimeNanos: string
  endTimeNanos?: string
  value: Array<{ intVal?: string; fpVal?: number; mapVal?: any[] }>
}

interface GoogleFitData {
  stepsData?: { point?: DataPoint[] }
  heartRateData?: { point?: DataPoint[] }
  restingHeartRateData?: { point?: DataPoint[] } | null
  sleepData?: { point?: DataPoint[] } | null
  oxygenData?: { point?: DataPoint[] } | null
}

const HealthPage = () => {
  const router = useRouter()
  const { access_token } = router.query

  const [fetchedData, setFetchedData] = useState<GoogleFitData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cardBg = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900')

  const fetchHealthData = async (token: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/google-fit/data?access_token=${token}`)
      if (!res.ok) {
        throw new Error('Failed to fetch data from Google Fit API.')
      }
      const data = await res.json()
      console.log('Fetched Google Fit data:', data)
      setFetchedData(data)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (access_token && typeof access_token === 'string') {
      fetchHealthData(access_token)
    }
  }, [access_token])

  // --- Data Parsers ---
  const getTotalSteps = () => {
    const points = fetchedData?.stepsData?.point || []
    return points.reduce(
      (acc: number, curr: DataPoint) =>
        acc + parseInt(curr.value[0]?.intVal || '0', 10),
      0
    )
  }

  const getAverageHeartRate = () => {
    const points = fetchedData?.heartRateData?.point || []
    if (points.length === 0) return 0
    const total = points.reduce((acc: number, curr: DataPoint) => {
      return acc + (curr.value[0]?.fpVal ?? 0)
    }, 0)
    return total / points.length
  }

  const getAverageRestingHr = () => {
    const points = fetchedData?.restingHeartRateData?.point || []
    if (points.length === 0) return 0
    const total = points.reduce((acc: number, curr: DataPoint) => {
      return acc + (curr.value[0]?.fpVal ?? 0)
    }, 0)
    return total / points.length
  }

  const getTotalSleepDuration = () => {
    const points = fetchedData?.sleepData?.point || []
    let totalNanos = 0
    points.forEach((point) => {
      if (point.endTimeNanos && parseInt(point.value[0]?.intVal || '0', 10) !== 1) {
        const start = parseInt(point.startTimeNanos, 10)
        const end = parseInt(point.endTimeNanos, 10)
        totalNanos += end - start
      }
    })
    return totalNanos / 1e6
  }

  const formatSleepDuration = (ms: number) => {
    if (ms <= 0) return 'No data'
    const totalMinutes = Math.floor(ms / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getAverageOxygenSaturation = () => {
    const points = fetchedData?.oxygenData?.point || []
    if (points.length === 0) return 0
    const total = points.reduce((acc: number, curr: DataPoint) => {
      return acc + (curr.value[0]?.fpVal ?? 0)
    }, 0)
    return total / points.length
  }

  // --- Chart Data for Steps ---
  const stepsChartData = () => {
    const points = fetchedData?.stepsData?.point || []
    if (points.length === 0) return null

    const labels = points.map((point) => {
      const timeInMs = parseInt(point.startTimeNanos, 10) / 1e6
      return new Date(timeInMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    const dataPoints = points.map((point) =>
      parseInt(point.value[0]?.intVal || '0', 10)
    )

    return {
      labels,
      datasets: [
        {
          label: 'Steps',
          data: dataPoints,
          fill: false,
          borderColor: '#319795',
          backgroundColor: '#319795',
          tension: 0.1
        }
      ]
    }
  }

  // --- Chart Data for Oxygen Saturation ---
  const oxygenChartData = () => {
    const points = fetchedData?.oxygenData?.point || []
    if (points.length === 0) return null

    const labels = points.map((point) => {
      const timeInMs = parseInt(point.startTimeNanos, 10) / 1e6
      return new Date(timeInMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    const dataPoints = points.map((point) => point.value[0]?.fpVal ?? 0)

    return {
      labels,
      datasets: [
        {
          label: 'Oxygen Saturation (%)',
          data: dataPoints,
          fill: false,
          borderColor: '#805AD5',
          backgroundColor: '#D6BCFA',
          tension: 0.1
        }
      ]
    }
  }

  // --- Chart Data for Heart Rate ---
  const hrChartData = () => {
    const points = fetchedData?.heartRateData?.point || []
    if (points.length === 0) return null

    const labels = points.map((point) => {
      const timeInMs = parseInt(point.startTimeNanos, 10) / 1e6
      return new Date(timeInMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    const dataPoints = points.map((point) => point.value[0]?.fpVal ?? 0)

    return {
      labels,
      datasets: [
        {
          label: 'Heart Rate (bpm)',
          data: dataPoints,
          fill: false,
          borderColor: '#E53E3E',
          backgroundColor: '#FEB2B2',
          tension: 0.1
        }
      ]
    }
  }

  const stepsToday = getTotalSteps()
  const avgHR = getAverageHeartRate()
  const restingHR = getAverageRestingHr()
  const totalSleepMs = getTotalSleepDuration()
  const avgOxygen = getAverageOxygenSaturation()

  return (
    <Layout title="Health Dashboard">
      <Section delay={0.1}>
        <Heading
          as="h1"
          mb={6}
          fontSize="3xl"
          color={useColorModeValue('teal.600', 'teal.300')}
        >
          Health Dashboard
        </Heading>

        {!access_token && (
          <VStack spacing={4} mb={8}>
            <Text>Please connect your Google Fit account to sync your health data.</Text>
            <NextLink href="/api/google-fit/auth" passHref legacyBehavior>
              <Button as="a" colorScheme="teal">
                Connect to Google Fit
              </Button>
            </NextLink>
          </VStack>
        )}

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading && <Spinner size="xl" color="teal.400" />}

        {access_token && !loading && !error && fetchedData && (
          <>
            {/* Main Stats Row */}
            <SimpleGrid columns={[1, 2, 4]} spacing={4} mb={8}>
              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Heart Rate</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="teal.300">
                  {avgHR ? `${avgHR.toFixed(1)} bpm` : 'No data'}
                </Text>
              </Box>

              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Steps</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="teal.300">
                  {stepsToday ? stepsToday : 'No data'}
                </Text>
              </Box>

              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Sleep</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="teal.300">
                  {formatSleepDuration(totalSleepMs)}
                </Text>
              </Box>

              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Stress Level</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="teal.300">
                  No data
                </Text>
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={[1, 2]} spacing={4} mb={8}>
              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Resting Heart Rate</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="teal.300">
                  {restingHR > 0 ? `${restingHR.toFixed(1)} bpm` : 'No data'}
                </Text>
              </Box>

              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
                <Text fontWeight="bold" mb={1} color={textColor}>Oxygen Saturation</Text>
                <Text fontSize="2xl" fontWeight="semibold" color="purple.400">
                  {avgOxygen ? `${avgOxygen.toFixed(1)}%` : 'No data'}
                </Text>
              </Box>
            </SimpleGrid>

            {stepsChartData() ? (
              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} mb={8}>
                <Heading as="h2" fontSize="xl" mb={4} color={textColor}>
                  Steps Over the Last 24 Hours
                </Heading>
                <Line data={stepsChartData()} />
              </Box>
            ) : (
              <Text color={textColor} mb={8}>
                No step data available for the selected time range.
              </Text>
            )}

            {hrChartData() ? (
              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} mb={8}>
                <Heading as="h2" fontSize="xl" mb={4} color={textColor}>
                  Heart Rate Over the Last 24 Hours
                </Heading>
                <Line data={hrChartData()} />
              </Box>
            ) : (
              <Text color={textColor} mb={8}>
                No heart rate data available for the selected time range.
              </Text>
            )}

            {oxygenChartData() ? (
              <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} mb={8}>
                <Heading as="h2" fontSize="xl" mb={4} color={textColor}>
                  Oxygen Saturation Over the Last 24 Hours
                </Heading>
                <Line data={oxygenChartData()} />
              </Box>
            ) : (
              <Text color={textColor} mb={8}>
                No oxygen saturation data available for the selected time range.
              </Text>
            )}

            <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center" mb={8}>
              <Text color={textColor} mb={2}>Steps Goal (10,000)</Text>
              <Progress
                value={(stepsToday / 10000) * 100}
                colorScheme="teal"
                size="sm"
                borderRadius="md"
              />
              <Text color={textColor} fontSize="sm" mt={2}>
                {`${stepsToday} / 10,000 steps`}
              </Text>
            </Box>

            <Box bg={cardBg} rounded="lg" boxShadow="md" p={4} textAlign="center">
              <Button
                onClick={() =>
                  access_token && fetchHealthData(access_token.toString())
                }
                colorScheme="teal"
              >
                Sync Again
              </Button>
            </Box>
          </>
        )}
      </Section>
    </Layout>
  );
}

export default HealthPage
