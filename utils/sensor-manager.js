import {
  getHeartRate,
  getSteps,
  getSleep,
  getSpO2,
  getStress,
  getActivity
} from '@zos/sensor'
import { getTime } from '@zos/sensor'

export class SensorManager {
  constructor() {
    this.sensorData = {}
    this.lastUpdate = {}
    this.updateIntervals = {
      heart_rate: 60000,
      steps: 300000,
      sleep: 3600000,
      spo2: 300000,
      stress: 600000,
      activity: 60000
    }
  }

  updateHeartRate() {
    try {
      const hr = getHeartRate()
      if (hr && hr.current !== undefined) {
        this.sensorData.heart_rate = hr.current
        this.lastUpdate.heart_rate = getTime().getTime()
        return hr.current
      }
    } catch (e) {
      console.warn('Heart rate sensor unavailable:', e)
    }
    return null
  }

  updateSteps() {
    try {
      const steps = getSteps()
      if (steps && steps.current !== undefined) {
        this.sensorData.steps = steps.current
        this.lastUpdate.steps = getTime().getTime()
        return steps.current
      }
    } catch (e) {
      console.warn('Steps sensor unavailable:', e)
    }
    return null
  }

  updateSleep() {
    try {
      const sleep = getSleep()
      if (sleep && sleep.lastNight) {
        const sleepDuration = sleep.lastNight.duration || 0
        this.sensorData.sleep_duration = sleepDuration
        this.sensorData.sleep_quality = sleep.lastNight.quality || 0
        this.lastUpdate.sleep = getTime().getTime()
        return sleepDuration
      }
    } catch (e) {
      console.warn('Sleep sensor unavailable:', e)
    }
    return null
  }

  updateSpO2() {
    try {
      const spo2 = getSpO2()
      if (spo2 && spo2.current !== undefined) {
        this.sensorData.spo2 = spo2.current
        this.lastUpdate.spo2 = getTime().getTime()
        return spo2.current
      }
    } catch (e) {
      console.warn('SpO2 sensor unavailable:', e)
    }
    return null
  }

  updateStress() {
    try {
      const stress = getStress()
      if (stress && stress.current !== undefined) {
        this.sensorData.stress = stress.current
        this.lastUpdate.stress = getTime().getTime()
        return stress.current
      }
    } catch (e) {
      console.warn('Stress sensor unavailable:', e)
    }
    return null
  }

  updateActivity() {
    try {
      const activity = getActivity()
      if (activity) {
        this.sensorData.activity = {
          steps: activity.steps || 0,
          calories: activity.calories || 0,
          distance: activity.distance || 0,
          duration: activity.duration || 0
        }
        this.lastUpdate.activity = getTime().getTime()
        return this.sensorData.activity
      }
    } catch (e) {
      console.warn('Activity sensor unavailable:', e)
    }
    return null
  }

  updateAllSensors() {
    const now = getTime().getTime()
    const data = {}

    if (this.shouldUpdate('heart_rate', now)) {
      const hr = this.updateHeartRate()
      if (hr !== null) data.heart_rate = hr
    }

    if (this.shouldUpdate('steps', now)) {
      const steps = this.updateSteps()
      if (steps !== null) data.steps = steps
    }

    if (this.shouldUpdate('sleep', now)) {
      const sleep = this.updateSleep()
      if (sleep !== null) data.sleep_duration = sleep
    }

    if (this.shouldUpdate('spo2', now)) {
      const spo2 = this.updateSpO2()
      if (spo2 !== null) data.spo2 = spo2
    }

    if (this.shouldUpdate('stress', now)) {
      const stress = this.updateStress()
      if (stress !== null) data.stress = stress
    }

    if (this.shouldUpdate('activity', now)) {
      const activity = this.updateActivity()
      if (activity !== null) data.activity = activity
    }

    return data
  }

  shouldUpdate(sensor, now) {
    const lastUpdate = this.lastUpdate[sensor] || 0
    const interval = this.updateIntervals[sensor] || 60000
    return (now - lastUpdate) >= interval
  }

  getSensorData() {
    return { ...this.sensorData }
  }

  getSensorValue(sensor) {
    return this.sensorData[sensor]
  }

  getHeartRateZone() {
    const hr = this.sensorData.heart_rate
    if (!hr) return 'unknown'

    if (hr < 100) return 'rest'
    if (hr < 130) return 'light'
    if (hr < 160) return 'moderate'
    if (hr < 180) return 'hard'
    return 'max'
  }

  getActivityLevel() {
    const steps = this.sensorData.steps || 0

    if (steps < 1000) return 'sedentary'
    if (steps < 5000) return 'light'
    if (steps < 10000) return 'moderate'
    if (steps < 15000) return 'active'
    return 'very_active'
  }

  getStressLevel() {
    const stress = this.sensorData.stress
    if (!stress) return 'unknown'

    if (stress < 30) return 'relaxed'
    if (stress < 50) return 'normal'
    if (stress < 70) return 'elevated'
    return 'high'
  }

  getSleepQuality() {
    const quality = this.sensorData.sleep_quality || 0

    if (quality < 30) return 'poor'
    if (quality < 60) return 'fair'
    if (quality < 80) return 'good'
    return 'excellent'
  }

  getHealthScore() {
    let score = 0
    let factors = 0

    if (this.sensorData.heart_rate) {
      const hrScore = Math.max(0, 100 - Math.abs(this.sensorData.heart_rate - 70) / 2)
      score += hrScore
      factors++
    }

    if (this.sensorData.steps) {
      const stepsScore = Math.min(100, (this.sensorData.steps / 10000) * 100)
      score += stepsScore
      factors++
    }

    if (this.sensorData.spo2) {
      const spo2Score = Math.max(0, (this.sensorData.spo2 - 90) * 10)
      score += spo2Score
      factors++
    }

    if (this.sensorData.sleep_duration) {
      const sleepScore = Math.min(100, (this.sensorData.sleep_duration / 480) * 100)
      score += sleepScore
      factors++
    }

    return factors > 0 ? Math.round(score / factors) : 0
  }
}

export default SensorManager
