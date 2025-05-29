import React, { useState } from 'react';
import { CastBlock, SpellType } from '../types';
import './CastSequenceVisualization.css';

interface CastSequenceVisualizationProps {
  castHistory: CastBlock[];
  onClearHistory?: () => void;
}

type ViewMode = 'timeline' | 'tree';

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

export const CastSequenceVisualization: React.FC<CastSequenceVisualizationProps> = ({
  castHistory,
  onClearHistory
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');

  if (castHistory.length === 0) {
    return (
      <div className="cast-sequence-visualization">
        <div className="cast-sequence-visualization__header">
          <h3>Cast Sequence</h3>
          <div className="cast-sequence-visualization__controls">
            <button
              className={`view-mode-button ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </button>
            <button
              className={`view-mode-button ${viewMode === 'tree' ? 'active' : ''}`}
              onClick={() => setViewMode('tree')}
            >
              Tree
            </button>
          </div>
        </div>
        <div className="cast-sequence-visualization__empty">
          <p>Cast your wand to see the sequence visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cast-sequence-visualization">
      <div className="cast-sequence-visualization__header">
        <h3>Cast Sequence</h3>
        <div className="cast-sequence-visualization__controls">
          <button
            className={`view-mode-button ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button
            className={`view-mode-button ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            Tree
          </button>
          {onClearHistory && (
            <button
              className="clear-button"
              onClick={onClearHistory}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="cast-sequence-visualization__content">
        {viewMode === 'timeline' ? (
          <TimelineView castHistory={castHistory} />
        ) : (
          <TreeView castHistory={castHistory} />
        )}
      </div>
    </div>
  );
};

const TimelineView: React.FC<{ castHistory: CastBlock[] }> = ({ castHistory }) => {
  return (
    <div className="timeline-view">
      {castHistory.map((castBlock, index) => (
        <div key={castBlock.id} className="timeline-cast-block">
          <div className="timeline-cast-header">
            <span className="cast-number">Cast {index + 1}</span>
            <span className="cast-stats">
              {castBlock.manaCost}♦ • {castBlock.totalCastDelay.toFixed(2)}s
            </span>
          </div>

          <div className="timeline-spell-sequence">
            {castBlock.spells.map((spell, spellIndex) => (
              <React.Fragment key={spellIndex}>
                <div 
                  className={`timeline-spell ${spell.type.toLowerCase()}`}
                  style={{ borderColor: SPELL_TYPE_COLORS[spell.type] }}
                >
                  <span className="spell-name">{spell.name}</span>
                  <span className="spell-type">{spell.type}</span>
                </div>
                {spellIndex < castBlock.spells.length - 1 && (
                  <div className="timeline-arrow">→</div>
                )}
              </React.Fragment>
            ))}
            <div className="timeline-result">══►</div>
          </div>

          <div className="timeline-projectiles">
            {castBlock.projectiles.map((projectile, projIndex) => (
              <div key={projIndex} className="timeline-projectile">
                <span className="projectile-name">{projectile.sourceSpell.name}</span>
                <div className="projectile-stats">
                  Damage: {projectile.finalStats.damage} • 
                  Speed: {projectile.finalStats.speed} • 
                  Spread: {projectile.finalStats.spread}°
                </div>
                {projectile.payload && (
                  <div className="projectile-payload">
                    └─ Payload: {projectile.payload.spells[0]?.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          {Object.keys(castBlock.modifiers).length > 0 && (
            <div className="timeline-modifiers">
              <span>Applied modifiers: </span>
              {Object.entries(castBlock.modifiers).map(([key, value]) => (
                <span key={key} className="modifier-value">
                  {key}: {value > 0 ? '+' : ''}{value}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TreeView: React.FC<{ castHistory: CastBlock[] }> = ({ castHistory }) => {
  return (
    <div className="tree-view">
      {castHistory.map((castBlock, index) => (
        <div key={castBlock.id} className="tree-cast-block">
          <div className="tree-cast-header">
            ┌─ Cast Block {index + 1}
            <span className="cast-stats">
              ({castBlock.manaCost}♦, {castBlock.totalCastDelay.toFixed(2)}s)
            </span>
          </div>

          <div className="tree-structure">
            {castBlock.spells.map((spell, spellIndex) => {
              const isLast = spellIndex === castBlock.spells.length - 1;
              const prefix = isLast ? '└─' : '├─';
              
              return (
                <div key={spellIndex} className="tree-spell-node">
                  <span className="tree-prefix">│  {prefix}</span>
                  <span 
                    className={`tree-spell ${spell.type.toLowerCase()}`}
                    style={{ color: SPELL_TYPE_COLORS[spell.type] }}
                  >
                    {spell.name}
                  </span>
                  <span className="tree-spell-type">({spell.type.toLowerCase()})</span>
                  
                  {spell.type === SpellType.MODIFIER && (
                    <div className="tree-modifier-effects">
                      <span className="tree-prefix">│     └─ Effects: </span>
                      {spell.modifiers && Object.entries(spell.modifiers).map(([key, value]) => (
                        <span key={key} className="modifier-effect">
                          {key}: {value > 0 ? '+' : ''}{value}
                        </span>
                      ))}
                    </div>
                  )}

                  {spell.type === SpellType.MULTICAST && spell.draws && (
                    <div className="tree-multicast-info">
                      <span className="tree-prefix">│     └─ Draws: {spell.draws} spells</span>
                    </div>
                  )}
                </div>
              );
            })}

            {castBlock.projectiles.length > 0 && (
              <div className="tree-results">
                <div className="tree-results-header">
                  <span className="tree-prefix">│</span>
                </div>
                <div className="tree-results-title">
                  <span className="tree-prefix">└─ Results:</span>
                </div>
                {castBlock.projectiles.map((projectile, projIndex) => {
                  const isLastProj = projIndex === castBlock.projectiles.length - 1;
                  const projPrefix = isLastProj ? '   └─' : '   ├─';
                  
                  return (
                    <div key={projIndex} className="tree-projectile">
                      <span className="tree-prefix">{projPrefix}</span>
                      <span className="projectile-name">{projectile.sourceSpell.name}</span>
                      <span className="projectile-details">
                        (Dmg: {projectile.finalStats.damage}, Spd: {projectile.finalStats.speed})
                      </span>
                      
                      {projectile.payload && (
                        <div className="tree-payload">
                          <span className="tree-prefix">      └─ Payload: {projectile.payload.spells[0]?.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {index < castHistory.length - 1 && (
            <div className="tree-separator">
              <span className="tree-prefix">│</span>
            </div>
          )}
        </div>
      ))}

      {castHistory.length > 0 && (
        <div className="tree-footer">
          <div className="tree-recharge">
            └─ [Recharge] ⟲
          </div>
        </div>
      )}
    </div>
  );
};

export default CastSequenceVisualization;