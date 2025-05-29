import React, { useState, useEffect } from 'react';
import { WandEngine } from '../core/WandEngine';
import { createDefaultWand } from '../utils/wandFactory';
import { addSpellToWand, removeSpellFromWand } from '../utils/wandFactory';
import { Wand, Spell, CastBlock } from '../types';
import WandSlotGrid from './WandSlotGrid';
import SpellLibrary from './SpellLibrary';
import CastSequenceVisualization from './CastSequenceVisualization';
import DeckStateVisualization from './DeckStateVisualization';
import './WandEditor.css';

export const WandEditor: React.FC = () => {
  const [wand, setWand] = useState<Wand>(createDefaultWand());
  const [engine, setEngine] = useState<WandEngine | null>(null);
  const [castHistory, setCastHistory] = useState<CastBlock[]>([]);
  const [wandDisplayState, setWandDisplayState] = useState<Wand>(createDefaultWand());

  // Initialize engine when wand configuration changes (spells/stats only)
  useEffect(() => {
    const newEngine = new WandEngine(wand);
    setEngine(newEngine);
    setWandDisplayState(newEngine.getWandState());
  }, [JSON.stringify(wand.spells), JSON.stringify(wand.stats)]); // Use JSON.stringify for deep comparison

  // Update display state from engine (for timers, mana, deck state)
  useEffect(() => {
    if (engine) {
      const interval = setInterval(() => {
        engine.update(0.016); // ~60fps updates
        setWandDisplayState(engine.getWandState());
      }, 16);

      return () => clearInterval(interval);
    }
  }, [engine]);

  const handleSpellAdd = (spell: Spell, index: number) => {
    setWand(prevWand => {
      const newWand = { ...prevWand };
      const newSpells = [...newWand.spells];
      
      // Extend array if needed
      while (newSpells.length <= index) {
        newSpells.push(undefined as any);
      }
      
      // Place spell at the target index
      newSpells[index] = { ...spell };
      
      // Remove undefined gaps and update
      newWand.spells = newSpells.filter(Boolean);
      
      return newWand;
    });
  };

  const handleSpellRemove = (index: number) => {
    setWand(prevWand => {
      const newWand = { ...prevWand };
      newWand.spells.splice(index, 1);
      return newWand;
    });
  };

  const handleSpellMove = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setWand(prevWand => {
      const newWand = { ...prevWand };
      const newSpells = [...newWand.spells];
      
      // Get the spell being moved
      const movedSpell = newSpells[fromIndex];
      if (!movedSpell) return prevWand;
      
      // Remove from source position
      newSpells.splice(fromIndex, 1);
      
      // Insert at target position (adjust index if needed)
      const adjustedToIndex = toIndex > fromIndex ? toIndex - 1 : toIndex;
      newSpells.splice(adjustedToIndex, 0, movedSpell);
      
      newWand.spells = newSpells;
      return newWand;
    });
  };

  const handleCast = () => {
    if (!engine) return;

    const castBlock = engine.performCast();
    if (castBlock) {
      setCastHistory(prev => [...prev, castBlock]);
    }
  };

  const handleReset = () => {
    if (!engine) return;
    
    engine.reset();
    setCastHistory([]);
  };

  const handleClearWand = () => {
    setWand(prevWand => ({
      ...prevWand,
      spells: []
    }));
    setCastHistory([]);
  };

  const handleClearHistory = () => {
    setCastHistory([]);
  };

  const canCast = engine ? engine.canCast() : false;

  return (
    <div className="wand-editor">
      <div className="wand-editor__panels">
        <div className="wand-editor__left">
          <WandSlotGrid
            wand={wand}
            onSpellAdd={handleSpellAdd}
            onSpellRemove={handleSpellRemove}
            onSpellMove={handleSpellMove}
          />
          
          <div className="wand-editor__controls">
            <button 
              className="wand-editor__button wand-editor__button--cast"
              onClick={handleCast}
              disabled={!canCast}
            >
              {canCast ? 'Cast Wand' : 'Cannot Cast'}
            </button>
            <button 
              className="wand-editor__button wand-editor__button--reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button 
              className="wand-editor__button wand-editor__button--clear"
              onClick={handleClearWand}
            >
              Clear Wand
            </button>
          </div>

          <DeckStateVisualization wand={wandDisplayState} />
        </div>

        <div className="wand-editor__right">
          <SpellLibrary />
          
          <CastSequenceVisualization 
            castHistory={castHistory}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>
    </div>
  );
};

export default WandEditor;