import { CombatEntity, StatusDefinition, TriggerTiming, StatusTriggerResult } from '../types/index.js';
export declare class StatusManager {
    private statusRegistry;
    constructor(statusDefinitions: StatusDefinition[]);
    /**
     * Apply status effect to an entity
     */
    applyStatus(entity: CombatEntity, statusId: string, stacks: number): void;
    /**
     * Trigger status effects at specified timing
     */
    triggerStatusEffects(entity: CombatEntity, timing: TriggerTiming): StatusTriggerResult[];
    private executeStatusEffect;
    /**
     * Decay status stacks at turn end
     */
    decayStatuses(entity: CombatEntity): void;
    /**
     * Check if entity is stunned
     */
    isStunned(entity: CombatEntity): boolean;
    /**
     * Get status definition
     */
    getStatusDefinition(statusId: string): StatusDefinition | undefined;
}
//# sourceMappingURL=StatusManager.d.ts.map