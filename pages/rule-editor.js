import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { RuleEngine } from '../utils/rule-engine'

let ruleEngine
let currentRule = {
  name: 'New Routine',
  enabled: true,
  triggers: [{ type: 'time', value: '08:00' }],
  conditions: [],
  actions: [{ type: 'notification', title: 'Reminder', message: 'Time to act' }],
  cooldown: 1800
}

Page({
  build() {
    const { width, height } = hmUI.getWindowInfo()
    const params = hmRouter.getParams()
    const mode = params?.mode || 'create'
    const ruleId = params?.ruleId

    ruleEngine = new RuleEngine()

    if (mode === 'edit' && ruleId) {
      const rule = ruleEngine.getRule(ruleId)
      if (rule) {
        currentRule = JSON.parse(JSON.stringify(rule))
      }
    }

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(10),
      w: px(width),
      h: px(30),
      text: mode === 'create' ? 'New Routine' : 'Edit Routine',
      font: {
        color: 0xffffff,
        size: px(20),
        align: hmUI.align.CENTER_H
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(50),
      w: px(width - 20),
      h: px(20),
      text: 'Name:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    const nameInput = createWidget(widget.TEXT_INPUT, {
      x: px(10),
      y: px(75),
      w: px(width - 20),
      h: px(35),
      text: currentRule.name,
      font: {
        color: 0xffffff,
        size: px(14)
      },
      input_type: hmUI.input_type.SINGLE_LINE,
      on_complete: (value) => {
        currentRule.name = value
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(120),
      w: px(width - 20),
      h: px(20),
      text: 'Trigger Type:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    const triggerTypes = ['time', 'activity', 'sensor']
    let selectedTriggerType = currentRule.triggers[0]?.type || 'time'

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(145),
      w: px(width - 20),
      h: px(30),
      text: `Type: ${selectedTriggerType}`,
      normal_color: 0x0066ff,
      press_color: 0x0044cc,
      text_size: px(12),
      click_func: () => {
        hmUI.showDialog({
          title: 'Select Trigger Type',
          buttons: triggerTypes.map(t => ({
            text: t,
            click: () => {
              selectedTriggerType = t
              currentRule.triggers[0].type = t
            }
          }))
        })
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(185),
      w: px(width - 20),
      h: px(20),
      text: 'Trigger Time (HH:MM):',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    const timeInput = createWidget(widget.TEXT_INPUT, {
      x: px(10),
      y: px(210),
      w: px(width - 20),
      h: px(35),
      text: currentRule.triggers[0]?.value || '08:00',
      font: {
        color: 0xffffff,
        size: px(14)
      },
      input_type: hmUI.input_type.SINGLE_LINE,
      on_complete: (value) => {
        if (currentRule.triggers[0]) {
          currentRule.triggers[0].value = value
        }
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(255),
      w: px(width - 20),
      h: px(20),
      text: 'Action Type:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    const actionTypes = ['notification', 'vibrate', 'alarm', 'custom']
    let selectedActionType = currentRule.actions[0]?.type || 'notification'

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(280),
      w: px(width - 20),
      h: px(30),
      text: `Action: ${selectedActionType}`,
      normal_color: 0x00aa00,
      press_color: 0x008800,
      text_size: px(12),
      click_func: () => {
        hmUI.showDialog({
          title: 'Select Action Type',
          buttons: actionTypes.map(t => ({
            text: t,
            click: () => {
              selectedActionType = t
              if (currentRule.actions[0]) {
                currentRule.actions[0].type = t
              }
            }
          }))
        })
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(320),
      w: px(width - 20),
      h: px(20),
      text: 'Cooldown (seconds):',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    const cooldownInput = createWidget(widget.TEXT_INPUT, {
      x: px(10),
      y: px(345),
      w: px(width - 20),
      h: px(35),
      text: String(currentRule.cooldown),
      font: {
        color: 0xffffff,
        size: px(14)
      },
      input_type: hmUI.input_type.NUMBER,
      on_complete: (value) => {
        currentRule.cooldown = parseInt(value) || 1800
      }
    })

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(height - 50),
      w: px(width - 20),
      h: px(35),
      text: 'Save Routine',
      normal_color: 0x00ff00,
      press_color: 0x00cc00,
      text_size: px(14),
      click_func: () => {
        if (mode === 'create') {
          ruleEngine.addRule(currentRule)
        } else if (ruleId) {
          ruleEngine.updateRule(ruleId, currentRule)
        }
        hmRouter.back()
      }
    })
  }
})
