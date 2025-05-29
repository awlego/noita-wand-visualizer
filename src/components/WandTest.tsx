import React, { useState, useEffect } from 'react';
import { WandEngine } from '../core/WandEngine';
import { createTestWand, createMulticastTestWand, createTriggerTestWand, createComplexTestWand } from '../utils/wandFactory';
import { CastBlock, Wand } from '../types';

interface WandTestProps {}

export const WandTest: React.FC<WandTestProps> = () => {
  const [engine, setEngine] = useState<WandEngine | null>(null);
  const [wandState, setWandState] = useState<Wand | null>(null);
  const [castHistory, setCastHistory] = useState<CastBlock[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('basic');

  const testWands = {
    basic: createTestWand(),
    multicast: createMulticastTestWand(), 
    trigger: createTriggerTestWand(),
    complex: createComplexTestWand()
  };

  useEffect(() => {
    const wand = testWands[selectedTest as keyof typeof testWands];
    const newEngine = new WandEngine(wand);
    setEngine(newEngine);
    setWandState(newEngine.getWandState());
    setCastHistory([]);
  }, [selectedTest]);

  const performCast = () => {
    if (!engine) return;

    const castBlock = engine.performCast();
    if (castBlock) {
      setCastHistory(prev => [...prev, castBlock]);
      setWandState(engine.getWandState());
    }
  };

  const reset = () => {
    if (!engine) return;
    
    engine.reset();
    setWandState(engine.getWandState());
    setCastHistory([]);
  };

  if (!wandState || !engine) {
    return <div>Loading wand engine...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Wand Engine Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Test Wand: </label>
        <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
          <option value="basic">Basic (Modifiers + Projectiles)</option>
          <option value="multicast">Multicast (Triple Cast)</option>
          <option value="trigger">Trigger (Spark Bolt → Explosion)</option>
          <option value="complex">Complex (Mixed Spells)</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button onClick={performCast} disabled={!engine.canCast()}>
          {engine.canCast() ? 'Cast Wand' : 'Cannot Cast'}
        </button>
        <button onClick={reset}>Reset Wand</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Wand State */}
        <div>
          <h3>Wand State</h3>
          <div style={{ background: '#2a2318', padding: '10px', border: '1px solid #d4a574' }}>
            <div><strong>Mana:</strong> {Math.round(wandState.currentMana)} / {wandState.stats.manaMax}</div>
            <div><strong>Recharging:</strong> {wandState.isRecharging ? 'Yes' : 'No'}</div>
            <div><strong>Cast Delay:</strong> {wandState.castDelayTimer.toFixed(2)}s</div>
            
            <h4>Deck ({wandState.deck.length})</h4>
            <div style={{ fontSize: '12px' }}>
              {wandState.deck.map((spell, i) => (
                <div key={i}>{spell.name}</div>
              ))}
            </div>

            <h4>Hand ({wandState.hand.length})</h4>
            <div style={{ fontSize: '12px' }}>
              {wandState.hand.map((spell, i) => (
                <div key={i}>{spell.name}</div>
              ))}
            </div>

            <h4>Discard ({wandState.discard.length})</h4>
            <div style={{ fontSize: '12px' }}>
              {wandState.discard.map((spell, i) => (
                <div key={i}>{spell.name}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Cast History */}
        <div>
          <h3>Cast History</h3>
          <div style={{ background: '#2a2318', padding: '10px', border: '1px solid #d4a574', maxHeight: '400px', overflow: 'auto' }}>
            {castHistory.length === 0 ? (
              <div>No casts yet</div>
            ) : (
              castHistory.map((cast, i) => (
                <div key={cast.id} style={{ marginBottom: '15px', borderBottom: '1px solid #555' }}>
                  <h4>Cast {i + 1}</h4>
                  <div><strong>Mana Cost:</strong> {cast.manaCost}</div>
                  <div><strong>Cast Delay:</strong> {cast.totalCastDelay.toFixed(3)}s</div>
                  
                  <div><strong>Spells:</strong></div>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {cast.spells.map((spell, j) => (
                      <li key={j} style={{ fontSize: '12px' }}>
                        {spell.name} ({spell.type})
                      </li>
                    ))}
                  </ul>

                  <div><strong>Projectiles:</strong></div>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    {cast.projectiles.map((proj, j) => (
                      <li key={j} style={{ fontSize: '12px' }}>
                        {proj.sourceSpell.name} - Dmg: {proj.finalStats.damage}, Speed: {proj.finalStats.speed}
                        {proj.payload && (
                          <div style={{ marginLeft: '15px', color: '#f39c12' }}>
                            → Payload: {proj.payload.spells[0]?.name}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WandTest;