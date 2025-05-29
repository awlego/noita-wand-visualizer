import React, { useState, useEffect } from 'react';
import { WandEngine } from '../core/WandEngine';
import { createDefaultWand } from '../utils/wandFactory';
import { addSpellToWand, removeSpellFromWand } from '../utils/wandFactory';
import { Wand, Spell, CastBlock } from '../types';
import WandSlotGrid from './WandSlotGrid';
import SpellLibrary from './SpellLibrary';
import './WandEditor.css';

export const WandEditor: React.FC = () => {
  const [wand, setWand] = useState<Wand>(createDefaultWand());
  const [engine, setEngine] = useState<WandEngine | null>(null);
  const [castHistory, setCastHistory] = useState<CastBlock[]>([]);

  // Initialize engine when wand changes
  useEffect(() => {
    const newEngine = new WandEngine(wand);
    setEngine(newEngine);
  }, [wand]);

  // Update wand state from engine
  useEffect(() => {
    if (engine) {
      const interval = setInterval(() => {
        engine.update(0.016); // ~60fps updates
        setWand(engine.getWandState());
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
        </div>

        <div className="wand-editor__right">
          <SpellLibrary />
          
          {castHistory.length > 0 && (
            <div className="wand-editor__cast-history">
              <h3>Cast History</h3>
              <div className="cast-history">
                {castHistory.slice(-3).map((cast, i) => (
                  <div key={cast.id} className="cast-history__entry">
                    <div className="cast-history__header">
                      Cast {castHistory.length - 2 + i}
                    </div>
                    <div className="cast-history__details">
                      <div>Mana: {cast.manaCost}♦</div>
                      <div>Delay: {cast.totalCastDelay.toFixed(2)}s</div>
                    </div>
                    <div className="cast-history__spells">
                      {cast.spells.map((spell, j) => (
                        <span key={j} className="cast-history__spell">
                          {spell.name}
                        </span>
                      ))}
                    </div>
                    <div className="cast-history__projectiles">
                      {cast.projectiles.map((proj, j) => (
                        <div key={j} className="cast-history__projectile">
                          → {proj.sourceSpell.name} (Dmg: {proj.finalStats.damage})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WandEditor;