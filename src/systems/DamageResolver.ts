import { CombatEntity, ElementType, StatusDefinition, DamageResult } from '../types/index.js';

export class DamageResolver {
  private statusRegistry: Map<string, StatusDefinition>;
  
  constructor(statusDefinitions: StatusDefinition[]) {
    this.statusRegistry = new Map(
      statusDefinitions.map(s => [s.id, s])
    );
  }
  
  /**
   * Calculate and apply damage with all modifiers
   */
  applyDamage(
    baseDamage: number,
    element: ElementType | null,
    attacker: CombatEntity,
    target: CombatEntity,
    hitCount: number
  ): DamageResult {
    let totalDamage = 0;
    const breakdown: string[] = [];
    
    for (let hit = 0; hit < hitCount; hit++) {
      let damage = baseDamage;
      
      // Apply attacker's outgoing damage modifiers (Weak status)
      damage = this.applyOutgoingModifiers(damage, attacker);
      
      // Apply elemental affinity
      if (element) {
        damage = this.applyElementalModifier(damage, element, target);
      }
      
      // Apply target's incoming damage modifiers (Vulnerable status)
      damage = this.applyIncomingModifiers(damage, target);
      
      // Round to integer
      damage = Math.round(damage);
      
      // Apply to shield first, then HP
      const result = this.applyToEntity(damage, target);
      totalDamage += result.damageDealt;
      
      breakdown.push(
        `Hit ${hit + 1}: ${result.damageDealt} damage ` +
        `(${result.shieldDamage} to shield, ${result.hpDamage} to HP)`
      );
    }
    
    return {
      totalDamage,
      breakdown,
      targetKilled: target.currentHp <= 0
    };
  }
  
  private applyOutgoingModifiers(damage: number, attacker: CombatEntity): number {
    let multiplier = 1.0;
    
    const weakStatus = attacker.statuses.find(s => s.statusId === 'weak');
    if (weakStatus) {
      const statusDef = this.statusRegistry.get('weak');
      if (statusDef?.effectPerStack.outgoingDamageMultiplier) {
        const stackMultiplier = statusDef.effectPerStack.outgoingDamageMultiplier;
        // Each stack applies multiplicatively
        multiplier *= Math.pow(stackMultiplier, weakStatus.stacks);
      }
    }
    
    return damage * multiplier;
  }
  
  private applyElementalModifier(
    damage: number, 
    element: ElementType, 
    target: CombatEntity
  ): number {
    const affinity = target.elementalAffinities[element] || 1.0;
    return damage * affinity;
  }
  
  private applyIncomingModifiers(damage: number, target: CombatEntity): number {
    let multiplier = 1.0;
    
    const vulnerableStatus = target.statuses.find(s => s.statusId === 'vulnerable');
    if (vulnerableStatus) {
      const statusDef = this.statusRegistry.get('vulnerable');
      if (statusDef?.effectPerStack.damageMultiplier) {
        const stackMultiplier = statusDef.effectPerStack.damageMultiplier;
        // Each stack applies multiplicatively
        multiplier *= Math.pow(stackMultiplier, vulnerableStatus.stacks);
      }
    }
    
    return damage * multiplier;
  }
  
  private applyToEntity(
    damage: number, 
    target: CombatEntity
  ): { damageDealt: number; shieldDamage: number; hpDamage: number } {
    let remaining = damage;
    let shieldDamage = 0;
    let hpDamage = 0;
    
    // Shield absorbs damage first
    if (target.shield > 0) {
      shieldDamage = Math.min(remaining, target.shield);
      target.shield -= shieldDamage;
      remaining -= shieldDamage;
    }
    
    // Remaining damage goes to HP
    if (remaining > 0) {
      hpDamage = Math.min(remaining, target.currentHp);
      target.currentHp -= hpDamage;
    }
    
    // Check death
    if (target.currentHp <= 0) {
      target.currentHp = 0;
      target.isAlive = false;
    }
    
    return {
      damageDealt: shieldDamage + hpDamage,
      shieldDamage,
      hpDamage
    };
  }
}