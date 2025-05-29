# Noita Wand Visualizer

A visualization tool for the Noita wand crafting system that allows users to build wands, simulate their behavior, and visualize the spell casting sequence with modifier applications.

## Features

### ✅ **Implemented**
- **Core Wand Engine** - Full implementation of Noita's deck/hand/discard mechanics
- **Drag & Drop Wand Editor** - Build wands by dragging spells from library to slots
- **Spell Reordering** - Drag spells within the wand to rearrange casting sequence
- **Real-time Simulation** - Cast wands and see detailed results with modifier stacking
- **Spell Database** - Representative sample of all spell types (projectiles, modifiers, multicasts, triggers)
- **Interactive UI** - Visual feedback, hover tooltips, and responsive design

### 🔧 **Current Spell Types**
- **Projectiles**: Spark Bolt, Magic Arrow, Fireball
- **Modifiers**: Damage Plus, Speed Up, Heavy Shot, Add Mana
- **Multicasts**: Double Cast, Triple Cast, Quad Cast
- **Triggers**: Spark Bolt with Trigger, Magic Arrow with Trigger
- **Utilities**: Chainsaw, Teleport, Shield

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building
```bash
npm run build
```

## Usage

1. **Build a Wand**: Drag spells from the library (right panel) to wand slots (left panel)
2. **Reorder Spells**: Drag spells within the wand to change casting sequence  
3. **Cast & Simulate**: Click "Cast Wand" to see the spell execution with detailed results
4. **Experiment**: Try different spell combinations to understand Noita's mechanics

### Example Builds to Try
- **Basic Modifier Chain**: `[Damage Plus] → [Spark Bolt]`
- **Multicast**: `[Triple Cast] → [Spark Bolt] → [Spark Bolt] → [Spark Bolt]`
- **Complex Build**: `[Damage Plus] → [Double Cast] → [Heavy Shot] → [Magic Arrow] → [Speed Up] → [Fireball]`

## Architecture

### Core Components
- **WandEngine** (`src/core/WandEngine.ts`) - Implements Noita's casting mechanics
- **Spell Database** (`src/data/spells.ts`) - Defines all available spells
- **Wand Editor** (`src/components/WandEditor.tsx`) - Main UI component
- **Drag & Drop System** - Built with react-dnd for intuitive spell management

### Key Features
- **Accurate Mechanics** - Faithful implementation of Noita's deck/hand/discard system
- **Modifier Stacking** - Proper left-to-right modifier accumulation
- **Multicast Support** - Handles simultaneous spell casting
- **Trigger Payloads** - Supports nested spell sequences
- **Real-time Updates** - Live mana regeneration and timer management

## Roadmap

### Phase 2: Visualization
- [ ] Cast sequence timeline view
- [ ] Modifier flow visualization  
- [ ] Deck/hand/discard display
- [ ] Multicast grouping indicators

### Phase 3: Advanced Features
- [ ] Trigger payload nesting visualization
- [ ] DPS calculations
- [ ] Save/load wand configurations
- [ ] Wand comparison tools

### Phase 4: Polish
- [ ] Extended spell database
- [ ] Advanced animations
- [ ] Mobile optimization
- [ ] Performance improvements

## Contributing

This project implements the Noita wand system as specified in:
- `app-spec.md` - UI/UX requirements
- `wand-spec.md` - Core mechanics implementation

## License

MIT License - see LICENSE file for details.

---

Built with React, TypeScript, and Vite. Inspired by the amazing game Noita by Nolla Games.