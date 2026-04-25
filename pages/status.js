import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { RuleEngine } from '../utils/rule-engine'
import { SensorManager } from '../utils/sensor-manager'

let ruleEngine
let sensorManager

Page({
  build() {
    const { width, height } = hmUI.getWindowInfo()

    ruleEngine = new RuleEngine()
    sensorManager = new SensorManager()

    sensorManager.updateAllSensors()

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(10),
      w: px(width),
      h: px(30),
      text: 'System Status',
      font: {
        color: 0xffffff,
        size: px(20),
        align: hmUI.align.CENTER_H
      }
    })

    const stats = ruleEngine.getStats()
    const healthScore = sensorManager.getHealthScore()
    const sensorData = sensorManager.getSensorData()

    let yPos = 50

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(yPos),
      w: px(width - 20),
      h: px(20),
      text: `Total Routines: ${stats.totalRules}`,
      font: {
        color: 0xffffff,
        size: px(14)
      }
    })
    yPos += 25

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(yPos),
      w: px(width - 20),
      h: px(20),
      text: `Enabled: ${stats.enabledRules}`,
      font: {
        color: 0x00ff00,
        size: px(14)
      }
    })
    yPos += 25

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(yPos),
      w: px(width - 20),
      h: px(20),
      text: `Triggered Today: ${stats.triggeredToday}`,
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })
    yPos += 30

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(yPos),
      w: px(width - 20),
      h: px(20),
      text: 'Health Metrics:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })
    yPos += 25

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(yPos),
      w: px(width - 20),
      h: px(20),
      text: `Health Score: ${healthScore}`,
      font: {
        color: 0xff6600,
        size: px(14)
      }
    })
    yPos += 25

    if (sensorData.heart_rate !== undefined) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(yPos),
        w: px(width - 20),
        h: px(20),
        text: `Heart Rate: ${sensorData.heart_rate} bpm (${sensorManager.getHeartRateZone()})`,
        font: {
          color: 0xffffff,
          size: px(12)
        }
      })
      yPos += 25
    }

    if (sensorData.steps !== undefined) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(yPos),
        w: px(width - 20),
        h: px(20),
        text: `Steps: ${sensorData.steps} (${sensorManager.getActivityLevel()})`,
        font: {
          color: 0xffffff,
          size: px(12)
        }
      })
      yPos += 25
    }

    if (sensorData.spo2 !== undefined) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(yPos),
        w: px(width - 20),
        h: px(20),
        text: `SpO2: ${sensorData.spo2}%`,
        font: {
          color: 0xffffff,
          size: px(12)
        }
      })
      yPos += 25
    }

    if (sensorData.stress !== undefined) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(yPos),
        w: px(width - 20),
        h: px(20),
        text: `Stress: ${sensorData.stress} (${sensorManager.getStressLevel()})`,
        font: {
          color: 0xffffff,
          size: px(12)
        }
      })
      yPos += 25
    }

    if (sensorData.sleep_duration !== undefined) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(yPos),
        w: px(width - 20),
        h: px(20),
        text: `Sleep: ${Math.round(sensorData.sleep_duration / 60)}h (${sensorManager.getSleepQuality()})`,
        font: {
          color: 0xffffff,
          size: px(12)
        }
      })
      yPos += 25
    }

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(height - 50),
      w: px(width - 20),
      h: px(35),
      text: 'Refresh',
      normal_color: 0x0066ff,
      press_color: 0x0044cc,
      text_size: px(14),
      click_func: () => {
        hmRouter.replace({
          path: 'pages/status'
        })
      }
    })
  }
})
