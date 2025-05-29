// Core type definitions for the Noita Wand System

export enum SpellType {
  PROJECTILE = 'PROJECTILE',
  MODIFIER = 'MODIFIER', 
  MULTICAST = 'MULTICAST',
  TRIGGER = 'TRIGGER',
  TIMER = 'TIMER',
  PASSIVE = 'PASSIVE',
  MATERIAL = 'MATERIAL',
  UTILITY = 'UTILITY'
}

export interface SpellModifiers {
  damage?: number;
  speed?: number;
  spread?: number;
  criticalChance?: number;
  lifetime?: number;
  manaCost?: number;
  castDelay?: number;
  rechargeTime?: number;
  // Add more modifiers as needed
}

export interface Spell {
  id: string;
  name: string;
  type: SpellType;
  manaCost: number;
  castDelay: number;
  uses?: number; // -1 for unlimited, undefined for unlimited
  modifiers?: SpellModifiers;
  description?: string;
  icon?: string;
  
  // Multicast specific
  draws?: number; // How many spells this multicast draws
  
  // Trigger/Timer specific
  triggerType?: 'impact' | 'timer' | 'proximity';
  triggerDelay?: number;
}

export interface WandStats {
  shuffle: boolean;
  spellsPerCast: number;
  castDelay: number;
  rechargeTime: number;
  manaMax: number;
  manaChargeSpeed: number;
  capacity: number;
  spread: number;
  alwaysCast?: Spell;
}

export interface Wand {
  stats: WandStats;
  spells: Spell[];
  
  // Runtime state for simulation
  deck: Spell[];
  hand: Spell[];
  discard: Spell[];
  currentMana: number;
  isRecharging: boolean;
  rechargeTimer: number;
  castDelayTimer: number;
}

// For visualization and simulation
export interface CastBlock {
  id: string;
  spells: Spell[];
  modifiers: SpellModifiers;
  projectiles: ProjectileResult[];
  manaCost: number;
  totalCastDelay: number;
}

export interface ProjectileResult {
  id: string;
  sourceSpell: Spell;
  appliedModifiers: SpellModifiers;
  finalStats: {
    damage: number;
    speed: number;
    spread: number;
    lifetime: number;
  };
  payload?: CastBlock; // For triggers/timers
}

// Simulation state
export interface SimulationState {
  frame: number;
  isRunning: boolean;
  isPaused: boolean;
  castHistory: CastBlock[];
  activeProjectiles: ProjectileResult[];
  currentCastBlock?: CastBlock;
}

// UI state
export interface AppState {
  wand: Wand;
  simulation: SimulationState;
  selectedSpell?: Spell;
  draggedSpell?: Spell;
}