import React from 'react';
import { Spell } from '../types';
import SpellLibraryItem from './SpellLibraryItem';
import { SPELLS } from '../data/spells';
import './SpellLibrary.css';

interface SpellLibraryProps {
  selectedSpells?: string[];
}

export const SpellLibrary: React.FC<SpellLibraryProps> = ({ 
  selectedSpells = ['spark_bolt', 'double_cast', 'triple_cast', 'damage_plus'] 
}) => {
  const spells = selectedSpells
    .map(id => SPELLS[id])
    .filter(Boolean) as Spell[];

  return (
    <div className="spell-library">
      <div className="spell-library__header">
        <h3>Spell Library</h3>
        <div className="spell-library__count">
          {spells.length} spells available
        </div>
      </div>
      
      <div className="spell-library__grid">
        {spells.map(spell => (
          <SpellLibraryItem key={spell.id} spell={spell} />
        ))}
      </div>
      
      <div className="spell-library__instructions">
        <p>Drag spells to wand slots to build your wand</p>
        <p>Drag within wand to reorder spells</p>
        <p>Double-click slots to remove spells</p>
      </div>
    </div>
  );
};

export default SpellLibrary;