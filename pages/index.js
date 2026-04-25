import { createWidget, widget, prop, event } from '@zos/ui'
import { px } from '@zos/utils'
import { getStorage } from '@zos/storage'
import { RuleEngine } from '../utils/rule-engine'
import { SensorManager } from '../utils/sensor-manager'

const storage = getStorage()
let ruleEngine
let sensorManager

Page({
  build() {
    const { width, height } = hmUI.getWindowInfo()
    
    ruleEngine = new RuleEngine()
    sensorManager = new SensorManager()

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(20),
      w: px(width),
      h: px(60),
      text: 'AutoRoutine',
      font: {
        color: 0xffffff,
        size: px(36),
        align: hmUI.align.CENTER_H
      }
    })

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(80),
      w: px(width),
      h: px(30),
      text: 'Smart Automation Engine',
      font: {
        color: 0xaaaaaa,
        size: px(14),
        align: hmUI.align.CENTER_H
      }
    })

    const stats = ruleEngine.getStats()
    createWidget(widget.TEXT, {
      x: px(0),
      y: px(130),
      w: px(width),
      h: px(25),
      text: `${stats.enabledRules} of ${stats.totalRules} routines active`,
      font: {
        color: 0x00ff00,
        size: px(16),
        align: hmUI.align.CENTER_H
      }
    })

    const healthScore = sensorManager.getHealthScore()
    createWidget(widget.TEXT, {
      x: px(0),
      y: px(165),
      w: px(width),
      h: px(25),
      text: `Health Score: ${healthScore}`,
      font: {
        color: 0xffaa00,
        size: px(14),
        align: hmUI.align.CENTER_H
      }
    })

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(210),
      w: px(width),
      h: px(20),
      text: 'Routines',
      font: {
        color: 0xffffff,
        size: px(16),
        align: hmUI.align.CENTER_H
      }
    })

    const routineList = createWidget(widget.LIST, {
      x: px(0),
      y: px(240),
      w: px(width),
      h: px(height - 280),
      item_height: px(60),
      item_click_func: (index) => {
        const rule = ruleEngine.getRules()[index]
        if (rule) {
          hmRouter.push({
            path: 'pages/routine-detail',
            params: { ruleId: rule.id }
          })
        }
      },
      data_array: ruleEngine.getRules().map(rule => ({
        id: rule.id,
        name: rule.name,
        enabled: rule.enabled
      })),
      data_type_config: [
        {
          type: 'long_text',
          key: 'name',
          text_size: px(14),
          text_color: 0xffffff,
          margin_left: px(10),
          margin_top: px(8)
        },
        {
          type: 'text',
          key: 'enabled',
          text_size: px(12),
          text_color: 0x00ff00,
          margin_left: px(10),
          margin_top: px(28)
        }
      ]
    })

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(height - 40),
      w: px(width - 20),
      h: px(35),
      text: 'Add Routine',
      normal_color: 0x0066ff,
      press_color: 0x0044cc,
      text_size: px(14),
      click_func: () => {
        hmRouter.push({
          path: 'pages/rule-editor',
          params: { mode: 'create' }
        })
      }
    })

    this.startRuleEngine()
  },

  startRuleEngine() {
    setInterval(() => {
      const sensorData = sensorManager.updateAllSensors()
      if (Object.keys(sensorData).length > 0) {
        ruleEngine.updateContext(sensorData)
      }

      const triggered = ruleEngine.evaluateAllRules({
        onNotification: (title, message) => {
          hmUI.showToast({
            text: `${title}: ${message}`,
            duration: 3000
          })
        },
        onVibrate: (pattern) => {
          hmUI.vibrate(pattern)
        }
      })

      if (triggered.length > 0) {
        console.log('Triggered routines:', triggered)
      }
    }, 5000)
  }
})
