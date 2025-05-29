import { describe, it, expect, beforeEach } from 'vitest'
import { WandEngine } from '../core/WandEngine'
import { SPELLS } from '../data/spells'
import { Wand, SpellType } from '../types'
import { createDefaultWand } from '../utils/wandFactory'

describe('WandEngine Core Mechanics', () => {
  let wand: Wand
  let engine: WandEngine

  beforeEach(() => {
    wand = createDefaultWand()
    // Reset to known state
    wand.stats.shuffle = false
    wand.stats.spellsPerCast = 1
    wand.stats.castDelay = 0.17
    wand.stats.rechargeTime = 0.5
    wand.stats.manaMax = 200
    wand.stats.manaChargeSpeed = 50
    wand.stats.capacity = 10
    wand.stats.spread = 0
  })

  describe('Basic Casting', () => {
    it('should cast a single projectile spell', () => {
      wand.spells = [SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult).toBeDefined()
      expect(castResult!.spells).toHaveLength(1)
      expect(castResult!.spells[0].id).toBe('spark_bolt')
      expect(castResult!.projectiles).toHaveLength(1)
      expect(castResult!.projectiles[0].sourceSpell.id).toBe('spark_bolt')
    })

    it('should cast spells in sequence - spark bolt first, then magic arrow', () => {
      wand.spells = [SPELLS.spark_bolt, SPELLS.magic_arrow]
      engine = new WandEngine(wand)

      // Verify initial deck state
      let state = engine.getWandState()
      expect(state.deck).toHaveLength(2)
      expect(state.deck[0].id).toBe('spark_bolt')
      expect(state.deck[1].id).toBe('magic_arrow')
      expect(state.discard).toHaveLength(0)

      // First cast should get spark_bolt
      const cast1 = engine.performCast()
      expect(cast1).toBeDefined()
      expect(cast1!.spells).toHaveLength(1)
      expect(cast1!.spells[0].id).toBe('spark_bolt')
      
      // Check deck state after first cast
      state = engine.getWandState()
      expect(state.deck).toHaveLength(1)
      expect(state.deck[0].id).toBe('magic_arrow')
      expect(state.discard).toHaveLength(1)
      expect(state.discard[0].id).toBe('spark_bolt')
      
      // Check cast delay - should be blocking next cast
      expect(state.castDelayTimer).toBeGreaterThan(0)
      expect(engine.canCast()).toBe(false)
      
      // Wait for cast delay to expire
      engine.update(1.0) // 1 second should clear any cast delay
      
      // Now second cast should work
      const cast2 = engine.performCast()
      expect(cast2).toBeDefined()
      expect(cast2!.spells).toHaveLength(1)
      expect(cast2!.spells[0].id).toBe('magic_arrow')
      
      // Check deck state after second cast
      state = engine.getWandState()
      expect(state.deck).toHaveLength(0)
      expect(state.discard).toHaveLength(2)
      expect(state.discard[1].id).toBe('magic_arrow')
      expect(state.isRecharging).toBe(true)
      
      // Third cast should fail (deck empty, recharging)
      const cast3 = engine.performCast()
      expect(cast3).toBeNull()
    })

    it('should progress through wand spells in correct order', () => {
      wand.spells = [SPELLS.spark_bolt, SPELLS.magic_arrow, SPELLS.fireball]
      engine = new WandEngine(wand)

      // Cast 1: spark_bolt
      const cast1 = engine.performCast()
      expect(cast1!.spells[0].id).toBe('spark_bolt')
      
      // Wait for cast delay
      engine.update(1.0)
      
      // Cast 2: magic_arrow  
      const cast2 = engine.performCast()
      expect(cast2!.spells[0].id).toBe('magic_arrow')
      
      // Wait for cast delay
      engine.update(1.0)
      
      // Cast 3: fireball
      const cast3 = engine.performCast()
      expect(cast3!.spells[0].id).toBe('fireball')
      
      // Cast 4: should fail (recharging)
      const cast4 = engine.performCast()
      expect(cast4).toBeNull()
    })

    it('should consume mana correctly', () => {
      wand.spells = [SPELLS.spark_bolt] // costs 3 mana
      engine = new WandEngine(wand)

      const initialMana = engine.getWandState().currentMana
      engine.performCast()
      const finalMana = engine.getWandState().currentMana
      
      expect(finalMana).toBe(initialMana - 3)
    })
  })

  describe('Modifier Mechanics', () => {
    it('should apply single modifier to projectile', () => {
      wand.spells = [SPELLS.damage_plus, SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.spells).toHaveLength(2)
      expect(castResult!.spells[0].id).toBe('damage_plus')
      expect(castResult!.spells[1].id).toBe('spark_bolt')
      
      expect(castResult!.projectiles).toHaveLength(1)
      const projectile = castResult!.projectiles[0]
      
      // Should have base spark bolt damage (10) + damage plus modifier (25) = 35
      expect(projectile.finalStats.damage).toBe(35)
    })

    it('should stack multiple modifiers left-to-right', () => {
      wand.spells = [SPELLS.damage_plus, SPELLS.heavy_shot, SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.projectiles).toHaveLength(1)
      const projectile = castResult!.projectiles[0]
      
      // Base spark bolt: 10 damage, 200 speed
      // + damage_plus: +25 damage
      // + heavy_shot: +40 damage, -50 speed
      // Final: 75 damage, 150 speed
      expect(projectile.finalStats.damage).toBe(75)
      expect(projectile.finalStats.speed).toBe(150)
    })

    it('should not apply modifiers to subsequent spells in separate casts', () => {
      wand.spells = [SPELLS.damage_plus, SPELLS.spark_bolt, SPELLS.magic_arrow]
      engine = new WandEngine(wand)

      // First cast: damage_plus + spark_bolt
      const cast1 = engine.performCast()
      expect(cast1!.projectiles[0].finalStats.damage).toBe(35) // 10 + 25

      // Wait for cast delay
      engine.update(1.0)

      // Second cast: magic_arrow (no modifier)
      const cast2 = engine.performCast()
      expect(cast2!.projectiles[0].finalStats.damage).toBe(20) // base magic arrow damage
    })
  })

  describe('Multicast Mechanics', () => {
    it('should cast multiple spells simultaneously with double cast', () => {
      wand.spells = [SPELLS.double_cast, SPELLS.spark_bolt, SPELLS.magic_arrow]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.spells).toHaveLength(3)
      expect(castResult!.spells[0].id).toBe('double_cast')
      expect(castResult!.spells[1].id).toBe('spark_bolt')
      expect(castResult!.spells[2].id).toBe('magic_arrow')
      
      expect(castResult!.projectiles).toHaveLength(2)
      expect(castResult!.projectiles[0].sourceSpell.id).toBe('spark_bolt')
      expect(castResult!.projectiles[1].sourceSpell.id).toBe('magic_arrow')
    })

    it('should apply modifiers to all multicast spells', () => {
      wand.spells = [SPELLS.damage_plus, SPELLS.double_cast, SPELLS.spark_bolt, SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.projectiles).toHaveLength(2)
      // Both projectiles should have the damage modifier applied
      expect(castResult!.projectiles[0].finalStats.damage).toBe(35) // 10 + 25
      expect(castResult!.projectiles[1].finalStats.damage).toBe(35) // 10 + 25
    })

    it('should handle triple cast correctly', () => {
      wand.spells = [SPELLS.triple_cast, SPELLS.spark_bolt, SPELLS.spark_bolt, SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.spells).toHaveLength(4)
      expect(castResult!.projectiles).toHaveLength(3)
      
      castResult!.projectiles.forEach(projectile => {
        expect(projectile.sourceSpell.id).toBe('spark_bolt')
      })
    })
  })

  describe('Deck State Management', () => {
    it('should properly manage deck/hand/discard piles', () => {
      wand.spells = [SPELLS.spark_bolt, SPELLS.magic_arrow]
      engine = new WandEngine(wand)

      // Initial state
      let state = engine.getWandState()
      expect(state.deck).toHaveLength(2)
      expect(state.hand).toHaveLength(0)
      expect(state.discard).toHaveLength(0)

      // After first cast
      engine.performCast()
      state = engine.getWandState()
      expect(state.deck).toHaveLength(1)
      expect(state.hand).toHaveLength(0) // hand should be cleared after cast
      expect(state.discard).toHaveLength(1)

      // After second cast
      engine.performCast()
      state = engine.getWandState()
      expect(state.deck).toHaveLength(0)
      expect(state.hand).toHaveLength(0)
      expect(state.discard).toHaveLength(2)
      expect(state.isRecharging).toBe(true)
    })

    it('should reset deck after recharge', () => {
      wand.spells = [SPELLS.spark_bolt]
      engine = new WandEngine(wand)

      // Cast until recharging
      engine.performCast()
      let state = engine.getWandState()
      expect(state.isRecharging).toBe(true)
      expect(state.deck).toHaveLength(0)
      expect(state.discard).toHaveLength(1)

      // Simulate recharge completion
      engine.update(1.0) // 1 second should complete recharge (0.5s recharge time)
      state = engine.getWandState()
      expect(state.isRecharging).toBe(false)
      expect(state.deck).toHaveLength(1)
      expect(state.discard).toHaveLength(0)
    })
  })

  describe('Mana Management', () => {
    it('should skip spells when insufficient mana', () => {
      wand.stats.manaMax = 10
      wand.currentMana = 10
      wand.spells = [SPELLS.fireball] // costs 30 mana
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      // Should be null because fireball requires more mana than available
      expect(castResult).toBeNull()
      
      // Spell should be moved to discard
      const state = engine.getWandState()
      expect(state.discard).toHaveLength(1)
      expect(state.discard[0].id).toBe('fireball')
    })

    it('should regenerate mana over time', () => {
      wand.stats.manaMax = 100
      wand.stats.manaChargeSpeed = 10 // 10 mana per second
      wand.currentMana = 50
      engine = new WandEngine(wand)

      const initialMana = engine.getWandState().currentMana
      engine.update(2.0) // 2 seconds
      const finalMana = engine.getWandState().currentMana
      
      expect(finalMana).toBe(Math.min(100, initialMana + 20)) // +20 mana over 2 seconds
    })

    it('should handle negative mana cost spells', () => {
      wand.spells = [SPELLS.add_mana, SPELLS.spark_bolt] // add_mana costs -30 mana
      wand.currentMana = 50
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      const finalMana = engine.getWandState().currentMana
      
      // Should restore 30 mana from add_mana, then spend 3 for spark_bolt
      // 50 + 30 - 3 = 77
      expect(finalMana).toBe(77)
    })
  })
})

describe('Wand Engine Edge Cases', () => {
  let wand: Wand
  let engine: WandEngine

  beforeEach(() => {
    wand = createDefaultWand()
    wand.stats.shuffle = false
  })

  describe('Always Cast', () => {
    it('should add always cast spell to every casting block', () => {
      wand.spells = [SPELLS.spark_bolt]
      wand.stats.alwaysCast = SPELLS.damage_plus
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.spells).toHaveLength(2)
      expect(castResult!.spells[0].id).toBe('damage_plus') // always cast first
      expect(castResult!.spells[1].id).toBe('spark_bolt')
      
      // Damage should be modified
      expect(castResult!.projectiles[0].finalStats.damage).toBe(35) // 10 + 25
    })
  })

  describe('Spells Per Cast > 1', () => {
    it('should draw multiple spells per cast', () => {
      wand.stats.spellsPerCast = 2
      wand.spells = [SPELLS.spark_bolt, SPELLS.magic_arrow, SPELLS.fireball]
      engine = new WandEngine(wand)

      const castResult = engine.performCast()
      
      expect(castResult!.spells).toHaveLength(2)
      expect(castResult!.spells[0].id).toBe('spark_bolt')
      expect(castResult!.spells[1].id).toBe('magic_arrow')
      expect(castResult!.projectiles).toHaveLength(2)
    })
  })
})