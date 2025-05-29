import { Spell, SpellType } from '../types';

export const SPELLS: Record<string, Spell> = {
  // PROJECTILES
  spark_bolt: {
    id: 'spark_bolt',
    name: 'Spark Bolt',
    type: SpellType.PROJECTILE,
    manaCost: 3,
    castDelay: 0.08,
    modifiers: {
      damage: 10,
      speed: 200,
      lifetime: 3
    },
    description: 'A basic magical projectile'
  },

  magic_arrow: {
    id: 'magic_arrow',
    name: 'Magic Arrow',
    type: SpellType.PROJECTILE,
    manaCost: 12,
    castDelay: 0.25,
    modifiers: {
      damage: 20,
      speed: 300,
      lifetime: 5
    },
    description: 'A piercing magical arrow'
  },

  fireball: {
    id: 'fireball',
    name: 'Fireball',
    type: SpellType.PROJECTILE,
    manaCost: 30,
    castDelay: 0.5,
    modifiers: {
      damage: 50,
      speed: 150,
      lifetime: 4
    },
    description: 'An explosive ball of fire'
  },

  // MODIFIERS
  damage_plus: {
    id: 'damage_plus',
    name: 'Damage Plus',
    type: SpellType.MODIFIER,
    manaCost: 3,
    castDelay: 0.1,
    modifiers: {
      damage: 25
    },
    description: 'Adds damage to the next projectile'
  },

  speed_up: {
    id: 'speed_up',
    name: 'Speed Up',
    type: SpellType.MODIFIER,
    manaCost: 2,
    castDelay: 0.05,
    modifiers: {
      speed: 200
    },
    description: 'Increases projectile speed'
  },

  heavy_shot: {
    id: 'heavy_shot',
    name: 'Heavy Shot',
    type: SpellType.MODIFIER,
    manaCost: 5,
    castDelay: 0.15,
    modifiers: {
      damage: 40,
      speed: -50
    },
    description: 'Adds damage but reduces speed'
  },

  reduce_spread: {
    id: 'reduce_spread',
    name: 'Reduce Spread',
    type: SpellType.MODIFIER,
    manaCost: 2,
    castDelay: 0.05,
    modifiers: {
      spread: -5
    },
    description: 'Reduces projectile spread'
  },

  add_mana: {
    id: 'add_mana',
    name: 'Add Mana',
    type: SpellType.MODIFIER,
    manaCost: -30,
    castDelay: 0.05,
    description: 'Reduces mana cost of the next spell'
  },

  // MULTICASTS
  double_cast: {
    id: 'double_cast',
    name: 'Double Cast',
    type: SpellType.MULTICAST,
    manaCost: 15,
    castDelay: 0.1,
    draws: 2,
    description: 'Casts the next 2 spells simultaneously'
  },

  triple_cast: {
    id: 'triple_cast',
    name: 'Triple Cast',
    type: SpellType.MULTICAST,
    manaCost: 30,
    castDelay: 0.15,
    draws: 3,
    description: 'Casts the next 3 spells simultaneously'
  },

  quad_cast: {
    id: 'quad_cast',
    name: 'Quad Cast',
    type: SpellType.MULTICAST,
    manaCost: 60,
    castDelay: 0.2,
    draws: 4,
    description: 'Casts the next 4 spells simultaneously'
  },

  // TRIGGERS
  spark_bolt_trigger: {
    id: 'spark_bolt_trigger',
    name: 'Spark Bolt with Trigger',
    type: SpellType.TRIGGER,
    manaCost: 5,
    castDelay: 0.08,
    triggerType: 'impact',
    modifiers: {
      damage: 10,
      speed: 200,
      lifetime: 3
    },
    description: 'A spark bolt that casts another spell on impact'
  },

  magic_arrow_trigger: {
    id: 'magic_arrow_trigger',
    name: 'Magic Arrow with Trigger',
    type: SpellType.TRIGGER,
    manaCost: 15,
    castDelay: 0.25,
    triggerType: 'impact',
    modifiers: {
      damage: 20,
      speed: 300,
      lifetime: 5
    },
    description: 'A magic arrow that casts another spell on impact'
  },

  // TIMERS
  timer_spell: {
    id: 'timer_spell',
    name: 'Timer',
    type: SpellType.TIMER,
    manaCost: 10,
    castDelay: 0.1,
    triggerType: 'timer',
    triggerDelay: 2.0,
    description: 'Casts the next spell after a delay'
  },

  // MATERIALS
  water: {
    id: 'water',
    name: 'Water',
    type: SpellType.MATERIAL,
    manaCost: 5,
    castDelay: 0.1,
    description: 'Creates a splash of water'
  },

  oil: {
    id: 'oil',
    name: 'Oil',
    type: SpellType.MATERIAL,
    manaCost: 8,
    castDelay: 0.12,
    description: 'Creates a splash of flammable oil'
  },

  acid: {
    id: 'acid',
    name: 'Acid',
    type: SpellType.MATERIAL,
    manaCost: 15,
    castDelay: 0.15,
    description: 'Creates a splash of corrosive acid'
  },

  // UTILITY
  teleport: {
    id: 'teleport',
    name: 'Teleport',
    type: SpellType.UTILITY,
    manaCost: 50,
    castDelay: 0.3,
    description: 'Teleports the caster to target location'
  },

  shield: {
    id: 'shield',
    name: 'Shield',
    type: SpellType.UTILITY,
    manaCost: 25,
    castDelay: 0.2,
    uses: 5,
    description: 'Creates a protective barrier'
  },

  chainsaw: {
    id: 'chainsaw',
    name: 'Chainsaw',
    type: SpellType.UTILITY,
    manaCost: 0,
    castDelay: -0.17,
    modifiers: {
      damage: 5
    },
    description: 'Reduces cast delay and adds minor damage'
  },

  // PASSIVE
  torch: {
    id: 'torch',
    name: 'Torch',
    type: SpellType.PASSIVE,
    manaCost: 0,
    castDelay: 0,
    description: 'Provides light (passive effect)'
  },

  reduce_recharge_time: {
    id: 'reduce_recharge_time',
    name: 'Reduce Recharge Time',
    type: SpellType.PASSIVE,
    manaCost: 0,
    castDelay: 0,
    modifiers: {
      rechargeTime: -0.25
    },
    description: 'Reduces wand recharge time'
  },

  // EXPLOSIVE PROJECTILES
  explosion: {
    id: 'explosion',
    name: 'Explosion',
    type: SpellType.PROJECTILE,
    manaCost: 40,
    castDelay: 0.3,
    modifiers: {
      damage: 100,
      speed: 0,
      lifetime: 0.1
    },
    description: 'A powerful explosion'
  },

  bomb: {
    id: 'bomb',
    name: 'Bomb',
    type: SpellType.PROJECTILE,
    manaCost: 25,
    castDelay: 0.4,
    modifiers: {
      damage: 80,
      speed: 100,
      lifetime: 2
    },
    description: 'An explosive projectile with a fuse'
  }
};

// Helper function to get spells by type
export function getSpellsByType(type: SpellType): Spell[] {
  return Object.values(SPELLS).filter(spell => spell.type === type);
}

// Helper function to get all spell types
export function getAllSpellTypes(): SpellType[] {
  return Object.values(SpellType);
}

// Helper function to get spell by ID
export function getSpellById(id: string): Spell | undefined {
  return SPELLS[id];
}