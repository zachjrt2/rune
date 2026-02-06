import { EnemyEntity, EnemyActionDefinition, AIPattern, CombatState } from '../types/index.js';

export class EnemyAI {
  private actionRegistry: Map<string, EnemyActionDefinition>;
  
  constructor(actions: EnemyActionDefinition[]) {
    this.actionRegistry = new Map(
      actions.map(a => [a.id, a])
    );
  }
  
  /**
   * Select an action for the enemy to perform
   */
  selectAction(
    enemy: EnemyEntity,
    _state: CombatState
  ): EnemyActionDefinition {
    // Get available actions
    const availableActions = enemy.actionPool
      .map(id => this.actionRegistry.get(id))
      .filter((a): a is EnemyActionDefinition => a !== undefined);
    
    if (availableActions.length === 0) {
      throw new Error(`Enemy ${enemy.id} has no valid actions!`);
    }
    
    // Simple random selection (can be extended with patterns)
    const randomIndex = Math.floor(Math.random() * availableActions.length);
    return availableActions[randomIndex];
  }
  
  /**
   * Pattern-based AI (optional enhancement)
   */
  selectActionByPattern(
    enemy: EnemyEntity,
    pattern: AIPattern,
    state: CombatState
  ): EnemyActionDefinition {
    const actions = enemy.actionPool
      .map(id => this.actionRegistry.get(id))
      .filter((a): a is EnemyActionDefinition => a !== undefined);
    
    if (actions.length === 0) {
      throw new Error(`Enemy ${enemy.id} has no valid actions!`);
    }
    
    switch (pattern.strategy) {
      case 'RANDOM':
        return actions[Math.floor(Math.random() * actions.length)];
        
      case 'SEQUENTIAL':
        // Cycle through actions based on turn count
        const index = state.turnCount % actions.length;
        return actions[index];
        
      case 'CONDITIONAL':
        // Example: use defensive action if low HP
        const hpPercent = enemy.currentHp / enemy.maxHp;
        if (hpPercent < 0.3) {
          // Prefer defensive/healing actions
          const defensiveAction = actions.find(a => 
            a.statusEffects.some(s => s.statusId === 'shield' || s.statusId === 'regen')
          );
          return defensiveAction || actions[0];
        }
        return actions[0];
        
      default:
        return actions[0];
    }
  }
  
  /**
   * Get action definition by ID
   */
  getAction(actionId: string): EnemyActionDefinition | undefined {
    return this.actionRegistry.get(actionId);
  }
}