import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { RuleEngine } from '../utils/rule-engine'

let ruleEngine

Page({
  build() {
    const { width, height } = hmUI.getWindowInfo()
    const ruleId = hmRouter.getParams()?.ruleId

    ruleEngine = new RuleEngine()
    const rule = ruleEngine.getRule(ruleId)

    if (!rule) {
      createWidget(widget.TEXT, {
        x: px(0),
        y: px(height / 2 - 30),
        w: px(width),
        h: px(60),
        text: 'Routine not found',
        font: {
          color: 0xff0000,
          size: px(16),
          align: hmUI.align.CENTER_H
        }
      })
      return
    }

    createWidget(widget.TEXT, {
      x: px(0),
      y: px(10),
      w: px(width),
      h: px(40),
      text: rule.name,
      font: {
        color: 0xffffff,
        size: px(24),
        align: hmUI.align.CENTER_H
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(60),
      w: px(width - 20),
      h: px(20),
      text: `Status: ${rule.enabled ? 'Enabled' : 'Disabled'}`,
      font: {
        color: rule.enabled ? 0x00ff00 : 0xff6600,
        size: px(14)
      }
    })

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(90),
      w: px(width - 20),
      h: px(20),
      text: 'Triggers:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })

    let triggerY = 115
    rule.triggers.forEach((trigger, idx) => {
      const triggerText = trigger.type === 'time' 
        ? `${trigger.value} (${trigger.days ? trigger.days.join(', ') : 'Daily'})`
        : `${trigger.type}: ${trigger.operator} ${trigger.value}`

      createWidget(widget.TEXT, {
        x: px(20),
        y: px(triggerY),
        w: px(width - 40),
        h: px(20),
        text: `• ${triggerText}`,
        font: {
          color: 0xcccccc,
          size: px(12)
        }
      })
      triggerY += 25
    })

    if (rule.conditions.length > 0) {
      createWidget(widget.TEXT, {
        x: px(10),
        y: px(triggerY),
        w: px(width - 20),
        h: px(20),
        text: 'Conditions:',
        font: {
          color: 0xffaa00,
          size: px(14)
        }
      })
      triggerY += 25

      rule.conditions.forEach((cond) => {
        createWidget(widget.TEXT, {
          x: px(20),
          y: px(triggerY),
          w: px(width - 40),
          h: px(20),
          text: `• ${cond.type} ${cond.operator} ${cond.value}`,
          font: {
            color: 0xcccccc,
            size: px(12)
          }
        })
        triggerY += 25
      })
    }

    createWidget(widget.TEXT, {
      x: px(10),
      y: px(triggerY),
      w: px(width - 20),
      h: px(20),
      text: 'Actions:',
      font: {
        color: 0xffaa00,
        size: px(14)
      }
    })
    triggerY += 25

    rule.actions.forEach((action) => {
      const actionText = action.type === 'notification'
        ? `${action.title}: ${action.message}`
        : action.type === 'vibrate'
        ? `Vibrate: ${action.pattern.join(',')}`
        : action.type

      createWidget(widget.TEXT, {
        x: px(20),
        y: px(triggerY),
        w: px(width - 40),
        h: px(20),
        text: `• ${actionText}`,
        font: {
          color: 0xcccccc,
          size: px(12)
        }
      })
      triggerY += 25
    })

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(height - 100),
      w: px((width - 30) / 2),
      h: px(35),
      text: rule.enabled ? 'Disable' : 'Enable',
      normal_color: rule.enabled ? 0xff6600 : 0x00ff00,
      press_color: rule.enabled ? 0xcc5500 : 0x00cc00,
      text_size: px(12),
      click_func: () => {
        ruleEngine.toggleRule(ruleId)
        hmRouter.back()
      }
    })

    createWidget(widget.BUTTON, {
      x: px(width / 2 + 5),
      y: px(height - 100),
      w: px((width - 30) / 2),
      h: px(35),
      text: 'Edit',
      normal_color: 0x0066ff,
      press_color: 0x0044cc,
      text_size: px(12),
      click_func: () => {
        hmRouter.push({
          path: 'pages/rule-editor',
          params: { mode: 'edit', ruleId: ruleId }
        })
      }
    })

    createWidget(widget.BUTTON, {
      x: px(10),
      y: px(height - 55),
      w: px(width - 20),
      h: px(35),
      text: 'Delete',
      normal_color: 0xff0000,
      press_color: 0xcc0000,
      text_size: px(12),
      click_func: () => {
        ruleEngine.deleteRule(ruleId)
        hmRouter.back()
      }
    })
  }
})
