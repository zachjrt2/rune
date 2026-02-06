// ============= CORE TYPES =============

export type DirectionInput = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ElementType = 'FIRE' | 'ICE' | 'LIGHTNING' | 'POISON' | 'PHYSICAL';

export type TargetingMode = 
  | 'SINGLE_ENEMY'
  | 'ALL_ENEMIES'
  | 'RANDOM_ENEMY'
  | 'SELF'
  | 'ALL_ALLIES';

export type TurnPhase = 
  | 'PLAYER_INPUT'
  | 'PLAYER_EXECUTING'
  | 'ENEMY_TURN'
  | 'TURN_END'
  | 'COMBAT_END';

export type StatusType = 
  | 'DAMAGE_OVER_TIME'
  | 'BUFF'
  | 'DEBUFF'
  | 'CONTROL';

export type TriggerTiming = 
  | 'TURN_START'
  | 'TURN_END'
  | 'ON_HIT_DEALT'
  | 'ON_HIT_TAKEN'
  | 'PASSIVE';

export type AIStrategy = 
  | 'RANDOM'
  | 'SEQUENTIAL'
  | 'PRIORITY_BASED'
  | 'CONDITIONAL';

// ============= ENTITY MODELS =============

export interface ElementalAffinities {
  [element: string]: number;
}

export interface StatusInstance {
  statusId: string;
  stacks: number;
}

export interface CombatEntity {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  shield: number;
  statuses: StatusInstance[];
  elementalAffinities: ElementalAffinities;
  isAlive: boolean;
  team: 'player' | 'enemy';
}

export interface PlayerEntity extends CombatEntity {
  team: 'player';
  level?: number;
  experience?: number;
  experienceToNextLevel?: number;
}

export interface EnemyEntity extends CombatEntity {
  team: 'enemy';
  aiPatternId: string;
  actionPool: string[];
}

// ============= COMBAT STATE =============

export interface CombatLogEntry {
  timestamp: number;
  message: string;
  type: 'damage' | 'status' | 'death' | 'combo' | 'action';
}

export interface AnimationData {
  type: 'player_attack' | 'enemy_attack' | 'hit';
  element: ElementType | null;
  attackerId?: string; // ID of the entity performing the attack
  targetIds: string[];
  damage?: number;
}

export interface CombatState {
  player: PlayerEntity;
  enemies: EnemyEntity[];
  turnPhase: TurnPhase;
  turnCount: number;
  inputBuffer: DirectionInput[];
  maxInputLimit: number;
  lastSuccessfulCombo: DirectionInput[] | null;
  discoveredCombos: string[]; // Array of combo IDs that have been discovered
  battleStreak: number; // Number of consecutive battles without resting
  combatLog: CombatLogEntry[];
  isVictory: boolean;
  isDefeat: boolean;
  pendingAnimation: AnimationData | null; // Animation to play on next render
}

// ============= COMBO DEFINITIONS =============

export interface StatusEffect {
  statusId: string;
  stacks: number;
  target: 'self' | 'target';
}

export interface ComboDefinition {
  id: string;
  name: string;
  sequence: DirectionInput[];
  damage: number;
  element: ElementType | null;
  targeting: TargetingMode;
  statusEffects: StatusEffect[];
  hitCount: number;
}

// ============= STATUS DEFINITIONS =============

export interface StatusEffectDefinition {
  damagePerStack?: number;
  healPerStack?: number;
  shieldPerStack?: number;
  damageMultiplier?: number;
  outgoingDamageMultiplier?: number;
  preventAction?: boolean;
}

export interface StatusDefinition {
  id: string;
  name: string;
  type: StatusType;
  triggerTiming: TriggerTiming;
  effectPerStack: StatusEffectDefinition;
  decayPerTurn: number;
  maxStacks?: number; // Maximum stacks allowed (undefined = no limit)
}

// ============= ENEMY ACTIONS =============

export interface EnemyActionDefinition {
  id: string;
  name: string;
  damage: number;
  element: ElementType | null;
  targeting: TargetingMode;
  statusEffects: StatusEffect[];
  hitCount: number;
}

export interface AIPattern {
  id: string;
  strategy: AIStrategy;
}

// ============= RESULTS =============

export interface DamageResult {
  totalDamage: number;
  breakdown: string[];
  targetKilled: boolean;
}

export interface StatusTriggerResult {
  entityId: string;
  statusName: string;
  effect: string;
  killed: boolean;
}