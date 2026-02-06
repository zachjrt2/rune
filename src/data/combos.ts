import { ComboDefinition } from '../types/index.js';

export const COMBO_DATABASE: ComboDefinition[] = [
  // ============= FIRE COMBOS =============
  {
    id: 'fireball',
    name: 'Fireball',
    sequence: ['UP', 'UP', 'RIGHT'],
    damage: 30,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'burn', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'meteor_storm',
    name: 'Meteor Storm',
    sequence: ['UP', 'UP', 'RIGHT', 'DOWN', 'DOWN'],
    damage: 50,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 3, target: 'target' }
    ],
    hitCount: 3
  },
  {
    id: 'flame_blade',
    name: 'Flame Blade',
    sequence: ['UP', 'RIGHT', 'DOWN'],
    damage: 25,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 2
  },
  
  // ============= ICE COMBOS =============
  {
    id: 'ice_shard',
    name: 'Ice Shard',
    sequence: ['DOWN', 'DOWN', 'UP'],
    damage: 28,
    element: 'ICE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    sequence: ['DOWN', 'DOWN', 'UP', 'LEFT', 'LEFT'],
    damage: 45,
    element: 'ICE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 2
  },
  
  // ============= LIGHTNING COMBOS =============
  {
    id: 'lightning_bolt',
    name: 'Lightning Bolt',
    sequence: ['UP', 'DOWN', 'UP'],
    damage: 35,
    element: 'LIGHTNING',
    targeting: 'RANDOM_ENEMY',
    statusEffects: [],
    hitCount: 1
  },
  {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    sequence: ['UP', 'DOWN', 'UP', 'DOWN', 'UP'],
    damage: 20,
    element: 'LIGHTNING',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= POISON COMBOS =============
  {
    id: 'poison_dart',
    name: 'Poison Dart',
    sequence: ['LEFT', 'LEFT', 'RIGHT'],
    damage: 15,
    element: 'POISON',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'poison', stacks: 5, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'toxic_cloud',
    name: 'Toxic Cloud',
    sequence: ['LEFT', 'LEFT', 'RIGHT', 'UP', 'DOWN'],
    damage: 10,
    element: 'POISON',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'poison', stacks: 3, target: 'target' },
      { statusId: 'weak', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= SUPPORT COMBOS =============
  {
    id: 'heal',
    name: 'Regenerate',
    sequence: ['DOWN', 'DOWN', 'LEFT'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 5, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'shield',
    name: 'Magic Shield',
    sequence: ['LEFT', 'DOWN', 'RIGHT'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'shield', stacks: 3, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'berserker',
    name: 'Berserker Rage',
    sequence: ['RIGHT', 'RIGHT', 'RIGHT'],
    damage: 60,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 3, target: 'self' }
    ],
    hitCount: 1
  },
  
  // ============= PHYSICAL COMBOS =============
  {
    id: 'slash',
    name: 'Slash',
    sequence: ['RIGHT', 'LEFT'],
    damage: 20,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 1
  },
  {
    id: 'whirlwind',
    name: 'Whirlwind',
    sequence: ['RIGHT', 'LEFT', 'RIGHT', 'LEFT'],
    damage: 18,
    element: 'PHYSICAL',
    targeting: 'ALL_ENEMIES',
    statusEffects: [],
    hitCount: 2
  },
  {
    id: 'power_strike',
    name: 'Power Strike',
    sequence: ['UP', 'DOWN', 'DOWN'],
    damage: 40,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'combo_strike',
    name: 'Combo Strike',
    sequence: ['RIGHT', 'UP', 'LEFT', 'DOWN'],
    damage: 15,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 4
  },
  {
    id: 'crushing_blow',
    name: 'Crushing Blow',
    sequence: ['DOWN', 'DOWN', 'DOWN', 'UP'],
    damage: 55,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE FIRE COMBOS =============
  {
    id: 'inferno',
    name: 'Inferno',
    sequence: ['UP', 'RIGHT', 'UP', 'RIGHT'],
    damage: 35,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'burn', stacks: 4, target: 'target' }
    ],
    hitCount: 2
  },
  {
    id: 'flame_wall',
    name: 'Flame Wall',
    sequence: ['LEFT', 'UP', 'RIGHT', 'UP'],
    damage: 20,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'phoenix_strike',
    name: 'Phoenix Strike',
    sequence: ['UP', 'UP', 'UP', 'DOWN', 'DOWN'],
    damage: 65,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'burn', stacks: 5, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE ICE COMBOS =============
  {
    id: 'ice_lance',
    name: 'Ice Lance',
    sequence: ['DOWN', 'UP', 'UP'],
    damage: 32,
    element: 'ICE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'frost_nova',
    name: 'Frost Nova',
    sequence: ['LEFT', 'LEFT', 'RIGHT', 'RIGHT'],
    damage: 25,
    element: 'ICE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'stun', stacks: 1, target: 'target' },
      { statusId: 'weak', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'glacial_spike',
    name: 'Glacial Spike',
    sequence: ['DOWN', 'UP', 'DOWN', 'UP', 'DOWN'],
    damage: 60,
    element: 'ICE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'stun', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE LIGHTNING COMBOS =============
  {
    id: 'thunder_clap',
    name: 'Thunder Clap',
    sequence: ['UP', 'DOWN', 'DOWN', 'UP'],
    damage: 28,
    element: 'LIGHTNING',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'storm_bolt',
    name: 'Storm Bolt',
    sequence: ['LEFT', 'RIGHT', 'UP', 'DOWN'],
    damage: 40,
    element: 'LIGHTNING',
    targeting: 'RANDOM_ENEMY',
    statusEffects: [],
    hitCount: 2
  },
  {
    id: 'overcharge',
    name: 'Overcharge',
    sequence: ['UP', 'DOWN', 'UP', 'DOWN', 'UP', 'DOWN'],
    damage: 70,
    element: 'LIGHTNING',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 3, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE POISON COMBOS =============
  {
    id: 'venom_strike',
    name: 'Venom Strike',
    sequence: ['LEFT', 'UP', 'LEFT'],
    damage: 18,
    element: 'POISON',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'poison', stacks: 6, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'plague_cloud',
    name: 'Plague Cloud',
    sequence: ['LEFT', 'LEFT', 'LEFT', 'RIGHT'],
    damage: 12,
    element: 'POISON',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'poison', stacks: 4, target: 'target' },
      { statusId: 'weak', stacks: 1, target: 'target' }
    ],
    hitCount: 1
  },
  {
    id: 'death_touch',
    name: 'Death Touch',
    sequence: ['LEFT', 'DOWN', 'LEFT', 'DOWN', 'LEFT'],
    damage: 25,
    element: 'POISON',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'poison', stacks: 8, target: 'target' },
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  },
  
  // ============= MORE SUPPORT COMBOS =============
  {
    id: 'greater_heal',
    name: 'Greater Heal',
    sequence: ['DOWN', 'DOWN', 'DOWN', 'LEFT'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 8, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'fortify',
    name: 'Fortify',
    sequence: ['LEFT', 'LEFT', 'DOWN', 'RIGHT'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'shield', stacks: 5, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'battle_fury',
    name: 'Battle Fury',
    sequence: ['RIGHT', 'UP', 'RIGHT', 'UP'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 3, target: 'self' },
      { statusId: 'shield', stacks: 2, target: 'self' }
    ],
    hitCount: 1
  },
  {
    id: 'empower',
    name: 'Empower',
    sequence: ['UP', 'LEFT', 'DOWN', 'RIGHT', 'UP'],
    damage: 0,
    element: null,
    targeting: 'SELF',
    statusEffects: [
      { statusId: 'regen', stacks: 5, target: 'self' },
      { statusId: 'shield', stacks: 3, target: 'self' }
    ],
    hitCount: 1
  },
  
  // ============= HYBRID COMBOS =============
  {
    id: 'flame_storm',
    name: 'Flame Storm',
    sequence: ['UP', 'RIGHT', 'DOWN', 'LEFT', 'UP'],
    damage: 45,
    element: 'FIRE',
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'burn', stacks: 3, target: 'target' },
      { statusId: 'vulnerable', stacks: 1, target: 'target' }
    ],
    hitCount: 2
  },
  {
    id: 'frost_fire',
    name: 'Frost Fire',
    sequence: ['UP', 'UP', 'DOWN', 'DOWN', 'LEFT'],
    damage: 38,
    element: 'FIRE',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [
      { statusId: 'burn', stacks: 2, target: 'target' },
      { statusId: 'stun', stacks: 1, target: 'target' }
    ],
    hitCount: 2
  },
  {
    id: 'elemental_blast',
    name: 'Elemental Blast',
    sequence: ['UP', 'DOWN', 'LEFT', 'RIGHT', 'UP', 'DOWN'],
    damage: 55,
    element: null,
    targeting: 'ALL_ENEMIES',
    statusEffects: [
      { statusId: 'vulnerable', stacks: 2, target: 'target' }
    ],
    hitCount: 1
  }
];

export const FALLBACK_ACTION: ComboDefinition = {
  id: 'weak_attack',
  name: 'Weak Attack',
  sequence: [],
  damage: 12,
  element: 'PHYSICAL',
  targeting: 'SINGLE_ENEMY',
  statusEffects: [],
  hitCount: 1
};