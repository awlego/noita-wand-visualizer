import React from 'react';
import { useDrag } from 'react-dnd';
import { Spell, SpellType } from '../types';
import './SpellLibraryItem.css';

interface SpellLibraryItemProps {
  spell: Spell;
}

const SPELL_TYPE_COLORS = {
  [SpellType.PROJECTILE]: '#4a90e2',
  [SpellType.MODIFIER]: '#9b59b6', 
  [SpellType.MULTICAST]: '#2ecc71',
  [SpellType.TRIGGER]: '#f39c12',
  [SpellType.TIMER]: '#e67e22',
  [SpellType.MATERIAL]: '#1abc9c',
  [SpellType.UTILITY]: '#f1c40f',
  [SpellType.PASSIVE]: '#95a5a6'
};

export const SpellLibraryItem: React.FC<SpellLibraryItemProps> = ({ spell }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'spell',
    item: { spell },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const spellColor = SPELL_TYPE_COLORS[spell.type];

  return (
    <div
      ref={drag}
      className={`spell-library-item ${isDragging ? 'spell-library-item--dragging' : ''}`}
      style={{
        borderColor: spellColor,
        backgroundColor: `${spellColor}20`
      }}
      title={spell.description}
    >
      <div className="spell-library-item__header">
        <div className="spell-library-item__name">{spell.name}</div>
        <div className="spell-library-item__type">{spell.type}</div>
      </div>
      
      <div className="spell-library-item__stats">
        <div className="spell-library-item__mana">
          <span className="label">Mana:</span>
          <span className="value">{spell.manaCost}♦</span>
        </div>
        <div className="spell-library-item__delay">
          <span className="label">Delay:</span>
          <span className="value">{spell.castDelay}s</span>
        </div>
        
        {spell.modifiers && (
          <div className="spell-library-item__modifiers">
            {spell.modifiers.damage && (
              <div className="modifier">+{spell.modifiers.damage} dmg</div>
            )}
            {spell.modifiers.speed && (
              <div className="modifier">+{spell.modifiers.speed} spd</div>
            )}
            {spell.draws && (
              <div className="modifier">Draws {spell.draws}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellLibraryItem;