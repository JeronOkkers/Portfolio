// pages/api/google-fit/data.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

const DATA_SOURCE = {
  steps: "derived:com.google.step_count.delta:com.google.android.gms:merge_step_deltas",
  bpm: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm",
  rhr: "derived:com.google.heart_rate.bpm:com.google.android.gms:resting_heart_rate<-merge_heart_rate_bpm",
  sleep: "derived:com.google.sleep.segment:com.google.android.gms:merged", // using merged as seen in your OAuth response
  // Oxygen Saturation mapping. Note: This mapping might return no data if your account does not have a corresponding data source.
  oxygen: "derived:com.google.oxygen_saturation:com.google.android.gms:merge_oxygen_saturation"
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { access_token } = req.query

  if (!access_token || Array.isArray(access_token)) {
    return res.status(400).json({ error: 'Access token is required.' })
  }

  const oauth2Client = new google.auth.OAuth2()
  oauth2Client.setCredentials({ access_token })

  const fitness = google.fitness({ version: 'v1', auth: oauth2Client })

  // Use the last 24 hours as an example.
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  // Google Fit expects nanoseconds.
  const datasetId = `${oneDayAgo * 1000000}-${now * 1000000}`

  try {
    // Steps data
    const stepsResponse = await fitness.users.dataSources.datasets.get({
      userId: 'me',
      dataSourceId: DATA_SOURCE.steps,
      datasetId
    })

    // Active Heart Rate data
    let hrResponse = null
    try {
      hrResponse = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: DATA_SOURCE.bpm,
        datasetId
      })
    } catch (err) {
      console.warn('Active heart rate data not available.', err)
    }

    // Resting Heart Rate data
    let restingHrResponse = null
    try {
      restingHrResponse = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: DATA_SOURCE.rhr,
        datasetId
      })
    } catch (err) {
      console.warn('Resting heart rate data not available.', err)
    }

    // Sleep data
    let sleepResponse = null
    try {
      sleepResponse = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: DATA_SOURCE.sleep,
        datasetId
      })
    } catch (err) {
      console.warn('Sleep data not available.', err)
    }

    // Oxygen Saturation data
    let oxygenResponse = null
    try {
      oxygenResponse = await fitness.users.dataSources.datasets.get({
        userId: 'me',
        dataSourceId: DATA_SOURCE.oxygen,
        datasetId
      })
    } catch (err) {
      console.warn('Oxygen saturation data not available.', err)
    }

    res.status(200).json({
      stepsData: stepsResponse.data,
      heartRateData: hrResponse ? hrResponse.data : null,
      restingHeartRateData: restingHrResponse ? restingHrResponse.data : null,
      sleepData: sleepResponse ? sleepResponse.data : null,
      oxygenData: oxygenResponse ? oxygenResponse.data : null
    })
  } catch (error) {
    console.error('Error fetching Google Fit data:', error)
    res.status(500).json({ error: 'Failed to fetch data.' })
  }
}
