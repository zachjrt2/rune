// Main exports for the combat system
// Controllers
export { CombatController } from './controllers/CombatController.js';
// Systems
export { ComboParser } from './systems/ComboParser.js';
export { TargetResolver } from './systems/TargetResolver.js';
export { DamageResolver } from './systems/DamageResolver.js';
export { StatusManager } from './systems/StatusManager.js';
export { EnemyAI } from './systems/EnemyAI.js';
export { InputBufferSystem } from './systems/InputBufferSystem.js';
export { TurnManager } from './systems/TurnManager.js';
// Types
export * from './types/index.js';
// Data
export { COMBO_DATABASE, FALLBACK_ACTION } from './data/combos.js';
export { STATUS_DATABASE } from './data/statuses.js';
export { ENEMY_ACTION_DATABASE } from './data/enemyActions.js';
// Examples
export { createInitialState, runExampleCombat, testComboParser } from './example.js';
