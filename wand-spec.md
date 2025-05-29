# Noita Wand System Specification

## Overview

The Noita wand system is a complex spell-casting mechanic that functions like a programmable card game. Wands contain spells that are executed in sequence, with various modifiers and multicast effects creating intricate spell combinations.

## Core Concepts

### 1. Wand Properties

Each wand has the following base statistics:

- **Shuffle** (boolean): If true, randomizes spell order before each cast sequence
- **Spells/Cast** (integer): Number of spells drawn per mouse click
- **Cast Delay** (float, seconds): Time between consecutive spell casts within a sequence
- **Recharge Time** (float, seconds): Time to refresh the spell list after all spells are cast
- **Mana Max** (integer): Maximum mana capacity
- **Mana Charge Speed** (float): Rate of mana regeneration per second
- **Capacity** (integer): Maximum number of spell slots
- **Spread** (float, degrees): Projectile spread angle (-values reduce spread)
- **Always Cast** (spell, optional): Spell automatically added to every casting block

### 2. Spell Types

#### Projectile Spells
- Basic spells that create projectiles (e.g., Spark Bolt, Magic Arrow)
- Have their own mana cost, damage, and cast delay modifiers
- Can be modified by spell modifiers

#### Modifier Spells
- Apply effects to the next spell in the sequence
- Stack from left to right until they reach a projectile
- Examples: Damage Plus, Speed Up, Fire Trail

#### Multicast Spells
- Cast multiple subsequent spells simultaneously
- Types: Double Cast, Triple Cast, etc.
- Can "wrap" around the end of the spell list

#### Trigger/Timer Spells
- Projectiles that cast additional spells on impact (Trigger) or after time (Timer)
- Create embedded spell sequences (payloads)
- Bypass normal cast delay for payload spells

#### Passive Spells
- Add effects without being "cast" (e.g., Torch, Reduce Recharge Time)
- Count as one "draw" for wrapping purposes

#### Material Spells
- Create liquids or other materials
- Examples: Water, Oil, Acid

#### Utility Spells
- Special effects like teleportation, shields, etc.

### 3. Core Mechanics

#### The Draw System (Card Game Mechanics)

The wand system uses three conceptual "piles":

1. **Deck**: Contains all available spells in order (or shuffled)
2. **Hand**: Spells currently being cast
3. **Discard**: Spells that have been cast or skipped

#### Casting Process

1. **Draw Phase**: 
   - Draw spells equal to Spells/Cast from Deck to Hand
   - Modifiers draw additional spells (1 for basic modifiers, N for multicasts)
   - If spell has no mana/charges, skip to Discard

2. **Execution Phase**:
   - Execute spells in Hand
   - Apply modifiers to subsequent spells
   - Handle multicasts and triggers

3. **Cleanup Phase**:
   - Move all Hand spells to Discard
   - Apply Cast Delay
   - If Deck is empty, apply Recharge Time and reset

#### Casting Blocks

A "Casting Block" is a set of spells executed together in one cast operation. This includes:
- The initial spell(s) drawn by Spells/Cast
- Any additional spells drawn by modifiers/multicasts
- All modifiers affecting those spells

### 4. Advanced Mechanics

#### Wrapping
- When multicasts/modifiers at the end of a wand need more spells
- Can draw from the beginning of the spell list
- Only works if there are spells remaining in the Deck

#### Always Cast
- Automatically added to every casting block
- Applies its statistics (mana cost, delays) to the wand
- Cannot add positive mana drain

#### Trigger/Timer Payloads
- Spells inside trigger/timer payloads ignore wand's cast delay
- Create separate embedded casting sequences
- Can contain modifiers and multicasts

#### Mana Mechanics
- Each spell costs mana
- Modifiers can affect mana cost (e.g., Add Mana: -30)
- If insufficient mana, spell is skipped
- Negative mana costs restore mana

#### Cast Delay Reduction
- Chainsaw spell: -0.17s cast delay
- Placing Chainsaw as last spell in every cast removes all cast delay
- Other spells can have negative cast delay modifiers

## Implementation Requirements

### 1. Data Structures

```
Wand:
  - properties: WandStats
  - spells: Array<Spell>
  - deck: Array<Spell>
  - hand: Array<Spell>
  - discard: Array<Spell>
  - currentMana: number

WandStats:
  - shuffle: boolean
  - spellsPerCast: number
  - castDelay: number
  - rechargeTime: number
  - manaMax: number
  - manaChargeSpeed: number
  - capacity: number
  - spread: number
  - alwaysCast: Spell (optional)

Spell:
  - id: string
  - name: string
  - type: SpellType
  - manaCost: number
  - castDelay: number
  - uses: number (optional, -1 for unlimited)
  - action: Function
  - modifiers: SpellModifiers (optional)

SpellType: 
  - PROJECTILE | MODIFIER | MULTICAST | TRIGGER | TIMER | PASSIVE | MATERIAL | UTILITY

SpellModifiers:
  - damage: number
  - speed: number
  - spread: number
  - criticalChance: number
  - etc.
```

### 2. Core Algorithms

#### Main Casting Loop
1. Check if wand is recharging
2. Initialize cast (shuffle if needed)
3. Draw initial spells (Spells/Cast)
4. Execute all spells in hand
5. Apply cast delay
6. Move hand to discard
7. If deck empty, start recharge

#### Spell Execution
1. Check mana/charges
2. If modifier: draw next spell(s) and apply effects
3. If multicast: draw N spells and execute together
4. If trigger/timer: draw payload spells for embedded cast
5. If projectile: create projectile with accumulated modifiers
6. Apply spell-specific cast delay and mana cost

#### Modifier Stacking
- Modifiers accumulate left-to-right
- Stop at first non-modifier spell
- Apply to all spells in a multicast

### 3. Special Cases

#### Shuffle Wand Behavior
- Randomize deck order before first cast
- Randomize on reload
- Randomize on wrap
- Maintain modifier-spell relationships when possible

#### Wrapping Rules
- Only if spells remain in deck
- Multicast must complete its draw
- Cannot wrap in middle of modifier chain

#### Always Cast Integration
- Add to every casting block
- Apply stats to wand totals
- Execute before manual spells

### 4. Visualization Requirements

For visualization, the system should provide:

1. **Wand State**
   - Current deck/hand/discard contents
   - Mana levels
   - Recharge/delay timers
   - Active modifiers

2. **Casting Sequence**
   - Step-by-step execution flow
   - Modifier application
   - Multicast grouping
   - Trigger payload nesting

3. **Statistics**
   - Effective DPS
   - Mana efficiency
   - Cast patterns
   - Projectile paths

## Example Implementations

### Simple Non-Shuffle Example
```
Wand: [Damage Plus] [Speed Up] [Spark Bolt] [Magic Arrow]
Cast 1: Draw Damage Plus → Draw Speed Up → Draw Spark Bolt
        → Fire Spark Bolt with +damage and +speed
Cast 2: Draw Magic Arrow → Fire Magic Arrow (no modifiers)
Recharge
```

### Multicast Example
```
Wand: [Triple Cast] [Spark Bolt] [Spark Bolt] [Spark Bolt]
Cast: Draw Triple Cast → Draw 3x Spark Bolt
      → Fire all 3 simultaneously
Recharge
```

### Trigger Example
```
Wand: [Spark Bolt Trigger] [Explosion]
Cast: Draw Spark Bolt Trigger → Draw Explosion (as payload)
      → Fire Spark Bolt that explodes on impact
Recharge
```

### Wrapping Example
```
Wand: [Spark Bolt] [Double Cast]
Cast 1: Draw Spark Bolt → Fire Spark Bolt
Cast 2: Draw Double Cast → Draw nothing (deck empty)
        → Wrap to beginning → Draw Spark Bolt
        → Fire Spark Bolt
Recharge
```

## Critical Implementation Notes

1. **Mana System**: Track mana consumption carefully. Spells can have negative mana costs.

2. **Cast Delay**: Applied AFTER first spell, BEFORE subsequent spells in a sequence.

3. **Trigger Payloads**: Completely bypass wand cast delay, using only spell-specific delays.

4. **Modifier Scope**: Modifiers only affect spells to their right in the current casting block.

5. **State Management**: Maintain clear separation between deck/hand/discard for accurate simulation.

6. **Charges**: Limited-use spells need charge tracking. Depleted spells are skipped.

7. **Always Cast**: Must be applied to EVERY casting block, including wrapped casts.

This specification provides the complete framework needed to implement the Noita wand system. The implementation should focus on accurately modeling the draw/cast/discard cycle while handling all the special cases and interactions described above.