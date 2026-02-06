import { CombatEntity, CombatState, TargetingMode } from '../types/index.js';
export declare class TargetResolver {
    /**
     * Resolve targets based on targeting mode
     */
    resolveTargets(mode: TargetingMode, actor: CombatEntity, state: CombatState): CombatEntity[];
    private selectSingleEnemy;
    private getAllEnemies;
    private selectRandomEnemy;
    private getAllAllies;
}
//# sourceMappingURL=TargetResolver.d.ts.map