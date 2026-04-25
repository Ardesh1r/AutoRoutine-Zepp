import { getTime } from '@zos/sensor'
import { getStorage } from '@zos/storage'

const storage = getStorage()

export class RuleEngine {
  constructor() {
    this.rules = this.loadRules()
    this.context = {}
    this.lastExecuted = {}
  }

  loadRules() {
    try {
      const rulesData = storage.getItem('rules')
      return rulesData ? JSON.parse(rulesData) : this.getDefaultRules()
    } catch (e) {
      console.error('Failed to load rules:', e)
      return this.getDefaultRules()
    }
  }

  saveRules(rules) {
    try {
      storage.setItem('rules', JSON.stringify(rules))
      this.rules = rules
    } catch (e) {
      console.error('Failed to save rules:', e)
    }
  }

  getDefaultRules() {
    return [
      {
        id: 'morning-routine',
        name: 'Morning Routine',
        enabled: true,
        triggers: [
          {
            type: 'time',
            value: '06:00',
            days: [1, 2, 3, 4, 5]
          }
        ],
        conditions: [
          {
            type: 'sleep_duration',
            operator: 'gte',
            value: 360
          }
        ],
        actions: [
          {
            type: 'notification',
            title: 'Good Morning!',
            message: 'Time to start your day'
          },
          {
            type: 'vibrate',
            pattern: [100, 50, 100]
          }
        ],
        cooldown: 3600
      },
      {
        id: 'activity-reminder',
        name: 'Activity Reminder',
        enabled: true,
        triggers: [
          {
            type: 'time',
            value: '12:00'
          }
        ],
        conditions: [
          {
            type: 'steps',
            operator: 'lt',
            value: 5000
          }
        ],
        actions: [
          {
            type: 'notification',
            title: 'Move Time!',
            message: 'You need more steps today'
          }
        ],
        cooldown: 1800
      },
      {
        id: 'evening-wind-down',
        name: 'Evening Wind Down',
        enabled: true,
        triggers: [
          {
            type: 'time',
            value: '21:00'
          }
        ],
        conditions: [],
        actions: [
          {
            type: 'notification',
            title: 'Wind Down Time',
            message: 'Prepare for sleep'
          },
          {
            type: 'vibrate',
            pattern: [50, 100, 50]
          }
        ],
        cooldown: 3600
      }
    ]
  }

  updateContext(sensorData) {
    this.context = {
      ...this.context,
      ...sensorData,
      timestamp: getTime().getTime()
    }
  }

  evaluateTrigger(trigger) {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDay = now.getDay()

    if (trigger.type === 'time') {
      const timeMatch = currentTime === trigger.value
      if (!trigger.days) return timeMatch

      const dayMatch = trigger.days.includes(currentDay)
      return timeMatch && dayMatch
    }

    if (trigger.type === 'activity') {
      const activityData = this.context[trigger.metric]
      if (!activityData) return false

      return this.compareValue(activityData, trigger.operator, trigger.value)
    }

    return false
  }

  evaluateCondition(condition) {
    const contextValue = this.context[condition.type]
    if (contextValue === undefined) return true

    return this.compareValue(contextValue, condition.operator, condition.value)
  }

  compareValue(actual, operator, expected) {
    switch (operator) {
      case 'eq':
        return actual === expected
      case 'neq':
        return actual !== expected
      case 'gt':
        return actual > expected
      case 'gte':
        return actual >= expected
      case 'lt':
        return actual < expected
      case 'lte':
        return actual <= expected
      case 'in':
        return Array.isArray(expected) && expected.includes(actual)
      default:
        return false
    }
  }

  evaluateRule(rule) {
    if (!rule.enabled) return null

    const triggersMatch = rule.triggers.some(trigger => this.evaluateTrigger(trigger))
    if (!triggersMatch) return null

    const conditionsPass = rule.conditions.length === 0 || 
                          rule.conditions.every(cond => this.evaluateCondition(cond))
    if (!conditionsPass) return null

    const now = getTime().getTime()
    const lastExecTime = this.lastExecuted[rule.id] || 0
    const cooldownPassed = (now - lastExecTime) >= (rule.cooldown || 0) * 1000

    if (!cooldownPassed) return null

    return rule
  }

  executeRule(rule, callbacks) {
    if (!rule) return

    rule.actions.forEach(action => {
      this.executeAction(action, callbacks)
    })

    this.lastExecuted[rule.id] = getTime().getTime()
  }

  executeAction(action, callbacks) {
    switch (action.type) {
      case 'notification':
        if (callbacks?.onNotification) {
          callbacks.onNotification(action.title, action.message)
        }
        break

      case 'vibrate':
        if (callbacks?.onVibrate) {
          callbacks.onVibrate(action.pattern)
        }
        break

      case 'alarm':
        if (callbacks?.onAlarm) {
          callbacks.onAlarm(action.time, action.label)
        }
        break

      case 'custom':
        if (callbacks?.onCustom) {
          callbacks.onCustom(action.name, action.data)
        }
        break
    }
  }

  evaluateAllRules(callbacks) {
    const triggered = []
    
    for (const rule of this.rules) {
      const matchedRule = this.evaluateRule(rule)
      if (matchedRule) {
        this.executeRule(matchedRule, callbacks)
        triggered.push(matchedRule.id)
      }
    }

    return triggered
  }

  addRule(rule) {
    const newRule = {
      id: `rule-${Date.now()}`,
      enabled: true,
      cooldown: 1800,
      ...rule
    }
    this.rules.push(newRule)
    this.saveRules(this.rules)
    return newRule
  }

  updateRule(ruleId, updates) {
    const index = this.rules.findIndex(r => r.id === ruleId)
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates }
      this.saveRules(this.rules)
    }
  }

  deleteRule(ruleId) {
    this.rules = this.rules.filter(r => r.id !== ruleId)
    this.saveRules(this.rules)
  }

  toggleRule(ruleId) {
    const rule = this.rules.find(r => r.id === ruleId)
    if (rule) {
      rule.enabled = !rule.enabled
      this.saveRules(this.rules)
    }
  }

  getRules() {
    return this.rules
  }

  getRule(ruleId) {
    return this.rules.find(r => r.id === ruleId)
  }

  getStats() {
    return {
      totalRules: this.rules.length,
      enabledRules: this.rules.filter(r => r.enabled).length,
      triggeredToday: Object.keys(this.lastExecuted).length
    }
  }
}

export default RuleEngine
