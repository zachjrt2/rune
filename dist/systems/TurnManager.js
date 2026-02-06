import { ComboParser } from './ComboParser.js';
import { TargetResolver } from './TargetResolver.js';
import { DamageResolver } from './DamageResolver.js';
import { StatusManager } from './StatusManager.js';
import { EnemyAI } from './EnemyAI.js';
export class TurnManager {
    constructor(combos, statuses, enemyActions, fallbackAction) {
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
    executePlayerTurn(state) {
        // Parse combo from input buffer
        const combo = this.comboParser.parseCombo(state.inputBuffer);
        // Cache successful combo for replay
        if (combo.id !== this.fallbackAction.id) {
            state.lastSuccessfulCombo = [...combo.sequence];
        }
        // Log combo execution
        state.combatLog.push({
            timestamp: Date.now(),
            message: `Player used: ${combo.name}`,
            type: 'combo'
        });
        // Execute action
        this.executeAction(state.player, combo, state);
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
    executeEnemyTurns(state) {
        for (const enemy of state.enemies) {
            if (!enemy.isAlive)
                continue;
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
     * Execute turn end effects (status triggers, decay)
     */
    executeTurnEnd(state) {
        const allEntities = [
            state.player,
            ...state.enemies
        ];
        // Trigger TURN_END status effects
        for (const entity of allEntities) {
            if (!entity.isAlive)
                continue;
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
            if (!entity.isAlive)
                continue;
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
    executeAction(actor, action, state) {
        // Resolve targets
        const targets = this.targetResolver.resolveTargets(action.targeting, actor, state);
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
                const result = this.damageResolver.applyDamage(action.damage, action.element, actor, target, action.hitCount);
                state.combatLog.push({
                    timestamp: Date.now(),
                    message: `${target.name} took ${result.totalDamage} damage!`,
                    type: 'damage'
                });
                if (result.targetKilled) {
                    state.combatLog.push({
                        timestamp: Date.now(),
                        message: `${target.name} has died!`,
                        type: 'death'
                    });
                }
            }
            // Apply status effects
            for (const statusEffect of action.statusEffects) {
                const recipient = statusEffect.target === 'self' ? actor : target;
                this.statusManager.applyStatus(recipient, statusEffect.statusId, statusEffect.stacks);
                state.combatLog.push({
                    timestamp: Date.now(),
                    message: `${recipient.name} gained ${statusEffect.stacks} stacks of ${statusEffect.statusId}`,
                    type: 'status'
                });
            }
        }
    }
}
