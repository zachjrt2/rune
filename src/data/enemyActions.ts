import { EnemyActionDefinition } from '../types/index.js';

export const ENEMY_ACTION_DATABASE: EnemyActionDefinition[] = [
  // ============= BASIC PHYSICAL ATTACKS =============
  {
    id: 'claw_swipe',
    name: 'Claw Swipe',
    damage: 15,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 1
  },
  {
    id: 'bite',
    name: 'Bite',
    damage: 20,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'bleed', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'tail_sweep',
    name: 'Tail Sweep',
    damage: 8,
    element: 'PHYSICAL',
    targeting: 'ALL_ENEMIES',
    statusEffects: [],
    hitCount: 1
  },
  {
    id: 'charge',
    name: 'Charge',
    damage: 25,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 1
  },
  
  // ============= ELEMENTAL ATTACKS =============
  {
    id: 'poison_spit',
    name: 'Poison Spit',
    damage: 10,
    element: 'POISON',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'poison', stacks: 3, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'fire_breath',
    name: 'Fire Breath',
    damage: 18,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'ice_beam',
    name: 'Ice Beam',
    damage: 22,
    element: 'ICE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'lightning_strike',
    name: 'Lightning Strike',
    damage: 30,
    element: 'LIGHTNING',
    targeting: 'RANDOM_ENEMY',
    statusEffects: [],
    hitCount: 1
  },
  
  // ============= DEBUFF ATTACKS =============
  {
    id: 'weakening_howl',
    name: 'Weakening Howl',
    damage: 5,
    element: null,
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'weak', stacks: 3, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'intimidate',
    name: 'Intimidate',
    damage: 0,
    element: null,
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= SELF BUFFS =============
  {
    id: 'harden',
    name: 'Harden',
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'shield', stacks: 2, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'regenerate',
    name: 'Regenerate',
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 4, target: 'self' }
    ],
    hitCount: 1
  },
  
  // ============= MULTI-HIT ATTACKS =============
  {
    id: 'fury_swipes',
    name: 'Fury Swipes',
    damage: 8,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 3
  },
  {
    id: 'double_strike',
    name: 'Double Strike',
    damage: 12,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 2
  },
  {
    id: 'rapid_strikes',
    name: 'Rapid Strikes',
    damage: 6,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 5
  },
  {
    id: 'combo_attack',
    name: 'Combo Attack',
    damage: 10,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'bleed', stacks: 1, target: 'target' }
    ],
    hitCount: 3
  },
  
  // ============= MORE ELEMENTAL ATTACKS =============
  {
    id: 'flame_burst',
    name: 'Flame Burst',
    damage: 25,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'burn', stacks: 3, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'infernal_breath',
    name: 'Infernal Breath',
    damage: 20,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 4, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'frost_bolt',
    name: 'Frost Bolt',
    damage: 18,
    element: 'ICE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'freezing_wave',
    name: 'Freezing Wave',
    damage: 15,
    element: 'ICE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' },
      { statusId: 'weak', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'thunder_bolt',
    name: 'Thunder Bolt',
    damage: 28,
    element: 'LIGHTNING',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'chain_bolt',
    name: 'Chain Bolt',
    damage: 15,
    element: 'LIGHTNING',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'venom_spray',
    name: 'Venom Spray',
    damage: 12,
    element: 'POISON',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'poison', stacks: 4, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'toxic_bite',
    name: 'Toxic Bite',
    damage: 22,
    element: 'POISON',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'poison', stacks: 5, target: 'target' },
      { statusId: 'weak', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE DEBUFF ATTACKS =============
  {
    id: 'cripple',
    name: 'Cripple',
    damage: 10,
    element: null,
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'weak', stacks: 4, target: 'target' },
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'demoralize',
    name: 'Demoralize',
    damage: 0,
    element: null,
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'weak', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'curse',
    name: 'Curse',
    damage: 5,
    element: null,
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 3, target: 'target' },
      { statusId: 'weak', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE SELF BUFFS =============
  {
    id: 'enrage',
    name: 'Enrage',
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 6, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'armor_up',
    name: 'Armor Up',
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'shield', stacks: 4, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'fortify_self',
    name: 'Fortify Self',
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'shield', stacks: 3, target: 'self' },
      { statusId: 'regen', stacks: 3, target: 'self' }
    ],
    hitCount: 1
  },
  
  // ============= SPECIAL ATTACKS =============
  {
    id: 'devour',
    name: 'Devour',
    damage: 35,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'regen', stacks: 5, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'soul_drain',
    name: 'Soul Drain',
    damage: 20,
    element: null,
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'regen', stacks: 4, target: 'self' },
      { statusId: 'weak', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'explosive_charge',
    name: 'Explosive Charge',
    damage: 40,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 3, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'ice_shards',
    name: 'Ice Shards',
    damage: 12,
    element: 'ICE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 3
  },
  {
    id: 'thunder_storm',
    name: 'Thunder Storm',
    damage: 18,
    element: 'LIGHTNING',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 1, target: 'target' }
    ],
    hitCount: 2
  }
];