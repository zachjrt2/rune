export const COMBO_DATABASE = [
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
    }
];
export const FALLBACK_ACTION = {
    id: 'weak_attack',
    name: 'Weak Attack',
    sequence: [],
    damage: 5,
    element: 'PHYSICAL',
    targeting: 'SINGLE_ENEMY',
    statusEffects: [],
    hitCount: 1
};
