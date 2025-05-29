import React from 'react';
import { Wand, Spell, SpellType } from '../types';
import './DeckStateVisualization.css';

interface DeckStateVisualizationProps {
  wand: Wand;
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

const SpellCard: React.FC<{ spell: Spell; isSmall?: boolean }> = ({ spell, isSmall = false }) => {
  const spellColor = SPELL_TYPE_COLORS[spell.type];
  
  return (
    <div 
      className={`spell-card ${isSmall ? 'spell-card--small' : ''}`}
      style={{ borderColor: spellColor, backgroundColor: `${spellColor}15` }}
      title={`${spell.name} - ${spell.type}`}
    >
      <div className="spell-card__name">{spell.name}</div>
      {!isSmall && (
        <div className="spell-card__details">
          <span className="spell-card__mana">{spell.manaCost}♦</span>
          <span className="spell-card__delay">{spell.castDelay}s</span>
        </div>
      )}
    </div>
  );
};

export const DeckStateVisualization: React.FC<DeckStateVisualizationProps> = ({ wand }) => {
  return (
    <div className="deck-state-visualization">
      <div className="deck-state-visualization__header">
        <h3>Deck State</h3>
        <div className="deck-state-visualization__status">
          {wand.isRecharging ? (
            <span className="status-recharging">
              Recharging ({wand.rechargeTimer.toFixed(2)}s)
            </span>
          ) : wand.castDelayTimer > 0 ? (
            <span className="status-delay">
              Cast Delay ({wand.castDelayTimer.toFixed(2)}s)
            </span>
          ) : (
            <span className="status-ready">Ready</span>
          )}
        </div>
      </div>

      <div className="deck-state-visualization__content">
        <div className="deck-pile">
          <div className="pile-header">
            <span className="pile-title">Deck</span>
            <span className="pile-count">{wand.deck.length}</span>
          </div>
          <div className="pile-content deck-content">
            {wand.deck.length === 0 ? (
              <div className="pile-empty">Empty</div>
            ) : (
              <div className="spell-stack">
                {wand.deck.slice(0, 5).map((spell, index) => (
                  <SpellCard key={index} spell={spell} isSmall />
                ))}
                {wand.deck.length > 5 && (
                  <div className="spell-stack-more">
                    +{wand.deck.length - 5} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="deck-pile">
          <div className="pile-header">
            <span className="pile-title">Hand</span>
            <span className="pile-count">{wand.hand.length}</span>
          </div>
          <div className="pile-content hand-content">
            {wand.hand.length === 0 ? (
              <div className="pile-empty">Empty</div>
            ) : (
              <div className="spell-hand">
                {wand.hand.map((spell, index) => (
                  <SpellCard key={index} spell={spell} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="deck-pile">
          <div className="pile-header">
            <span className="pile-title">Discard</span>
            <span className="pile-count">{wand.discard.length}</span>
          </div>
          <div className="pile-content discard-content">
            {wand.discard.length === 0 ? (
              <div className="pile-empty">Empty</div>
            ) : (
              <div className="spell-stack">
                {wand.discard.slice(-5).map((spell, index) => (
                  <SpellCard key={index} spell={spell} isSmall />
                ))}
                {wand.discard.length > 5 && (
                  <div className="spell-stack-more">
                    +{wand.discard.length - 5} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="deck-state-visualization__info">
        <div className="deck-info-item">
          <span className="info-label">Shuffle:</span>
          <span className="info-value">{wand.stats.shuffle ? 'On' : 'Off'}</span>
        </div>
        <div className="deck-info-item">
          <span className="info-label">Spells/Cast:</span>
          <span className="info-value">{wand.stats.spellsPerCast}</span>
        </div>
        <div className="deck-info-item">
          <span className="info-label">Current Mana:</span>
          <span className="info-value">{Math.round(wand.currentMana)}/{wand.stats.manaMax}</span>
        </div>
      </div>
    </div>
  );
};

export default DeckStateVisualization;