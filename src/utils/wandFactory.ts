import { Wand, WandStats, Spell } from '../types';
import { SPELLS } from '../data/spells';

export function createDefaultWand(): Wand {
  const stats: WandStats = {
    shuffle: false,
    spellsPerCast: 1,
    castDelay: 0.17,
    rechargeTime: 0.5,
    manaMax: 200,
    manaChargeSpeed: 50,
    capacity: 10,
    spread: 0
  };

  return {
    stats,
    spells: [],
    deck: [],
    hand: [],
    discard: [],
    currentMana: stats.manaMax,
    isRecharging: false,
    rechargeTimer: 0,
    castDelayTimer: 0
  };
}

export function createTestWand(): Wand {
  const wand = createDefaultWand();
  
  // Add some test spells for demonstration
  wand.spells = [
    SPELLS.damage_plus,
    SPELLS.speed_up,
    SPELLS.spark_bolt,
    SPELLS.magic_arrow
  ];

  return wand;
}

export function createMulticastTestWand(): Wand {
  const wand = createDefaultWand();
  
  wand.spells = [
    SPELLS.triple_cast,
    SPELLS.spark_bolt,
    SPELLS.spark_bolt,
    SPELLS.spark_bolt
  ];

  return wand;
}

export function createTriggerTestWand(): Wand {
  const wand = createDefaultWand();
  
  wand.spells = [
    SPELLS.spark_bolt_trigger,
    SPELLS.explosion
  ];

  return wand;
}

export function createComplexTestWand(): Wand {
  const wand = createDefaultWand();
  
  wand.spells = [
    SPELLS.damage_plus,
    SPELLS.double_cast,
    SPELLS.heavy_shot,
    SPELLS.magic_arrow,
    SPELLS.speed_up,
    SPELLS.fireball,
    SPELLS.spark_bolt_trigger,
    SPELLS.explosion
  ];

  wand.stats.capacity = 8;
  wand.stats.spellsPerCast = 2;

  return wand;
}

export function addSpellToWand(wand: Wand, spell: Spell): boolean {
  if (wand.spells.length >= wand.stats.capacity) {
    return false; // Wand is full
  }

  wand.spells.push({ ...spell }); // Create a copy
  return true;
}

export function removeSpellFromWand(wand: Wand, index: number): boolean {
  if (index < 0 || index >= wand.spells.length) {
    return false;
  }

  wand.spells.splice(index, 1);
  return true;
}

export function moveSpellInWand(wand: Wand, fromIndex: number, toIndex: number): boolean {
  if (fromIndex < 0 || fromIndex >= wand.spells.length ||
      toIndex < 0 || toIndex >= wand.spells.length) {
    return false;
  }

  const spell = wand.spells.splice(fromIndex, 1)[0];
  wand.spells.splice(toIndex, 0, spell);
  return true;
}

export function clearWand(wand: Wand): void {
  wand.spells = [];
}

export function getWandInfo(wand: Wand) {
  const totalManaCost = wand.spells.reduce((sum, spell) => sum + spell.manaCost, 0);
  const totalCastDelay = wand.spells.reduce((sum, spell) => sum + spell.castDelay, 0);
  
  const spellCounts = wand.spells.reduce((counts, spell) => {
    counts[spell.type] = (counts[spell.type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return {
    spellCount: wand.spells.length,
    capacity: wand.stats.capacity,
    totalManaCost,
    totalCastDelay,
    spellCounts,
    canCastOnce: totalManaCost <= wand.stats.manaMax
  };
}