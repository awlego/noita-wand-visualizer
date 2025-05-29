import { Wand, Spell, SpellType, CastBlock, ProjectileResult, SpellModifiers } from '../types';

export class WandEngine {
  private wand: Wand;
  private castCounter: number = 0;

  constructor(wand: Wand) {
    this.wand = { ...wand };
    this.initializeDecks();
  }

  private initializeDecks(): void {
    // Initialize deck with all wand spells
    this.wand.deck = [...this.wand.spells];
    this.wand.hand = [];
    this.wand.discard = [];
    this.wand.currentMana = this.wand.stats.manaMax;
    this.wand.isRecharging = false;
    this.wand.rechargeTimer = 0;
    this.wand.castDelayTimer = 0;

    // Shuffle if needed
    if (this.wand.stats.shuffle) {
      this.shuffleDeck();
    }
  }

  private shuffleDeck(): void {
    for (let i = this.wand.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.wand.deck[i], this.wand.deck[j]] = [this.wand.deck[j], this.wand.deck[i]];
    }
  }

  public canCast(): boolean {
    return !this.wand.isRecharging && 
           this.wand.castDelayTimer <= 0 && 
           this.wand.deck.length > 0;
  }

  public performCast(): CastBlock | null {
    if (!this.canCast()) {
      return null;
    }

    const castBlock: CastBlock = {
      id: `cast_${++this.castCounter}`,
      spells: [],
      modifiers: {},
      projectiles: [],
      manaCost: 0,
      totalCastDelay: 0
    };

    // Add Always Cast spell if present
    if (this.wand.stats.alwaysCast) {
      this.drawSpell(castBlock, this.wand.stats.alwaysCast);
    }

    // Draw initial spells based on spells/cast
    for (let i = 0; i < this.wand.stats.spellsPerCast; i++) {
      if (this.wand.deck.length === 0) break;
      
      const spell = this.wand.deck.shift()!;
      this.drawSpell(castBlock, spell);
    }

    // Execute the cast block
    this.executeCastBlock(castBlock);

    // Move hand to discard
    this.wand.discard.push(...this.wand.hand);
    this.wand.hand = [];

    // Check if deck is empty
    if (this.wand.deck.length === 0) {
      this.startRecharge();
    } else {
      // Apply cast delay for next cast
      this.wand.castDelayTimer = this.wand.stats.castDelay + castBlock.totalCastDelay;
    }

    return castBlock;
  }

  private drawSpell(castBlock: CastBlock, spell: Spell): void {
    // Check mana and charges
    if (!this.canUseSpell(spell)) {
      this.wand.discard.push(spell);
      return;
    }

    this.wand.hand.push(spell);
    castBlock.spells.push(spell);

    // Handle special spell types that draw additional spells
    this.handleSpellDraws(castBlock, spell);
  }

  private canUseSpell(spell: Spell): boolean {
    // Check mana cost
    if (this.wand.currentMana < spell.manaCost) {
      return false;
    }

    // Check charges (if applicable)
    if (spell.uses !== undefined && spell.uses !== -1 && spell.uses <= 0) {
      return false;
    }

    return true;
  }

  private handleSpellDraws(castBlock: CastBlock, spell: Spell): void {
    switch (spell.type) {
      case SpellType.MODIFIER:
        // Modifiers draw the next spell
        this.drawNextSpell(castBlock);
        break;
      
      case SpellType.MULTICAST:
        // Multicasts draw multiple spells
        const draws = spell.draws || 2; // Default to double cast
        for (let i = 0; i < draws; i++) {
          this.drawNextSpell(castBlock);
        }
        break;
      
      case SpellType.TRIGGER:
      case SpellType.TIMER:
        // Triggers/timers draw payload spells (but don't execute them immediately)
        this.drawNextSpell(castBlock);
        break;
    }
  }

  private drawNextSpell(castBlock: CastBlock): void {
    if (this.wand.deck.length === 0) {
      // Try wrapping if there are spells in discard
      if (this.wand.discard.length > 0) {
        this.wrapDeck();
      } else {
        return; // No more spells available
      }
    }

    if (this.wand.deck.length > 0) {
      const spell = this.wand.deck.shift()!;
      this.drawSpell(castBlock, spell);
    }
  }

  private wrapDeck(): void {
    // Move discard back to deck for wrapping
    this.wand.deck.push(...this.wand.discard);
    this.wand.discard = [];
    
    if (this.wand.stats.shuffle) {
      this.shuffleDeck();
    }
  }

  private executeCastBlock(castBlock: CastBlock): void {
    const modifierStack: SpellModifiers = {};
    let i = 0;

    while (i < castBlock.spells.length) {
      const spell = castBlock.spells[i];

      switch (spell.type) {
        case SpellType.MODIFIER:
          this.applyModifier(modifierStack, spell);
          break;

        case SpellType.PROJECTILE:
          const projectile = this.createProjectile(spell, { ...modifierStack });
          castBlock.projectiles.push(projectile);
          // Clear modifiers after applying to projectile
          Object.keys(modifierStack).forEach(key => delete modifierStack[key as keyof SpellModifiers]);
          break;

        case SpellType.MULTICAST:
          // Multicast executes multiple projectiles simultaneously
          this.executeMulticast(castBlock, i, { ...modifierStack });
          // Skip the spells that were part of the multicast
          i += spell.draws || 2;
          Object.keys(modifierStack).forEach(key => delete modifierStack[key as keyof SpellModifiers]);
          break;

        case SpellType.TRIGGER:
        case SpellType.TIMER:
          const triggerProjectile = this.createTriggerProjectile(spell, castBlock, i, { ...modifierStack });
          castBlock.projectiles.push(triggerProjectile);
          i += 1; // Skip the payload spell
          Object.keys(modifierStack).forEach(key => delete modifierStack[key as keyof SpellModifiers]);
          break;

        case SpellType.PASSIVE:
          // Passive spells just add their effects (handled elsewhere)
          break;
      }

      // Apply spell costs and delays
      this.wand.currentMana -= spell.manaCost;
      castBlock.manaCost += spell.manaCost;
      castBlock.totalCastDelay += spell.castDelay;

      // Reduce charges if applicable
      if (spell.uses !== undefined && spell.uses > 0) {
        spell.uses--;
      }

      i++;
    }
  }

  private applyModifier(modifierStack: SpellModifiers, spell: Spell): void {
    if (spell.modifiers) {
      Object.keys(spell.modifiers).forEach(key => {
        const modKey = key as keyof SpellModifiers;
        const value = spell.modifiers![modKey];
        if (value !== undefined) {
          modifierStack[modKey] = (modifierStack[modKey] || 0) + value;
        }
      });
    }
  }

  private createProjectile(spell: Spell, appliedModifiers: SpellModifiers): ProjectileResult {
    return {
      id: `projectile_${this.castCounter}_${Date.now()}`,
      sourceSpell: spell,
      appliedModifiers,
      finalStats: {
        damage: (spell.modifiers?.damage || 0) + (appliedModifiers.damage || 0),
        speed: (spell.modifiers?.speed || 0) + (appliedModifiers.speed || 0),
        spread: (spell.modifiers?.spread || 0) + (appliedModifiers.spread || 0),
        lifetime: (spell.modifiers?.lifetime || 0) + (appliedModifiers.lifetime || 0)
      }
    };
  }

  private executeMulticast(castBlock: CastBlock, startIndex: number, modifiers: SpellModifiers): void {
    const multicastSpell = castBlock.spells[startIndex];
    const draws = multicastSpell.draws || 2;

    // Create projectiles for each spell in the multicast
    for (let i = 1; i <= draws && startIndex + i < castBlock.spells.length; i++) {
      const spell = castBlock.spells[startIndex + i];
      if (spell.type === SpellType.PROJECTILE) {
        const projectile = this.createProjectile(spell, { ...modifiers });
        castBlock.projectiles.push(projectile);
      }
    }
  }

  private createTriggerProjectile(spell: Spell, castBlock: CastBlock, index: number, modifiers: SpellModifiers): ProjectileResult {
    const projectile = this.createProjectile(spell, modifiers);

    // Create payload if there's a next spell
    if (index + 1 < castBlock.spells.length) {
      const payloadSpell = castBlock.spells[index + 1];
      projectile.payload = {
        id: `payload_${projectile.id}`,
        spells: [payloadSpell],
        modifiers: {},
        projectiles: [this.createProjectile(payloadSpell, {})],
        manaCost: payloadSpell.manaCost,
        totalCastDelay: 0 // Trigger payloads ignore cast delay
      };
    }

    return projectile;
  }

  private startRecharge(): void {
    this.wand.isRecharging = true;
    this.wand.rechargeTimer = this.wand.stats.rechargeTime;
    
    // Move all discard back to deck
    this.wand.deck = [...this.wand.discard];
    this.wand.discard = [];
    
    if (this.wand.stats.shuffle) {
      this.shuffleDeck();
    }
  }

  public update(deltaTime: number): void {
    // Update mana regeneration
    if (this.wand.currentMana < this.wand.stats.manaMax) {
      this.wand.currentMana = Math.min(
        this.wand.stats.manaMax,
        this.wand.currentMana + this.wand.stats.manaChargeSpeed * deltaTime
      );
    }

    // Update recharge timer
    if (this.wand.isRecharging) {
      this.wand.rechargeTimer -= deltaTime;
      if (this.wand.rechargeTimer <= 0) {
        this.wand.isRecharging = false;
        this.wand.rechargeTimer = 0;
      }
    }

    // Update cast delay timer
    if (this.wand.castDelayTimer > 0) {
      this.wand.castDelayTimer -= deltaTime;
    }
  }

  public getWandState(): Wand {
    return { ...this.wand };
  }

  public reset(): void {
    this.initializeDecks();
    this.castCounter = 0;
  }
}