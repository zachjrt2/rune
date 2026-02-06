export const ENEMY_ACTION_DATABASE = [
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
    }
];
