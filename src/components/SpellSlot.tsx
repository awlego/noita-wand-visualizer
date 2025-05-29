import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Spell, SpellType } from '../types';
import './SpellSlot.css';

interface SpellSlotProps {
  spell?: Spell;
  index: number;
  onSpellDrop: (spell: Spell, index: number) => void;
  onSpellRemove?: (index: number) => void;
  onSpellMove?: (fromIndex: number, toIndex: number) => void;
  isEmpty?: boolean;
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

export const SpellSlot: React.FC<SpellSlotProps> = ({ 
  spell, 
  index, 
  onSpellDrop, 
  onSpellRemove,
  onSpellMove,
  isEmpty = false 
}) => {
  // Drag functionality for existing spells
  const [{ isDragging }, drag] = useDrag({
    type: 'spell',
    item: spell ? { spell, sourceIndex: index, isFromWand: true } : undefined,
    canDrag: !!spell,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop functionality for both library spells and wand spells
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'spell',
    drop: (item: { spell: Spell; sourceIndex?: number; isFromWand?: boolean }) => {
      if (item.isFromWand && item.sourceIndex !== undefined && onSpellMove) {
        // Moving spell within wand
        onSpellMove(item.sourceIndex, index);
      } else {
        // Adding spell from library
        onSpellDrop(item.spell, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleDoubleClick = () => {
    if (spell && onSpellRemove) {
      onSpellRemove(index);
    }
  };

  const slotClass = [
    'spell-slot',
    isEmpty ? 'spell-slot--empty' : '',
    spell ? 'spell-slot--filled' : '',
    isOver && canDrop ? 'spell-slot--drop-target' : '',
    canDrop ? 'spell-slot--can-drop' : '',
    isDragging ? 'spell-slot--dragging' : ''
  ].filter(Boolean).join(' ');

  const spellColor = spell ? SPELL_TYPE_COLORS[spell.type] : undefined;

  // Combine drag and drop refs
  const combinedRef = (node: HTMLDivElement | null) => {
    drag(node);
    drop(node);
  };

  return (
    <div 
      ref={combinedRef}
      className={slotClass}
      onDoubleClick={handleDoubleClick}
      style={{
        borderColor: spell ? spellColor : undefined,
        backgroundColor: spell ? `${spellColor}20` : undefined,
        cursor: spell ? 'grab' : 'default'
      }}
    >
      {spell ? (
        <div className="spell-slot__content">
          <div className="spell-slot__name">{spell.name}</div>
          <div className="spell-slot__details">
            <span className="spell-slot__mana">{spell.manaCost}♦</span>
            <span className="spell-slot__delay">{spell.castDelay}s</span>
          </div>
        </div>
      ) : (
        <div className="spell-slot__placeholder">
          {index + 1}
        </div>
      )}
    </div>
  );
};

export default SpellSlot;