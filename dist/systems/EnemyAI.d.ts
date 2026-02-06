import { EnemyEntity, EnemyActionDefinition, AIPattern, CombatState } from '../types/index.js';
export declare class EnemyAI {
    private actionRegistry;
    constructor(actions: EnemyActionDefinition[]);
    /**
     * Select an action for the enemy to perform
     */
    selectAction(enemy: EnemyEntity, _state: CombatState): EnemyActionDefinition;
    /**
     * Pattern-based AI (optional enhancement)
     */
    selectActionByPattern(enemy: EnemyEntity, pattern: AIPattern, state: CombatState): EnemyActionDefinition;
    /**
     * Get action definition by ID
     */
    getAction(actionId: string): EnemyActionDefinition | undefined;
}
//# sourceMappingURL=EnemyAI.d.ts.map