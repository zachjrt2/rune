import { StatusDefinition } from '../types/index.js';

export const STATUS_DATABASE: StatusDefinition[] = [
  // ============= DAMAGE OVER TIME =============
  {
    id: 'burn',
    name: 'Burn',
    type: 'DAMAGE_OVER_TIME',
    triggerTiming: 'TURN_END',
    effectPerStack: { damagePerStack: 3 },
    decayPerTurn: 1,
    maxStacks: 5
  },
  {
    id: 'poison',
    name: 'Poison',
    type: 'DAMAGE_OVER_TIME',
    triggerTiming: 'TURN_START',
    effectPerStack: { damagePerStack: 5 },
    decayPerTurn: 1,
    maxStacks: 10
  },
  {
    id: 'bleed',
    name: 'Bleed',
    type: 'DAMAGE_OVER_TIME',
    triggerTiming: 'TURN_END',
    effectPerStack: { damagePerStack: 4 },
    decayPerTurn: 2,
    maxStacks: 8
  },
  
  // ============= BUFFS =============
  {
    id: 'regen',
    name: 'Regeneration',
    type: 'BUFF',
    triggerTiming: 'TURN_START',
    effectPerStack: { healPerStack: 4 },
    decayPerTurn: 1
  },
  {
    id: 'shield',
    name: 'Shield',
    type: 'BUFF',
    triggerTiming: 'PASSIVE',
    effectPerStack: { shieldPerStack: 10 },
    decayPerTurn: 0
  },
  
  // ============= DEBUFFS =============
  {
    id: 'vulnerable',
    name: 'Vulnerable',
    type: 'DEBUFF',
    triggerTiming: 'ON_HIT_TAKEN',
    effectPerStack: { damageMultiplier: 1.2 },
    decayPerTurn: 1,
    maxStacks: 5
  },
  {
    id: 'weak',
    name: 'Weak',
    type: 'DEBUFF',
    triggerTiming: 'ON_HIT_DEALT',
    effectPerStack: { outgoingDamageMultiplier: 0.9 },
    decayPerTurn: 1,
    maxStacks: 5
  },
  
  // ============= CONTROL =============
  {
    id: 'stun',
    name: 'Stun',
    type: 'CONTROL',
    triggerTiming: 'PASSIVE',
    effectPerStack: { preventAction: true },
    decayPerTurn: 1,
    maxStacks: 3
  }
];