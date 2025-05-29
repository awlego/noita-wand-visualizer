# Noita Wand Visualization App Specification

## Overview

A visualization tool for the Noita wand crafting system that allows users to build wands, simulate their behavior, and visualize the spell casting sequence with modifier applications.

## User Interface Components

### 1. Header Bar
- **App Title**: "Noita Wand Simulator" with logo
- **Action Buttons** (right-aligned):
  - Undo: Revert last change
  - Redo: Restore undone change
  - Reset: Clear wand to default state
  - Load: Import wand configuration
  - Export: Save wand configuration
  - Config: App settings

### 2. Wand Editor Panel

#### Wand Statistics Display
Left side column showing:
- **Shuffle**: Checkbox toggle
- **Spells/Cast**: Numeric input (1-25)
- **Cast Delay**: Numeric input with "s" suffix
- **Recharge Time**: Numeric input with "s" suffix
- **Mana Max**: Numeric input
- **Mana Charge Speed**: Numeric input
- **Capacity**: Numeric input (max spell slots)
- **Spread**: Numeric input in degrees
- **Speed**: Multiplier value

#### Spell Slot Grid
- Visual grid matching wand capacity
- Drag-and-drop spell placement
- Empty slots shown as dark placeholders
- Filled slots show spell icons
- Always Cast slot (if present) shown separately

### 3. Spell Library Panel

#### Categories (Tab Bar)
- Projectiles (wand icon)
- Modifiers (sparkle icon)
- Multicast (triple star icon)
- Trigger/Timer (clock icon)
- Materials (droplet icon)
- Utility (gear icon)
- Other (misc icon)

#### Spell Grid
- Icon-based spell selection
- Hover for spell details tooltip
- Drag to wand slots
- Search/filter functionality
- Commonly used spells highlighted

### 4. Cast Configuration Panel

#### Player Stats
- **Health**: Current/Max display
- **Money**: Gold amount

#### Simulation Controls
- **Seed**: Random seed input
- **Frame**: Current simulation frame
- **Requirements**: Shows spell unlock requirements

### 5. Simulation Display Panel

#### Cast Sequence Visualization

**Two View Modes:**

##### Timeline View
```
Cast 1: [Damage+] → [Speed+] → [Spark Bolt] ══► Projectile
        └─ Modifiers Applied: +25 damage, +200 speed

Cast 2: [Triple Cast] → [Arrow] + [Arrow] + [Arrow] ══► 3 Projectiles
        └─ Cast simultaneously

Cast 3: [Spark Bolt Trigger] → [Explosion] ══► Projectile
        └─ Payload: Explosion on impact
```

##### Tree View
```
┌─ Cast Block 1
│  ├─ Damage Plus (modifier)
│  ├─ Speed Up (modifier)
│  └─ Spark Bolt (projectile)
│     └─ Applied: +25 dmg, +200 speed
│
├─ Cast Block 2
│  └─ Triple Cast
│     ├─ Arrow #1
│     ├─ Arrow #2
│     └─ Arrow #3
│
└─ [Recharge 0.5s]
```

#### Simulation Tabs
- **Projectiles**: Shows active projectiles and their properties
- **Actions Called**: Detailed log of spell executions
- **Deck State**: Current deck/hand/discard visualization

### 6. Status Bar
- **Running/Paused/Recharging** status
- Frame counter
- Performance metrics (casts/second)

## Visualization Features

### 1. Cast Sequence Animation

#### Step-by-Step Mode
- Show each draw/cast/discard action
- Highlight current spell being processed
- Show modifier accumulation
- Display mana consumption

#### Real-Time Mode
- Continuous casting simulation
- Visual projectile spawning
- Cast delay and recharge indicators
- Mana bar animation

### 2. Modifier Visualization

#### Modifier Stack Display
```
Current Modifiers:
┌─────────────────┐
│ Damage: +50     │
│ Speed: +400     │
│ Spread: -5°     │
│ Lifetime: +20   │
└─────────────────┘
```

#### Modifier Flow Arrows
- Visual arrows showing modifier application
- Color coding by modifier type
- Stacking indicators for multiple modifiers

### 3. Multicast Grouping

Visual brackets/containers showing:
- Which spells are cast together
- Modifier inheritance
- Simultaneous vs sequential casting

### 4. Trigger/Timer Payloads

Nested visualization showing:
- Main projectile
- Embedded payload spells
- Trigger conditions
- Independent cast sequences

### 5. Deck/Hand/Discard Visualization

#### Card-Style Display
```
┌─────┐ ┌─────┐ ┌─────┐
│Deck │ │Hand │ │Disc.│
├─────┤ ├─────┤ ├─────┤
│ 12  │ │  3  │ │  5  │
└─────┘ └─────┘ └─────┘
```

With expandable views showing actual spell contents.

## Interactive Features

### 1. Drag and Drop
- Spells from library to wand
- Reorder spells within wand
- Copy spells with Ctrl+drag

### 2. Hover Information
- Detailed spell tooltips
- Modifier effect previews
- Cast sequence explanations

### 3. Simulation Controls
- Play/Pause/Step buttons
- Speed control (0.25x to 4x)
- Reset to beginning
- Skip to next cast

### 4. Highlighting System
- Current spell being cast
- Modified spells glow with modifier color
- Recharging wand dimmed
- Insufficient mana spells grayed out

## Advanced Features

### 1. Wand Comparison
- Side-by-side wand analysis
- DPS calculations
- Efficiency metrics
- Cast pattern differences

### 2. Build Optimizer
- Suggest spell arrangements
- Identify cast delay bottlenecks
- Mana efficiency recommendations

### 3. Spell Search
- Filter by properties
- Find synergistic combinations
- Sort by damage/mana/utility

### 4. Save/Load System
- Named wand configurations
- Share codes for builds
- Import from game saves
- Version compatibility

## Visual Design Guidelines

### Color Scheme
- **Background**: Dark (#1a1a1a)
- **Panels**: Darker brown (#2a2318)
- **Borders**: Gold/bronze (#d4a574)
- **Text**: Light tan (#e8d5b7)
- **Spell Slots**: Dark brown (#3a2818)

### Spell Type Colors
- **Projectiles**: Blue
- **Modifiers**: Purple
- **Multicast**: Green
- **Triggers**: Orange
- **Materials**: Cyan
- **Utility**: Yellow
- **Passive**: Gray

### Animation Principles
- Smooth transitions (0.2s default)
- Visual feedback for all interactions
- Particle effects for spell casts
- Subtle glows and pulses

## Technical Requirements

### Performance
- 60 FPS simulation target
- Efficient spell resolution
- Lazy loading for spell icons

### Responsive Design
- Minimum resolution: 1280x720
- Scalable UI elements
- Mobile-friendly touch controls
- Keyboard shortcuts

### Data Format
```json
{
  "wand": {
    "stats": {
      "shuffle": false,
      "spellsPerCast": 1,
      "castDelay": 0.17,
      "rechargeTime": 0.5,
      "manaMax": 200,
      "manaChargeSpeed": 50,
      "capacity": 10,
      "spread": 0
    },
    "spells": [
      {"id": "damage_plus", "position": 0},
      {"id": "spark_bolt", "position": 1}
    ]
  }
}
```

## Implementation Priorities

### Phase 1: Core Functionality
1. Basic wand editor
2. Spell library
3. Simple cast sequence display
4. Drag and drop

### Phase 2: Visualization
1. Modifier flow visualization
2. Animated cast sequence
3. Deck/hand/discard display
4. Multicast grouping

### Phase 3: Advanced Features
1. Trigger payload nesting
2. DPS calculations
3. Save/load system
4. Wand comparison

### Phase 4: Polish
1. Particle effects
2. Sound effects
3. Advanced animations
4. Mobile optimization

This specification provides a complete blueprint for a Noita wand visualization app that helps users understand and optimize their wand builds through clear visual representation of the casting mechanics.