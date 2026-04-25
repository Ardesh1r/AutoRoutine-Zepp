# AutoRoutine Architecture & Design

## System Overview

AutoRoutine is a lightweight rule engine for Zepp OS that evaluates conditions and executes actions based on sensor data and time-based triggers. The architecture prioritizes offline operation, minimal battery impact, and extensibility.

```
┌─────────────────────────────────────────────────────────────┐
│                    AutoRoutine System                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   UI Layer   │      │   Pages      │                   │
│  │              │      │              │                   │
│  │ • index      │      │ • Routines   │                   │
│  │ • detail     │      │ • Editor     │                   │
│  │ • editor     │      │ • Status     │                   │
│  │ • status     │      │              │                   │
│  └──────┬───────┘      └──────┬───────┘                   │
│         │                     │                            │
│         └─────────┬───────────┘                            │
│                   │                                        │
│         ┌─────────▼────────────┐                          │
│         │   Storage Layer      │                          │
│         │  (Local Persistence) │                          │
│         └─────────┬────────────┘                          │
│                   │                                        │
│  ┌────────────────┴──────────────────┐                    │
│  │                                   │                    │
│  ▼                                   ▼                    │
│ ┌──────────────────┐      ┌──────────────────┐           │
│ │  Rule Engine     │      │ Sensor Manager   │           │
│ │                  │      │                  │           │
│ │ • Evaluation     │      │ • Heart Rate     │           │
│ │ • Execution      │      │ • Steps          │           │
│ │ • Cooldown       │      │ • Sleep          │           │
│ │ • Context Mgmt   │      │ • SpO2           │           │
│ │                  │      │ • Stress         │           │
│ │                  │      │ • Activity       │           │
│ └────────┬─────────┘      └────────┬─────────┘           │
│          │                         │                     │
│          └────────────┬────────────┘                     │
│                       │                                  │
│          ┌────────────▼────────────┐                    │
│          │  Action Executors       │                    │
│          │                         │                    │
│          │ • Notification          │                    │
│          │ • Vibration             │                    │
│          │ • Alarm                 │                    │
│          │ • Custom                │                    │
│          └─────────────────────────┘                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Rule Engine (`utils/rule-engine.js`)

**Responsibility**: Evaluate rules and execute actions

**Key Classes**:
```javascript
class RuleEngine {
  // Rule Management
  loadRules()           // Load from storage
  saveRules()           // Persist to storage
  addRule()             // Create new rule
  updateRule()          // Modify existing rule
  deleteRule()          // Remove rule
  toggleRule()          // Enable/disable rule

  // Evaluation
  evaluateTrigger()     // Check if trigger matches
  evaluateCondition()   // Check if condition passes
  evaluateRule()        // Full rule evaluation
  evaluateAllRules()    // Batch evaluation

  // Execution
  executeRule()         // Run rule actions
  executeAction()       // Execute single action

  // Context
  updateContext()       // Update sensor data
  compareValue()        // Compare values with operators

  // Utilities
  getRules()            // Get all rules
  getRule()             // Get specific rule
  getStats()            // Get statistics
}
```

**Data Flow**:
```
Rule Definition
    ↓
Trigger Evaluation (time, activity)
    ↓
Condition Evaluation (sensor thresholds)
    ↓
Cooldown Check (prevent spam)
    ↓
Action Execution (notification, vibrate, etc.)
    ↓
Update Last Executed Time
```

### 2. Sensor Manager (`utils/sensor-manager.js`)

**Responsibility**: Collect and analyze sensor data

**Key Classes**:
```javascript
class SensorManager {
  // Sensor Updates
  updateHeartRate()     // Get current HR
  updateSteps()         // Get daily steps
  updateSleep()         // Get last night's sleep
  updateSpO2()          // Get blood oxygen
  updateStress()        // Get stress level
  updateActivity()      // Get activity metrics
  updateAllSensors()    // Batch update

  // Analysis
  getHeartRateZone()    // Classify HR (rest, light, etc.)
  getActivityLevel()    // Classify activity
  getStressLevel()      // Classify stress
  getSleepQuality()     // Classify sleep
  getHealthScore()      // Composite health metric

  // Data Access
  getSensorData()       // Get all sensor data
  getSensorValue()      // Get specific sensor
}
```

**Update Strategy**:
```
Sensor          Update Interval    Use Case
────────────────────────────────────────────
Heart Rate      60 seconds         Real-time monitoring
Steps           5 minutes          Daily tracking
Sleep           1 hour             Overnight analysis
SpO2            5 minutes          Health monitoring
Stress          10 minutes         Wellness tracking
Activity        1 minute           Immediate response
```

**Health Score Calculation**:
```
Score = (HR_score + Steps_score + SpO2_score + Sleep_score) / 4

Where:
  HR_score = 100 - |current_HR - 70| / 2
  Steps_score = min(100, (steps / 10000) * 100)
  SpO2_score = max(0, (spo2 - 90) * 10)
  Sleep_score = min(100, (sleep_minutes / 480) * 100)
```

### 3. UI Layer (`pages/`)

**Components**:

#### index.js - Main Dashboard
- Display routine statistics
- List all routines with status
- Quick access to routine details
- Add new routine button
- Health score display

#### routine-detail.js - Routine View
- Display full routine configuration
- Show triggers, conditions, actions
- Enable/disable toggle
- Edit routine button
- Delete routine button

#### rule-editor.js - Rule Creator
- Create new routines
- Edit existing routines
- Configure triggers (time, activity)
- Set conditions (sensor thresholds)
- Define actions (notification, vibrate)
- Set cooldown period

#### status.js - System Status
- Real-time health metrics
- Sensor readings
- Routine statistics
- Activity classification
- Sleep quality assessment

## Data Structures

### Rule Object
```javascript
{
  id: string,                    // Unique identifier
  name: string,                  // Display name
  enabled: boolean,              // Active status
  triggers: Trigger[],           // When to execute
  conditions: Condition[],       // Must be true to execute
  actions: Action[],             // What to do
  cooldown: number               // Seconds between executions
}
```

### Trigger Object
```javascript
{
  type: 'time' | 'activity',
  value: string | number,        // Time (HH:MM) or metric value
  days?: number[],               // Optional: 0-6 (Sun-Sat)
  operator?: string,             // For activity triggers
  metric?: string                // For activity triggers
}
```

### Condition Object
```javascript
{
  type: string,                  // Sensor type (heart_rate, steps, etc.)
  operator: string,              // eq, neq, gt, gte, lt, lte, in
  value: number | number[]       // Threshold value(s)
}
```

### Action Object
```javascript
{
  type: 'notification' | 'vibrate' | 'alarm' | 'custom',
  title?: string,                // For notifications
  message?: string,              // For notifications
  pattern?: number[],            // For vibration (ms on/off)
  time?: string,                 // For alarms
  label?: string,                // For alarms
  name?: string,                 // For custom actions
  data?: object                  // For custom actions
}
```

## Execution Flow

### Rule Evaluation Cycle
```
1. Every 5 seconds:
   ├─ Update all sensors (with adaptive intervals)
   ├─ Update rule engine context
   ├─ For each enabled rule:
   │  ├─ Evaluate triggers
   │  ├─ If triggered:
   │  │  ├─ Evaluate conditions
   │  │  ├─ If conditions pass:
   │  │  │  ├─ Check cooldown
   │  │  │  ├─ If cooldown passed:
   │  │  │  │  ├─ Execute actions
   │  │  │  │  └─ Update last executed time
   │  │  │  └─ If cooldown not passed: skip
   │  │  └─ If conditions fail: skip
   │  └─ If triggers don't match: skip
   └─ Continue to next rule
```

### Trigger Evaluation
```
Time Trigger:
  ├─ Get current time (HH:MM)
  ├─ Compare with trigger time
  ├─ If days specified:
  │  ├─ Get current day of week
  │  └─ Check if in allowed days
  └─ Return match result

Activity Trigger:
  ├─ Get sensor value from context
  ├─ Compare with operator and value
  └─ Return match result
```

### Condition Evaluation
```
For each condition:
  ├─ Get sensor value from context
  ├─ If value undefined: return true (pass)
  ├─ Compare value with operator and expected
  └─ Return comparison result

All conditions must pass (AND logic)
```

## Storage Architecture

### Local Storage Layout
```
Zepp OS Storage
├── rules (JSON string)
│   └── Array of rule objects
├── last_executed (JSON string)
│   └── Map of rule_id -> timestamp
└── app_state (JSON string)
    └── UI state, preferences
```

### Persistence Strategy
- Rules saved immediately after modification
- Last executed times updated in memory
- Automatic recovery on app restart
- ~50KB available for rule storage (~100 rules max)

## Performance Optimization

### CPU Optimization
- 5-second evaluation interval (not per-second)
- Lazy sensor updates (adaptive intervals)
- Efficient comparison operators
- Early exit on trigger/condition failure

### Memory Optimization
- Rules stored as JSON (compact)
- Context object reused
- No large data structures
- Garbage collection friendly

### Battery Optimization
- Minimal sensor polling
- Adaptive update intervals
- No continuous monitoring
- Efficient action execution

### Storage Optimization
- JSON compression
- Efficient rule serialization
- Cleanup of old data
- Configurable retention

## Extensibility Points

### Adding New Trigger Types
1. Implement in `RuleEngine.evaluateTrigger()`
2. Add UI in `rule-editor.js`
3. Update documentation

### Adding New Sensors
1. Implement in `SensorManager`
2. Add to `updateAllSensors()`
3. Update health score if relevant

### Adding New Actions
1. Implement in `RuleEngine.executeAction()`
2. Add UI in `rule-editor.js`
3. Add callback handler

### Adding New Conditions
1. Add sensor type to `SensorManager`
2. Use in condition evaluation
3. Update documentation

## Error Handling

### Graceful Degradation
- Missing sensors: skip condition
- Storage errors: use defaults
- Invalid rules: skip execution
- Permission errors: log and continue

### Logging
- Rule evaluation results
- Sensor update status
- Action execution status
- Error conditions

## Testing Strategy

### Unit Tests
- Rule evaluation logic
- Condition comparison
- Sensor data processing
- Health score calculation

### Integration Tests
- Full rule execution
- Sensor integration
- Storage persistence
- UI interactions

### Device Tests
- Real sensor data
- Actual notification delivery
- Vibration patterns
- Battery impact

## Security Considerations

### Data Privacy
- All data stored locally
- No cloud transmission
- No personal data collection
- GDPR compliant

### Input Validation
- Rule structure validation
- Sensor value bounds checking
- Time format validation
- Operator validation

### Resource Protection
- Cooldown prevents spam
- Storage limits enforced
- CPU usage controlled
- Memory usage bounded

---

**Architecture Version**: 1.0
**Last Updated**: April 2026
**Status**: Production Ready
