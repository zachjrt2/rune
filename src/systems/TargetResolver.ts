import { CombatEntity, CombatState, TargetingMode } from '../types/index.js';

export class TargetResolver {
  /**
   * Resolve targets based on targeting mode
   */
  resolveTargets(
    mode: TargetingMode,
    actor: CombatEntity,
    state: CombatState
  ): CombatEntity[] {
    switch (mode) {
      case 'SINGLE_ENEMY':
        return this.selectSingleEnemy(actor, state);
        
      case 'ALL_ENEMIES':
        return this.getAllEnemies(actor, state);
        
      case 'RANDOM_ENEMY':
        return this.selectRandomEnemy(actor, state);
        
      case 'SELF':
        return [actor];
        
      case 'ALL_ALLIES':
        return this.getAllAllies(actor, state);
        
      default:
        throw new Error(`Unknown targeting mode: ${mode}`);
    }
  }
  
  private selectSingleEnemy(actor: CombatEntity, state: CombatState): CombatEntity[] {
    if (actor.team === 'player') {
      // Player targets first alive enemy
      const alive = state.enemies.filter(e => e.isAlive);
      return alive.length > 0 ? [alive[0]] : [];
    } else {
      // Enemy targets player
      return state.player.isAlive ? [state.player] : [];
    }
  }
  
  private getAllEnemies(actor: CombatEntity, state: CombatState): CombatEntity[] {
    if (actor.team === 'player') {
      return state.enemies.filter(e => e.isAlive);
    } else {
      return [state.player].filter(e => e.isAlive);
    }
  }
  
  private selectRandomEnemy(actor: CombatEntity, state: CombatState): CombatEntity[] {
    if (actor.team === 'player') {
      const alive = state.enemies.filter(e => e.isAlive);
      if (alive.length === 0) return [];
      
      const randomIndex = Math.floor(Math.random() * alive.length);
      return [alive[randomIndex]];
    } else {
      return state.player.isAlive ? [state.player] : [];
    }
  }
  
  private getAllAllies(actor: CombatEntity, state: CombatState): CombatEntity[] {
    if (actor.team === 'player') {
      return [state.player].filter(e => e.isAlive);
    } else {
      return state.enemies.filter(e => e.isAlive);
    }
  }
}