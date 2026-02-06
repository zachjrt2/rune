import { CombatEntity, StatusDefinition, TriggerTiming, StatusTriggerResult } from '../types/index.js';

export class StatusManager {
  private statusRegistry: Map<string, StatusDefinition>;
  
  constructor(statusDefinitions: StatusDefinition[]) {
    this.statusRegistry = new Map(
      statusDefinitions.map(s => [s.id, s])
    );
  }
  
  /**
   * Apply status effect to an entity
   */
  applyStatus(
    entity: CombatEntity, 
    statusId: string, 
    stacks: number
  ): void {
    const statusDef = this.statusRegistry.get(statusId);
    const existing = entity.statuses.find(s => s.statusId === statusId);
    
    if (existing) {
      // Add stacks, but cap at maxStacks if defined
      const maxStacks = statusDef?.maxStacks;
      if (maxStacks !== undefined) {
        existing.stacks = Math.min(maxStacks, existing.stacks + stacks);
      } else {
        existing.stacks += stacks;
      }
    } else {
      // Add new status, but cap at maxStacks if defined
      const maxStacks = statusDef?.maxStacks;
      const initialStacks = maxStacks !== undefined ? Math.min(maxStacks, stacks) : stacks;
      entity.statuses.push({ statusId, stacks: initialStacks });
    }
    
    // Special case: Shield status adds to shield pool immediately
    if (statusId === 'shield') {
      const statusDef = this.statusRegistry.get('shield');
      if (statusDef?.effectPerStack.shieldPerStack) {
        const shieldAmount = statusDef.effectPerStack.shieldPerStack * stacks;
        entity.shield += shieldAmount;
      }
    }
  }
  
  /**
   * Trigger status effects at specified timing
   */
  triggerStatusEffects(
    entity: CombatEntity,
    timing: TriggerTiming
  ): StatusTriggerResult[] {
    const results: StatusTriggerResult[] = [];
    
    for (const statusInstance of entity.statuses) {
      const statusDef = this.statusRegistry.get(statusInstance.statusId);
      if (!statusDef || statusDef.triggerTiming !== timing) {
        continue;
      }
      
      const result = this.executeStatusEffect(
        entity, 
        statusDef, 
        statusInstance.stacks
      );
      
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }
  
  private executeStatusEffect(
    entity: CombatEntity,
    statusDef: StatusDefinition,
    stacks: number
  ): StatusTriggerResult | null {
    const effect = statusDef.effectPerStack;
    
    // Damage over time
    if (effect.damagePerStack) {
      const damage = effect.damagePerStack * stacks;
      entity.currentHp = Math.max(0, entity.currentHp - damage);
      
      if (entity.currentHp <= 0) {
        entity.isAlive = false;
      }
      
      return {
        entityId: entity.id,
        statusName: statusDef.name,
        effect: `${damage} ${statusDef.name} damage`,
        killed: !entity.isAlive
      };
    }
    
    // Healing
    if (effect.healPerStack) {
      const heal = effect.healPerStack * stacks;
      const actualHeal = Math.min(heal, entity.maxHp - entity.currentHp);
      entity.currentHp += actualHeal;
      
      return {
        entityId: entity.id,
        statusName: statusDef.name,
        effect: `${actualHeal} HP restored`,
        killed: false
      };
    }
    
    // Stun check (prevents action)
    if (effect.preventAction && stacks > 0) {
      return {
        entityId: entity.id,
        statusName: statusDef.name,
        effect: `Action prevented`,
        killed: false
      };
    }
    
    return null;
  }
  
  /**
   * Decay status stacks at turn end
   */
  decayStatuses(entity: CombatEntity): void {
    entity.statuses = entity.statuses
      .map(status => {
        const statusDef = this.statusRegistry.get(status.statusId);
        if (!statusDef) return status;
        
        return {
          ...status,
          stacks: Math.max(0, status.stacks - statusDef.decayPerTurn)
        };
      })
      .filter(status => status.stacks > 0);
  }
  
  /**
   * Check if entity is stunned
   */
  isStunned(entity: CombatEntity): boolean {
    const stunStatus = entity.statuses.find(s => s.statusId === 'stun');
    return stunStatus !== undefined && stunStatus.stacks > 0;
  }
  
  /**
   * Get status definition
   */
  getStatusDefinition(statusId: string): StatusDefinition | undefined {
    return this.statusRegistry.get(statusId);
  }
}