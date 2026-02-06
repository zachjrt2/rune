import { CombatState, DirectionInput, ComboDefinition, StatusDefinition, EnemyActionDefinition } from '../types/index.js';
import { TurnManager } from '../systems/TurnManager.js';
import { InputBufferSystem } from '../systems/InputBufferSystem.js';

export class CombatController {
  private state: CombatState;
  private turnManager: TurnManager;
  private inputBuffer: InputBufferSystem;
  
  constructor(
    initialState: CombatState,
    combos: ComboDefinition[],
    statuses: StatusDefinition[],
    enemyActions: EnemyActionDefinition[],
    fallbackAction: ComboDefinition
  ) {
    this.state = initialState;
    // Initialize maxInputLimit if not set
    if (!this.state.maxInputLimit) {
      const level = this.state.player.level || 1;
      this.state.maxInputLimit = 3 + Math.floor((level - 1) / 2);
    }
    this.turnManager = new TurnManager(combos, statuses, enemyActions, fallbackAction);
    this.inputBuffer = new InputBufferSystem(this.state.maxInputLimit);
  }
  
  /**
   * Handle player input
   * Returns true if input was added, false if limit reached
   */
  addInput(direction: DirectionInput): boolean {
    if (this.state.turnPhase !== 'PLAYER_INPUT') {
      console.warn('Not in player input phase');
      return false;
    }
    
    // Update buffer size if limit changed
    if (this.inputBuffer.getMaxBufferSize() !== this.state.maxInputLimit) {
      this.inputBuffer.setMaxBufferSize(this.state.maxInputLimit);
    }
    
    const added = this.inputBuffer.addInput(direction);
    this.state.inputBuffer = this.inputBuffer.getBuffer();
    return added;
  }
  
  /**
   * Remove last input from buffer
   */
  undoLastInput(): void {
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
  clearInput(): void {
    if (this.state.turnPhase !== 'PLAYER_INPUT') {
      console.warn('Not in player input phase');
      return;
    }
    
    this.inputBuffer.clearBuffer();
    this.state.inputBuffer = this.inputBuffer.getBuffer();
  }
  
  /**
   * Execute current buffer as player action
   * Does NOT auto-progress - UI should call progressTurn() after animations
   */
  confirmAction(): void {
    if (this.state.turnPhase !== 'PLAYER_INPUT') {
      console.warn('Not in player input phase');
      return;
    }
    
    this.state.turnPhase = 'PLAYER_EXECUTING';
    this.state = this.turnManager.executePlayerTurn(this.state);
    this.inputBuffer.clearBuffer();
    
    // Set phase to ENEMY_TURN but don't auto-progress
    // UI will call progressTurn() after animations complete
    if (this.state.turnPhase !== 'COMBAT_END') {
      this.state.turnPhase = 'ENEMY_TURN';
    }
  }
  
  /**
   * Replay last successful combo
   */
  replayLastCombo(): void {
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
   * Progress through turn phases
   * Can be called by UI after animations complete
   */
  progressTurn(): void {
    while (this.state.turnPhase !== 'PLAYER_INPUT' && 
           this.state.turnPhase !== 'COMBAT_END') {
      
      switch (this.state.turnPhase) {
        case 'ENEMY_TURN':
          this.state = this.turnManager.executeEnemyTurns(this.state);
          // Update input buffer size if limit changed
          if (this.inputBuffer.getMaxBufferSize() !== this.state.maxInputLimit) {
            this.inputBuffer.setMaxBufferSize(this.state.maxInputLimit);
          }
          // After enemy turn, check if we need to process turn end
          if (this.state.turnPhase === 'TURN_END') {
            continue; // Process turn end in same loop
          }
          break;
          
        case 'TURN_END':
          this.state = this.turnManager.executeTurnEnd(this.state);
          // Update input buffer size if limit changed
          if (this.inputBuffer.getMaxBufferSize() !== this.state.maxInputLimit) {
            this.inputBuffer.setMaxBufferSize(this.state.maxInputLimit);
          }
          break;
      }
    }
  }
  
  /**
   * Get current combat state (immutable)
   */
  getState(): Readonly<CombatState> {
    return this.state;
  }
  
  /**
   * Check if combat is over
   */
  isCombatOver(): boolean {
    return this.state.isVictory || this.state.isDefeat;
  }
  
  /**
   * Get combat result
   */
  getCombatResult(): 'victory' | 'defeat' | 'ongoing' {
    if (this.state.isVictory) return 'victory';
    if (this.state.isDefeat) return 'defeat';
    return 'ongoing';
  }
}