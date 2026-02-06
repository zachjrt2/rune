import { CombatState, ComboDefinition, EnemyActionDefinition, StatusDefinition } from '../types/index.js';
export declare class TurnManager {
    private comboParser;
    private targetResolver;
    private damageResolver;
    private statusManager;
    private enemyAI;
    private fallbackAction;
    constructor(combos: ComboDefinition[], statuses: StatusDefinition[], enemyActions: EnemyActionDefinition[], fallbackAction: ComboDefinition);
    /**
     * Execute player turn
     */
    executePlayerTurn(state: CombatState): CombatState;
    /**
     * Execute enemy turns
     */
    executeEnemyTurns(state: CombatState): CombatState;
    /**
     * Execute turn end effects (status triggers, decay)
     */
    executeTurnEnd(state: CombatState): CombatState;
    /**
     * Generic action execution (used by both player and enemies)
     */
    private executeAction;
}
//# sourceMappingURL=TurnManager.d.ts.map