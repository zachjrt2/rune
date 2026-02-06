import { CombatState, DirectionInput, ComboDefinition, StatusDefinition, EnemyActionDefinition } from '../types/index.js';
export declare class CombatController {
    private state;
    private turnManager;
    private inputBuffer;
    constructor(initialState: CombatState, combos: ComboDefinition[], statuses: StatusDefinition[], enemyActions: EnemyActionDefinition[], fallbackAction: ComboDefinition);
    /**
     * Handle player input
     */
    addInput(direction: DirectionInput): void;
    /**
     * Remove last input from buffer
     */
    undoLastInput(): void;
    /**
     * Clear the input buffer
     */
    clearInput(): void;
    /**
     * Execute current buffer as player action
     */
    confirmAction(): void;
    /**
     * Replay last successful combo
     */
    replayLastCombo(): void;
    /**
     * Progress through turn phases automatically
     */
    private progressTurn;
    /**
     * Get current combat state (immutable)
     */
    getState(): Readonly<CombatState>;
    /**
     * Check if combat is over
     */
    isCombatOver(): boolean;
    /**
     * Get combat result
     */
    getCombatResult(): 'victory' | 'defeat' | 'ongoing';
}
//# sourceMappingURL=CombatController.d.ts.map