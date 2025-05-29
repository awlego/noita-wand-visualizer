import React from 'react';
import { Spell, Wand } from '../types';
import SpellSlot from './SpellSlot';
import './WandSlotGrid.css';

interface WandSlotGridProps {
  wand: Wand;
  onSpellAdd: (spell: Spell, index: number) => void;
  onSpellRemove: (index: number) => void;
  onSpellMove: (fromIndex: number, toIndex: number) => void;
}

export const WandSlotGrid: React.FC<WandSlotGridProps> = ({
  wand,
  onSpellAdd,
  onSpellRemove,
  onSpellMove
}) => {
  const slots = Array.from({ length: wand.stats.capacity }, (_, index) => {
    const spell = wand.spells[index];
    return (
      <SpellSlot
        key={index}
        spell={spell}
        index={index}
        onSpellDrop={onSpellAdd}
        onSpellRemove={onSpellRemove}
        onSpellMove={onSpellMove}
        isEmpty={!spell}
      />
    );
  });

  return (
    <div className="wand-slot-grid">
      <div className="wand-slot-grid__header">
        <h3>Wand Slots ({wand.spells.length}/{wand.stats.capacity})</h3>
        <div className="wand-slot-grid__stats">
          <span>Mana: {Math.round(wand.currentMana)}/{wand.stats.manaMax}</span>
          <span>Shuffle: {wand.stats.shuffle ? 'On' : 'Off'}</span>
          <span>Spells/Cast: {wand.stats.spellsPerCast}</span>
        </div>
      </div>
      <div className="wand-slot-grid__slots">
        {slots}
      </div>
      <div className="wand-slot-grid__footer">
        <div className="wand-timing">
          <span>Cast Delay: {wand.stats.castDelay}s</span>
          <span>Recharge: {wand.stats.rechargeTime}s</span>
        </div>
        {wand.isRecharging && (
          <div className="wand-status wand-status--recharging">
            Recharging ({wand.rechargeTimer.toFixed(2)}s)
          </div>
        )}
        {wand.castDelayTimer > 0 && (
          <div className="wand-status wand-status--delay">
            Cast Delay ({wand.castDelayTimer.toFixed(2)}s)
          </div>
        )}
      </div>
    </div>
  );
};

export default WandSlotGrid;