import { CombatEntity, ElementType, StatusDefinition, DamageResult } from '../types/index.js';
export declare class DamageResolver {
    private statusRegistry;
    constructor(statusDefinitions: StatusDefinition[]);
    /**
     * Calculate and apply damage with all modifiers
     */
    applyDamage(baseDamage: number, element: ElementType | null, attacker: CombatEntity, target: CombatEntity, hitCount: number): DamageResult;
    private applyOutgoingModifiers;
    private applyElementalModifier;
    private applyIncomingModifiers;
    private applyToEntity;
}
//# sourceMappingURL=DamageResolver.d.ts.map