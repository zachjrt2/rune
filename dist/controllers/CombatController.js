import { TurnManager } from '../systems/TurnManager.js';
import { InputBufferSystem } from '../systems/InputBufferSystem.js';
export class CombatController {
    constructor(initialState, combos, statuses, enemyActions, fallbackAction) {
        this.state = initialState;
        this.turnManager = new TurnManager(combos, statuses, enemyActions, fallbackAction);
        this.inputBuffer = new InputBufferSystem();
    }
    /**
     * Handle player input
     */
    addInput(direction) {
        if (this.state.turnPhase !== 'PLAYER_INPUT') {
            console.warn('Not in player input phase');
            return;
        }
        this.inputBuffer.addInput(direction);
        this.state.inputBuffer = this.inputBuffer.getBuffer();
    }
    /**
     * Remove last input from buffer
     */
    undoLastInput() {
        if (this.state.turnPhase !== 'PLAYER_INPUT') {
            console.warn('Not in player input phase');
            return;
        }
        this.inputBuffer.removeLastInput();
        this.state.inputBuffer = this.inputBuffer.getBuffer();
    }
    /**
     * Clear the input buffer
     */
    clearInput() {
        if (this.state.turnPhase !== 'PLAYER_INPUT') {
            console.warn('Not in player input phase');
            return;
        }
        this.inputBuffer.clearBuffer();
        this.state.inputBuffer = this.inputBuffer.getBuffer();
    }
    /**
     * Execute current buffer as player action
     */
    confirmAction() {
        if (this.state.turnPhase !== 'PLAYER_INPUT') {
            console.warn('Not in player input phase');
            return;
        }
        this.state.turnPhase = 'PLAYER_EXECUTING';
        this.state = this.turnManager.executePlayerTurn(this.state);
        this.inputBuffer.clearBuffer();
        // Auto-proceed to enemy turn
        this.progressTurn();
    }
    /**
     * Replay last successful combo
     */
    replayLastCombo() {
        if (!this.state.lastSuccessfulCombo) {
            console.warn('No combo to replay');
            return;
        }
        if (this.state.turnPhase !== 'PLAYER_INPUT') {
            console.warn('Not in player input phase');
            return;
        }
        this.inputBuffer.setBuffer(this.state.lastSuccessfulCombo);
        this.state.inputBuffer = this.inputBuffer.getBuffer();
        this.confirmAction();
    }
    /**
     * Progress through turn phases automatically
     */
    progressTurn() {
        while (this.state.turnPhase !== 'PLAYER_INPUT' &&
            this.state.turnPhase !== 'COMBAT_END') {
            switch (this.state.turnPhase) {
                case 'ENEMY_TURN':
                    this.state = this.turnManager.executeEnemyTurns(this.state);
                    break;
                case 'TURN_END':
                    this.state = this.turnManager.executeTurnEnd(this.state);
                    break;
            }
        }
    }
    /**
     * Get current combat state (immutable)
     */
    getState() {
        return this.state;
    }
    /**
     * Check if combat is over
     */
    isCombatOver() {
        return this.state.isVictory || this.state.isDefeat;
    }
    /**
     * Get combat result
     */
    getCombatResult() {
        if (this.state.isVictory)
            return 'victory';
        if (this.state.isDefeat)
            return 'defeat';
        return 'ongoing';
    }
}
