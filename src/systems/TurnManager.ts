import { CombatState, CombatEntity, EnemyEntity, ComboDefinition, EnemyActionDefinition, StatusDefinition } from '../types/index.js';
import { ComboParser } from './ComboParser.js';
import { TargetResolver } from './TargetResolver.js';
import { DamageResolver } from './DamageResolver.js';
import { StatusManager } from './StatusManager.js';
import { EnemyAI } from './EnemyAI.js';

export class TurnManager {
  private comboParser: ComboParser;
  private targetResolver: TargetResolver;
  private damageResolver: DamageResolver;
  private statusManager: StatusManager;
  private enemyAI: EnemyAI;
  private fallbackAction: ComboDefinition;
  
  constructor(
    combos: ComboDefinition[],
    statuses: StatusDefinition[],
    enemyActions: EnemyActionDefinition[],
    fallbackAction: ComboDefinition
  ) {
    this.fallbackAction = fallbackAction;
    this.comboParser = new ComboParser(combos, fallbackAction);
    this.targetResolver = new TargetResolver();
    this.damageResolver = new DamageResolver(statuses);
    this.statusManager = new StatusManager(statuses);
    this.enemyAI = new EnemyAI(enemyActions);
  }
  
  /**
   * Execute player turn
   */
  executePlayerTurn(state: CombatState): CombatState {
    // Parse ALL combos from input buffer
    const combos = this.comboParser.parseAllCombos(state.inputBuffer);
    
    // Cache the first successful combo for replay (if any)
    if (combos.length > 0 && combos[0].id !== this.fallbackAction.id) {
      state.lastSuccessfulCombo = [...combos[0].sequence];
    }
    
    // Execute all found combos
    const comboNames: string[] = [];
    for (const combo of combos) {
      // Track discovered combos
      if (combo.id !== this.fallbackAction.id && !state.discoveredCombos.includes(combo.id)) {
        state.discoveredCombos.push(combo.id);
        state.combatLog.push({
          timestamp: Date.now(),
          message: `✨ Discovered new combo: ${combo.name}!`,
          type: 'combo'
        });
      }
      
      // Log combo execution
      comboNames.push(combo.name);
      
      // Set animation data for player attack
      const targets = this.targetResolver.resolveTargets(combo.targeting, state.player, state);
      if (targets.length > 0 && combo.damage > 0) {
        state.pendingAnimation = {
          type: 'player_attack',
          element: combo.element,
          attackerId: state.player.id,
          targetIds: targets.map(t => t.id)
        };
      }
      
      // Execute action
      this.executeAction(state.player, combo, state);
    }
    
    // Log all combos used
    if (comboNames.length > 0) {
      const comboText = comboNames.length === 1 
        ? comboNames[0]
        : `${comboNames.length} combos: ${comboNames.join(', ')}`;
      state.combatLog.push({
        timestamp: Date.now(),
        message: `Player used: ${comboText}`,
        type: 'combo'
      });
    }
    
    // Clear input buffer
    state.inputBuffer = [];
    
    // Check victory condition
    if (state.enemies.every(e => !e.isAlive)) {
      state.isVictory = true;
      state.turnPhase = 'COMBAT_END';
      return state;
    }
    
    // Move to enemy turn
    state.turnPhase = 'ENEMY_TURN';
    return state;
  }
  
  /**
   * Execute enemy turns
   */
  executeEnemyTurns(state: CombatState): CombatState {
    for (const enemy of state.enemies) {
      if (!enemy.isAlive) continue;
      
      // Check if stunned
      if (this.statusManager.isStunned(enemy)) {
        state.combatLog.push({
          timestamp: Date.now(),
          message: `${enemy.name} is stunned and cannot act!`,
          type: 'status'
        });
        continue;
      }
      
      // Select action via AI
      const action = this.enemyAI.selectAction(enemy, state);
      
      // Log action
      state.combatLog.push({
        timestamp: Date.now(),
        message: `${enemy.name} used: ${action.name}`,
        type: 'action'
      });
      
      // Set animation data for enemy attack
      const targets = this.targetResolver.resolveTargets(action.targeting, enemy, state);
      if (targets.length > 0 && action.damage > 0) {
        state.pendingAnimation = {
          type: 'enemy_attack',
          element: action.element,
          attackerId: enemy.id,
          targetIds: targets.map(t => t.id),
          damage: action.damage
        };
      }
      
      // Execute action
      this.executeAction(enemy, action, state);
      
      // Check defeat condition
      if (!state.player.isAlive) {
        state.isDefeat = true;
        state.turnPhase = 'COMBAT_END';
        return state;
      }
    }
    
    // Move to turn end phase
    state.turnPhase = 'TURN_END';
    return state;
  }
  
  /**
   * Calculate experience needed for next level
   */
  private getExperienceForLevel(level: number): number {
    // Exponential growth: 50 * level^1.5
    return Math.floor(50 * Math.pow(level, 1.5));
  }

  /**
   * Award experience and handle level ups
   */
  private awardExperience(state: CombatState, amount: number): CombatState {
    if (!state.player.level) state.player.level = 1;
    if (state.player.experience === undefined) state.player.experience = 0;
    
    state.player.experience += amount;
    state.player.experienceToNextLevel = this.getExperienceForLevel(state.player.level);
    
    // Check for level up
    while (state.player.experience >= state.player.experienceToNextLevel) {
      state.player.experience -= state.player.experienceToNextLevel;
      const oldLevel = state.player.level;
      const oldMaxHp = state.player.maxHp;
      const oldCurrentHp = state.player.currentHp;
      const hpPercentage = oldMaxHp > 0 ? oldCurrentHp / oldMaxHp : 1;
      
      state.player.level++;
      state.player.experienceToNextLevel = this.getExperienceForLevel(state.player.level);
      
      // Update max input limit based on level
      state.maxInputLimit = this.calculateMaxInputLimit(state.player.level);
      
      // Update max HP based on level
      const newMaxHp = this.calculateMaxHp(state.player.level);
      const hpIncrease = newMaxHp - oldMaxHp;
      state.player.maxHp = newMaxHp;
      
      // Increase current HP proportionally (maintain same percentage, plus the HP increase)
      // This ensures the player gets the full benefit of leveling up
      state.player.currentHp = Math.min(
        newMaxHp,
        Math.floor(oldCurrentHp + hpIncrease * hpPercentage) + hpIncrease
      );
      
      state.combatLog.push({
        timestamp: Date.now(),
        message: `🎉 Level Up! You are now level ${state.player.level}! Max HP: ${oldMaxHp} → ${newMaxHp} (+${hpIncrease}), Max inputs: ${state.maxInputLimit}`,
        type: 'combo'
      });
    }
    
    return state;
  }

  /**
   * Calculate max input limit based on level
   * Level 1: 3 inputs, +1 every 2 levels
   */
  private calculateMaxInputLimit(level: number): number {
    return 3 + Math.floor((level - 1) / 2);
  }

  /**
   * Calculate max HP based on level
   * Level 1: 100 HP, +15 HP per level
   */
  private calculateMaxHp(level: number): number {
    return 100 + (level - 1) * 15;
  }

  /**
   * Award experience for a defeated enemy
   */
  private awardExperienceForEnemy(state: CombatState, enemy: EnemyEntity): CombatState {
    // Base experience based on enemy max HP (roughly 1 XP per 6 HP for better progression)
    const baseExperience = Math.max(1, Math.floor(enemy.maxHp / 6));
    
    // Calculate streak multiplier (1.0x for first battle, +0.1x per consecutive battle)
    const streakMultiplier = 1.0 + (state.battleStreak * 0.1);
    const experienceGained = Math.floor(baseExperience * streakMultiplier);
    const bonusXP = experienceGained - baseExperience;
    
    state = this.awardExperience(state, experienceGained);
    
    let message = `Defeated ${enemy.name}! Gained ${experienceGained} XP`;
    if (bonusXP > 0) {
      message += ` (+${bonusXP} streak bonus)`;
    }
    if (state.battleStreak > 0) {
      message += ` [${state.battleStreak + 1}x streak]`;
    }
    
    state.combatLog.push({
      timestamp: Date.now(),
      message: message,
      type: 'combo'
    });
    
    return state;
  }

  /**
   * Execute turn end effects (status triggers, decay)
   */
  executeTurnEnd(state: CombatState): CombatState {
    const allEntities: CombatEntity[] = [
      state.player,
      ...state.enemies
    ];
    
    // Trigger TURN_END status effects
    for (const entity of allEntities) {
      if (!entity.isAlive) continue;
      
      const results = this.statusManager.triggerStatusEffects(entity, 'TURN_END');
      
      for (const result of results) {
        state.combatLog.push({
          timestamp: Date.now(),
          message: `${entity.name}: ${result.effect}`,
          type: 'status'
        });
        
        if (result.killed) {
          state.combatLog.push({
            timestamp: Date.now(),
            message: `${entity.name} has died!`,
            type: 'death'
          });
        }
      }
    }
    
    // Decay all statuses
    for (const entity of allEntities) {
      this.statusManager.decayStatuses(entity);
    }
    
    // Check win/loss conditions
    if (state.enemies.every(e => !e.isAlive)) {
      state.isVictory = true;
      state.turnPhase = 'COMBAT_END';
      return state;
    }
    
    if (!state.player.isAlive) {
      state.isDefeat = true;
      state.turnPhase = 'COMBAT_END';
      return state;
    }
    
    // Start next turn
    state.turnCount++;
    state.turnPhase = 'PLAYER_INPUT';
    
    // Trigger TURN_START status effects
    for (const entity of allEntities) {
      if (!entity.isAlive) continue;
      
      const results = this.statusManager.triggerStatusEffects(entity, 'TURN_START');
      
      for (const result of results) {
        state.combatLog.push({
          timestamp: Date.now(),
          message: `${entity.name}: ${result.effect}`,
          type: 'status'
        });
      }
    }
    
    return state;
  }
  
  /**
   * Generic action execution (used by both player and enemies)
   */
  private executeAction(
    actor: CombatEntity,
    action: ComboDefinition | EnemyActionDefinition,
    state: CombatState
  ): void {
    // Resolve targets
    const targets = this.targetResolver.resolveTargets(
      action.targeting,
      actor,
      state
    );
    
    if (targets.length === 0) {
      state.combatLog.push({
        timestamp: Date.now(),
        message: `${action.name} had no valid targets!`,
        type: 'action'
      });
      return;
    }
    
    // Apply damage to each target
    for (const target of targets) {
      if (action.damage > 0) {
        const result = this.damageResolver.applyDamage(
          action.damage,
          action.element,
          actor,
          target,
          action.hitCount
        );
        
        // Update animation data with damage amount for hit animation
        if (state.pendingAnimation && state.pendingAnimation.targetIds.includes(target.id)) {
          state.pendingAnimation.damage = result.totalDamage;
        }
        
        state.combatLog.push({
          timestamp: Date.now(),
          message: `${target.name} took ${result.totalDamage} damage!`,
          type: 'damage'
        });
        
        if (result.targetKilled) {
          target.isAlive = false;
          state.combatLog.push({
            timestamp: Date.now(),
            message: `${target.name} has died!`,
            type: 'death'
          });
          
          // Award experience if it was an enemy
          if (target.team === 'enemy') {
            state = this.awardExperienceForEnemy(state, target as EnemyEntity);
          }
        }
      }
      
      // Apply status effects
      for (const statusEffect of action.statusEffects) {
        const recipient = statusEffect.target === 'self' ? actor : target;
        
        this.statusManager.applyStatus(
          recipient,
          statusEffect.statusId,
          statusEffect.stacks
        );
        
        state.combatLog.push({
          timestamp: Date.now(),
          message: `${recipient.name} gained ${statusEffect.stacks} stacks of ${statusEffect.statusId}`,
          type: 'status'
        });
      }
    }
  }
}