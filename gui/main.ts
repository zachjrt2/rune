import { CombatController } from '../src/controllers/CombatController.js';
import { CombatState, PlayerEntity, EnemyEntity, DirectionInput, AnimationData, ElementType } from '../src/types/index.js';
import { COMBO_DATABASE, FALLBACK_ACTION } from '../src/data/combos.js';
import { STATUS_DATABASE } from '../src/data/statuses.js';
import { ENEMY_ACTION_DATABASE } from '../src/data/enemyActions.js';
import { ComboParser } from '../src/systems/ComboParser.js';

/**
 * Enemy templates for encounter generation
 */
const ENEMY_TEMPLATES: Omit<EnemyEntity, 'id' | 'currentHp'>[] = [
  {
    name: 'Goblin',
    maxHp: 30,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.5,
      ICE: 1.0,
      LIGHTNING: 1.0,
      POISON: 0.5,
      PHYSICAL: 1.0
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['claw_swipe', 'bite']
  },
  {
    name: 'Toxic Slime',
    maxHp: 25,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 2.0,
      ICE: 0.5,
      LIGHTNING: 1.0,
      POISON: 0.0,
      PHYSICAL: 0.8
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['poison_spit', 'tail_sweep']
  },
  {
    name: 'Skeleton',
    maxHp: 35,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.5,
      ICE: 0.8,
      LIGHTNING: 1.0,
      POISON: 0.0,
      PHYSICAL: 0.7
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['claw_swipe', 'double_strike']
  },
  {
    name: 'Orc Warrior',
    maxHp: 50,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.2,
      ICE: 1.0,
      LIGHTNING: 1.3,
      POISON: 0.7,
      PHYSICAL: 0.9
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['charge', 'fury_swipes']
  },
  {
    name: 'Dark Wizard',
    maxHp: 40,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.0,
      ICE: 1.0,
      LIGHTNING: 1.4,
      POISON: 1.0,
      PHYSICAL: 1.3
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['lightning_strike', 'curse']
  },
  {
    name: 'Forest Troll',
    maxHp: 70,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.6,
      ICE: 1.0,
      LIGHTNING: 1.0,
      POISON: 0.6,
      PHYSICAL: 0.8
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['charge', 'regenerate']
  },
  {
    name: 'Fire Drake',
    maxHp: 90,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 0.3,
      ICE: 1.8,
      LIGHTNING: 1.0,
      POISON: 1.2,
      PHYSICAL: 0.9
    },
    isAlive: true,
    team: 'enemy',
    aiPatternId: 'basic',
    actionPool: ['fire_breath', 'flame_burst']
  }
];

/**
 * Generate encounter based on player level
 * Max 2 enemies, scales with level
 */
function generateEncounter(playerLevel: number): EnemyEntity[] {
  // Scale enemy HP and stats based on level (12% per level)
  const levelMultiplier = 1 + (playerLevel - 1) * 0.12;
  
  // Determine number of enemies (1-2, more likely 2 at higher levels)
  const numEnemies = playerLevel === 1 ? 1 : Math.min(2, 1 + Math.floor(Math.random() * 2));
  
  // Select random enemies from templates
  const selected: EnemyEntity[] = [];
  const available = [...ENEMY_TEMPLATES];
  
  for (let i = 0; i < numEnemies; i++) {
    if (available.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const template = available.splice(randomIndex, 1)[0];
    
    const scaledHp = Math.floor(template.maxHp * levelMultiplier);
    
    selected.push({
      ...template,
      id: `${template.name.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`,
      maxHp: scaledHp,
      currentHp: scaledHp
    });
  }
  
  return selected;
}

/**
 * Calculate max HP based on level
 * Level 1: 100 HP, +15 HP per level
 */
function calculateMaxHp(level: number): number {
  return 100 + (level - 1) * 15;
}

/**
 * Load player state from localStorage
 */
function loadPlayerState(): PlayerEntity {
  const saved = localStorage.getItem('playerState');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const level = parsed.level || 1;
      
      // Debug: Log loaded state
      console.log('Loading player state:', {
        level: parsed.level,
        currentHp: parsed.currentHp,
        maxHp: parsed.maxHp,
        isAlive: parsed.isAlive,
        statuses: parsed.statuses?.length || 0,
        shield: parsed.shield
      });
      
      // Recalculate maxHp based on level to ensure consistency
      const correctMaxHp = calculateMaxHp(level);
      const oldMaxHp = parsed.maxHp || correctMaxHp;
      const hpPercentage = oldMaxHp > 0 ? (parsed.currentHp || oldMaxHp) / oldMaxHp : 1;
      
      parsed.maxHp = correctMaxHp;
      // Ensure player is alive and restore HP if needed (aggressive reset)
      parsed.isAlive = true;
      parsed.currentHp = parsed.maxHp; // Always restore to full HP on load
      
      // Reset statuses and shield for new battle
      parsed.statuses = [];
      parsed.shield = 0;
      
      // Clear any defeated state flags
      delete parsed.isDefeat;
      delete parsed.isVictory;
      
      return parsed;
    } catch (e) {
      console.warn('Failed to load player state:', e);
    }
  }
  
  // Default player state
  return {
    id: 'player',
    name: 'Hero',
    maxHp: 100,
    currentHp: 100,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.0,
      ICE: 1.0,
      LIGHTNING: 0.5,
      POISON: 1.0,
      PHYSICAL: 1.0
    },
    isAlive: true,
    team: 'player',
    level: 1,
    experience: 0,
    experienceToNextLevel: 50
  };
}

/**
 * Save player state to localStorage
 */
function savePlayerState(player: PlayerEntity): void {
  localStorage.setItem('playerState', JSON.stringify(player));
}

/**
 * Load discovered combos from localStorage
 */
function loadDiscoveredCombos(): string[] {
  const saved = localStorage.getItem('discoveredCombos');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load discovered combos:', e);
    }
  }
  return [];
}

/**
 * Save discovered combos to localStorage
 */
function saveDiscoveredCombos(combos: string[]): void {
  localStorage.setItem('discoveredCombos', JSON.stringify(combos));
}

/**
 * Load battle streak from localStorage
 */
function loadBattleStreak(): number {
  const saved = localStorage.getItem('battleStreak');
  if (saved) {
    try {
      return parseInt(saved, 10) || 0;
    } catch (e) {
      console.warn('Failed to load battle streak:', e);
    }
  }
  return 0;
}

/**
 * Save battle streak to localStorage
 */
function saveBattleStreak(streak: number): void {
  localStorage.setItem('battleStreak', streak.toString());
}

/**
 * Create initial combat state with player and enemies
 */
function createInitialState(): CombatState {
  const player = loadPlayerState();

  // Ensure player is in a clean state for new battle
  player.isAlive = true;
  player.currentHp = player.maxHp; // Always full HP for new battle
  player.statuses = [];
  player.shield = 0;
  
  // Save the cleaned state to prevent any corruption
  savePlayerState(player);

  const enemies: EnemyEntity[] = generateEncounter(player.level || 1);

  // Calculate initial max input limit based on level (3 base, +1 every 2 levels)
  const initialMaxInputLimit = 3 + Math.floor(((player.level || 1) - 1) / 2);

  return {
    player,
    enemies,
    turnPhase: 'PLAYER_INPUT',
    turnCount: 1,
    inputBuffer: [],
    maxInputLimit: initialMaxInputLimit,
    lastSuccessfulCombo: null,
    discoveredCombos: loadDiscoveredCombos(),
    battleStreak: loadBattleStreak(),
    combatLog: [],
    isVictory: false,
    isDefeat: false,
    pendingAnimation: null
  };
}

// Global controller reference for new battle function
let globalController: CombatController | null = null;
let globalUI: CombatUI | null = null;

/**
 * Rest and heal - restore HP and reset battle streak
 */
function restAndHeal() {
  // Load player state and restore HP
  const player = loadPlayerState();
  player.currentHp = player.maxHp;
  player.statuses = [];
  player.shield = 0;
  savePlayerState(player);
  
  // Reset battle streak
  saveBattleStreak(0);
  
  // Hide victory banner
  const victoryBanner = document.getElementById('victoryBanner');
  if (victoryBanner) victoryBanner.classList.remove('show');
  
  // Start new battle
  startNewBattle();
}

/**
 * Continue fighting - start new battle immediately (increases streak)
 */
function continueFighting() {
  // Increase battle streak
  const currentStreak = loadBattleStreak();
  saveBattleStreak(currentStreak + 1);
  
  // Hide victory banner
  const victoryBanner = document.getElementById('victoryBanner');
  if (victoryBanner) victoryBanner.classList.remove('show');
  
  // Start new battle with increased streak
  startNewBattle();
}

/**
 * Start a new battle (preserving player progress)
 */
function startNewBattle() {
  // Hide victory/defeat banners
  const victoryBanner = document.getElementById('victoryBanner');
  const defeatBanner = document.getElementById('defeatBanner');
  if (victoryBanner) victoryBanner.classList.remove('show');
  if (defeatBanner) defeatBanner.classList.remove('show');
  
  // Clean up any existing UI instance to prevent stacking
  if (globalUI) {
    globalUI.cleanup();
    globalUI = null;
  }
  
  const initialState = createInitialState();
  globalController = new CombatController(
    initialState,
    COMBO_DATABASE,
    STATUS_DATABASE,
    ENEMY_ACTION_DATABASE,
    FALLBACK_ACTION
  );

  globalUI = new CombatUI(globalController);
}

/**
 * UI Controller class
 */
class CombatUI {
  private controller: CombatController;
  private comboParser: ComboParser;
  private elements: {
    turnCount: HTMLElement;
    turnPhase: HTMLElement;
    playerCard: HTMLElement;
    playerImage: HTMLImageElement;
    playerName: HTMLElement;
    playerLevel: HTMLElement;
    playerExp: HTMLElement;
    playerExpNext: HTMLElement;
    playerExpBar: HTMLElement;
    playerHpText: HTMLElement;
    playerHpBar: HTMLElement;
    playerShieldContainer: HTMLElement;
    playerShieldText: HTMLElement;
    playerShieldBar: HTMLElement;
    playerStatuses: HTMLElement;
    playerStatusEffectsList: HTMLElement;
    playerElementalAffinities: HTMLElement;
    enemyContainer: HTMLElement;
    inputDisplay: HTMLElement;
    inputCount: HTMLElement;
    inputLimit: HTMLElement;
    comboLibrary: HTMLElement;
    combatLog: HTMLElement;
    victoryBanner: HTMLElement;
    streakInfo: HTMLElement;
    restBtn: HTMLButtonElement;
    continueBtn: HTMLButtonElement;
    defeatBanner: HTMLElement;
    confirmBtn: HTMLButtonElement;
    clearBtn: HTMLButtonElement;
    replayBtn: HTMLButtonElement;
    dirBtns: NodeListOf<HTMLButtonElement>;
  };
  private eventListeners: Array<{element: EventTarget, type: string, listener: EventListener}> = [];

  constructor(controller: CombatController) {
    this.controller = controller;
    // Create combo parser for preview and hints
    this.comboParser = new ComboParser(COMBO_DATABASE, FALLBACK_ACTION);
    this.elements = this.initializeElements();
    this.attachEventListeners();
    this.attachNewBattleListeners();
    this.render();
  }

  /**
   * Clean up event listeners to prevent memory leaks and stacking
   */
  public cleanup(): void {
    this.eventListeners.forEach(({element, type, listener}) => {
      element.removeEventListener(type, listener);
    });
    this.eventListeners = [];
  }

  /**
   * Helper method to add event listeners with tracking for cleanup
   */
  private addTrackedListener(element: EventTarget, type: string, listener: EventListener): void {
    element.addEventListener(type, listener);
    this.eventListeners.push({element, type, listener});
  }

  private initializeElements() {
    return {
      turnCount: document.getElementById('turnCount')!,
      turnPhase: document.getElementById('turnPhase')!,
      playerCard: document.getElementById('playerCard')!,
      playerImage: document.getElementById('playerImage') as HTMLImageElement,
      playerName: document.getElementById('playerName')!,
      playerLevel: document.getElementById('playerLevel')!,
      playerExp: document.getElementById('playerExp')!,
      playerExpNext: document.getElementById('playerExpNext')!,
      playerExpBar: document.getElementById('playerExpBar')!,
      playerHpText: document.getElementById('playerHpText')!,
      playerHpBar: document.getElementById('playerHpBar')!,
      playerShieldContainer: document.getElementById('playerShieldContainer')!,
      playerShieldText: document.getElementById('playerShieldText')!,
      playerShieldBar: document.getElementById('playerShieldBar')!,
      playerStatuses: document.getElementById('playerStatuses')!,
      playerStatusEffectsList: document.getElementById('playerStatusEffectsList')!,
      playerElementalAffinities: document.getElementById('playerElementalAffinities')!,
      enemyContainer: document.getElementById('enemyContainer')!,
      inputDisplay: document.getElementById('inputDisplay')!,
      inputCount: document.getElementById('inputCount')!,
      inputLimit: document.getElementById('inputLimit')!,
      comboLibrary: document.getElementById('comboLibrary')!,
      combatLog: document.getElementById('combatLog')!,
      victoryBanner: document.getElementById('victoryBanner')!,
      streakInfo: document.getElementById('streakInfo')!,
      restBtn: document.getElementById('restBtn') as HTMLButtonElement,
      continueBtn: document.getElementById('continueBtn') as HTMLButtonElement,
      defeatBanner: document.getElementById('defeatBanner')!,
      confirmBtn: document.getElementById('confirmBtn') as HTMLButtonElement,
      clearBtn: document.getElementById('clearBtn') as HTMLButtonElement,
      replayBtn: document.getElementById('replayBtn') as HTMLButtonElement,
      dirBtns: document.querySelectorAll('.dir-btn') as NodeListOf<HTMLButtonElement>
    };
  }

  private attachEventListeners() {
    // Direction buttons
    this.elements.dirBtns.forEach(btn => {
      this.addTrackedListener(btn, 'click', () => {
        if (!this.controller.isCombatOver()) {
          const direction = btn.dataset.dir as DirectionInput;
          const added = this.controller.addInput(direction);
          if (!added) {
            // Show feedback when limit reached
            this.showInputLimitFeedback();
          }
          this.render();
        }
      });
    });

    // Clear button
    this.addTrackedListener(this.elements.clearBtn, 'click', () => {
      this.controller.clearInput();
      this.render();
    });

    // Confirm button
    this.addTrackedListener(this.elements.confirmBtn, 'click', async () => {
      if (!this.controller.isCombatOver() && this.controller.getState().inputBuffer.length > 0) {
        this.controller.confirmAction();
        await this.render();
        
        // After player action, automatically progress through enemy turns
        if (!this.controller.isCombatOver()) {
          this.controller.progressTurn();
          await this.render();
        }
      }
    });

    // Replay button
    this.addTrackedListener(this.elements.replayBtn, 'click', async () => {
      if (!this.controller.isCombatOver() && this.controller.getState().lastSuccessfulCombo) {
        this.controller.replayLastCombo();
        await this.render();
        
        // After replay, automatically progress through enemy turns
        if (!this.controller.isCombatOver()) {
          this.controller.progressTurn();
          await this.render();
        }
      }
    });

    // Keyboard controls
    this.addTrackedListener(document, 'keydown', (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (this.controller.isCombatOver()) return;

      const keyMap: Record<string, DirectionInput> = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
        'w': 'UP',
        's': 'DOWN',
        'a': 'LEFT',
        'd': 'RIGHT'
      };

      if (keyMap[keyboardEvent.key]) {
        e.preventDefault();
        this.controller.addInput(keyMap[keyboardEvent.key]);
        this.render();
      } else if (keyboardEvent.key === 'Enter') {
        e.preventDefault();
        this.elements.confirmBtn.click();
      } else if (keyboardEvent.key === 'Escape') {
        e.preventDefault();
        this.elements.clearBtn.click();
      } else if (keyboardEvent.key === 'r' || keyboardEvent.key === 'R') {
        e.preventDefault();
        this.elements.replayBtn.click();
      }
    });
  }

  /**
   * Show feedback when input limit is reached
   */
  private showInputLimitFeedback(): void {
    // Brief visual feedback
    this.elements.inputDisplay.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
    setTimeout(() => {
      this.elements.inputDisplay.style.backgroundColor = '';
    }, 200);
  }

  private attachNewBattleListeners() {
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    
    // Rest button - restore HP and reset streak
    this.addTrackedListener(this.elements.restBtn, 'click', () => {
      restAndHeal();
    });
    
    // Continue button - start new battle immediately (increases streak)
    this.addTrackedListener(this.elements.continueBtn, 'click', () => {
      continueFighting();
    });
    
    if (tryAgainBtn) {
      this.addTrackedListener(tryAgainBtn, 'click', () => {
        // On defeat, reset streak and restore HP
        saveBattleStreak(0);
        const player = loadPlayerState();
        player.currentHp = player.maxHp;
        player.statuses = [];
        player.shield = 0;
        savePlayerState(player);
        startNewBattle();
      });
    }
  }

  private async render() {
    const state = this.controller.getState();

    // Save player state and discovered combos to localStorage (but not during combat end)
    if (state.turnPhase !== 'COMBAT_END') {
      savePlayerState(state.player);
    }
    saveDiscoveredCombos(state.discoveredCombos);

    // Play pending animation if any, but only during appropriate phases
    if (state.pendingAnimation && state.turnPhase !== 'PLAYER_INPUT') {
      await this.playAnimations(state.pendingAnimation);
      // Animation complete - do NOT auto-progress turns
      // This maintains proper turn-based flow where player must explicitly confirm actions
    }

    this.renderTurnInfo(state);
    this.renderPlayer(state.player);
    this.renderEnemies(state.enemies);
    this.renderInputBuffer(state.inputBuffer);
    this.renderComboLibrary(state.discoveredCombos);
    this.renderCombatLog(state.combatLog);
    this.renderCombatStatus(state);
    this.updateButtonStates(state);
  }

  private renderTurnInfo(state: CombatState) {
    this.elements.turnCount.textContent = state.turnCount.toString();
    this.elements.turnPhase.textContent = state.turnPhase === 'PLAYER_INPUT' 
      ? "Player's Turn" 
      : "Enemy Turn";
  }

  private renderPlayer(player: PlayerEntity) {
    this.elements.playerName.textContent = player.name;
    this.elements.playerHpText.textContent = `${player.currentHp}/${player.maxHp}`;
    
    const hpPercent = (player.currentHp / player.maxHp) * 100;
    this.elements.playerHpBar.style.width = `${hpPercent}%`;

    // Level and Experience
    const level = player.level || 1;
    const exp = player.experience || 0;
    const expNext = player.experienceToNextLevel || 50;
    
    this.elements.playerLevel.textContent = level.toString();
    this.elements.playerExp.textContent = exp.toString();
    this.elements.playerExpNext.textContent = expNext.toString();
    
    const expPercent = expNext > 0 ? (exp / expNext) * 100 : 0;
    this.elements.playerExpBar.style.width = `${expPercent}%`;

    // Update player card status
    if (!player.isAlive) {
      this.elements.playerCard.classList.add('dead');
    } else {
      this.elements.playerCard.classList.remove('dead');
    }

    // Shield
    if (player.shield > 0) {
      this.elements.playerShieldContainer.style.display = 'block';
      this.elements.playerShieldText.textContent = player.shield.toString();
      const shieldPercent = (player.shield / 50) * 100;
      this.elements.playerShieldBar.style.width = `${shieldPercent}%`;
    } else {
      this.elements.playerShieldContainer.style.display = 'none';
    }

    // Statuses
    this.renderStatuses(this.elements.playerStatuses, player.statuses);
    
    // Render detailed status effects list
    this.renderStatusEffectsList(player.statuses);
    
    // Render elemental affinities
    this.renderElementalAffinities(player.elementalAffinities);
  }

  private renderEnemies(enemies: EnemyEntity[]) {
    this.elements.enemyContainer.innerHTML = '';

    enemies.forEach(enemy => {
      const card = document.createElement('div');
      card.className = 'entity-card compact enemy-card';
      card.id = enemy.id;
      if (!enemy.isAlive) card.classList.add('dead');

      const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;
      const imagePath = this.getEnemyImagePath(enemy);

      card.innerHTML = `
        <div class="entity-image-container compact">
          <img class="entity-image" src="${imagePath}" alt="${enemy.name}" onerror="this.style.display='none'">
        </div>
        <div class="entity-info">
          <div class="entity-name compact">${enemy.name}</div>
          <div class="hp-container compact">
            <div class="hp-label compact">
              <span>HP</span>
              <span>${enemy.currentHp}/${enemy.maxHp}</span>
            </div>
            <div class="hp-bar compact">
              <div class="hp-fill" style="width: ${hpPercent}%"></div>
            </div>
          </div>
          <div class="status-list compact" id="status-${enemy.id}"></div>
        </div>
      `;

      this.elements.enemyContainer.appendChild(card);

      // Render enemy statuses
      const statusContainer = document.getElementById(`status-${enemy.id}`);
      if (statusContainer) {
        this.renderStatuses(statusContainer, enemy.statuses);
      }
    });
  }

  private renderStatuses(container: HTMLElement, statuses: any[]) {
    container.innerHTML = '';
    statuses.forEach(statusInstance => {
      // Look up status definition from database
      const statusDef = STATUS_DATABASE.find(s => s.id === statusInstance.statusId);
      if (!statusDef) {
        console.warn(`Status definition not found for: ${statusInstance.statusId}`);
        return;
      }

      const badge = document.createElement('div');
      badge.className = `status-badge status-${statusDef.id}`;
      
      // Create icon element
      const icon = document.createElement('span');
      icon.className = `status-icon status-icon-${statusDef.id}`;
      icon.setAttribute('aria-label', statusDef.name);
      
      // Create text element
      const text = document.createElement('span');
      text.className = 'status-text';
      text.textContent = `${statusDef.name} ×${statusInstance.stacks}`;
      
      badge.appendChild(icon);
      badge.appendChild(text);
      container.appendChild(badge);
    });
  }

  private renderStatusEffectsList(statuses: any[]) {
    this.elements.playerStatusEffectsList.innerHTML = '';
    
    if (statuses.length === 0) {
      this.elements.playerStatusEffectsList.innerHTML = 
        '<div class="info-empty">No active status effects</div>';
      return;
    }

    statuses.forEach(statusInstance => {
      const statusDef = STATUS_DATABASE.find(s => s.id === statusInstance.statusId);
      if (!statusDef) return;

      const statusItem = document.createElement('div');
      statusItem.className = 'status-effect-item';
      
      const icon = document.createElement('span');
      icon.className = `status-icon status-icon-${statusDef.id}`;
      icon.setAttribute('aria-label', statusDef.name);
      
      const info = document.createElement('div');
      info.className = 'status-effect-info';
      
      const name = document.createElement('div');
      name.className = 'status-effect-name';
      name.textContent = statusDef.name;
      
      const details = document.createElement('div');
      details.className = 'status-effect-details';
      
      // Show stack count and max stacks if applicable
      const stackText = statusDef.maxStacks 
        ? `${statusInstance.stacks}/${statusDef.maxStacks} stacks`
        : `${statusInstance.stacks} stacks`;
      details.textContent = stackText;
      
      // Add effect description
      const effectDesc = document.createElement('div');
      effectDesc.className = 'status-effect-description';
      if (statusDef.effectPerStack.damagePerStack) {
        effectDesc.textContent = `Deals ${statusDef.effectPerStack.damagePerStack * statusInstance.stacks} damage per turn`;
      } else if (statusDef.effectPerStack.healPerStack) {
        effectDesc.textContent = `Heals ${statusDef.effectPerStack.healPerStack * statusInstance.stacks} HP per turn`;
      } else if (statusDef.effectPerStack.shieldPerStack) {
        effectDesc.textContent = `Provides ${statusDef.effectPerStack.shieldPerStack * statusInstance.stacks} shield`;
      } else if (statusDef.effectPerStack.damageMultiplier) {
        const multiplier = (statusDef.effectPerStack.damageMultiplier - 1) * statusInstance.stacks * 100;
        effectDesc.textContent = `Takes ${multiplier.toFixed(0)}% more damage`;
      } else if (statusDef.effectPerStack.outgoingDamageMultiplier) {
        const multiplier = (1 - statusDef.effectPerStack.outgoingDamageMultiplier) * statusInstance.stacks * 100;
        effectDesc.textContent = `Deals ${multiplier.toFixed(0)}% less damage`;
      } else if (statusDef.effectPerStack.preventAction) {
        effectDesc.textContent = 'Prevents actions';
      }
      
      info.appendChild(name);
      info.appendChild(details);
      if (effectDesc.textContent) {
        info.appendChild(effectDesc);
      }
      
      statusItem.appendChild(icon);
      statusItem.appendChild(info);
      this.elements.playerStatusEffectsList.appendChild(statusItem);
    });
  }

  private renderElementalAffinities(affinities: Record<string, number>) {
    this.elements.playerElementalAffinities.innerHTML = '';
    
    const elements: Array<{name: string, key: string, color: string}> = [
      { name: 'Fire', key: 'FIRE', color: 'var(--flame-orange)' },
      { name: 'Ice', key: 'ICE', color: 'var(--ice-blue)' },
      { name: 'Lightning', key: 'LIGHTNING', color: '#FFEB3B' },
      { name: 'Poison', key: 'POISON', color: 'var(--poison-green)' },
      { name: 'Physical', key: 'PHYSICAL', color: '#fff' }
    ];

    elements.forEach(element => {
      const affinity = affinities[element.key] || 1.0;
      const affinityItem = document.createElement('div');
      affinityItem.className = 'affinity-item';
      
      const name = document.createElement('div');
      name.className = 'affinity-name';
      name.textContent = element.name;
      
      const value = document.createElement('div');
      value.className = 'affinity-value';
      
      // Determine affinity type
      let affinityType: 'immune' | 'resistant' | 'normal' | 'weak' | 'very-weak';
      let displayValue: string;
      
      if (affinity === 0) {
        affinityType = 'immune';
        displayValue = 'Immune';
      } else if (affinity < 0.5) {
        affinityType = 'resistant';
        displayValue = `${Math.round((1 - affinity) * 100)}% Resistant`;
      } else if (affinity < 0.8) {
        affinityType = 'resistant';
        displayValue = `${Math.round((1 - affinity) * 100)}% Resistant`;
      } else if (affinity === 1.0) {
        affinityType = 'normal';
        displayValue = 'Normal';
      } else if (affinity <= 1.5) {
        affinityType = 'weak';
        displayValue = `${Math.round((affinity - 1) * 100)}% Weak`;
      } else {
        affinityType = 'very-weak';
        displayValue = `${Math.round((affinity - 1) * 100)}% Weak`;
      }
      
      value.className = `affinity-value affinity-${affinityType}`;
      value.textContent = displayValue;
      value.style.color = element.color;
      
      // Add multiplier display
      const multiplier = document.createElement('div');
      multiplier.className = 'affinity-multiplier';
      multiplier.textContent = `×${affinity.toFixed(1)}`;
      multiplier.style.color = element.color;
      multiplier.style.opacity = '0.7';
      
      affinityItem.appendChild(name);
      affinityItem.appendChild(value);
      affinityItem.appendChild(multiplier);
      
      this.elements.playerElementalAffinities.appendChild(affinityItem);
    });
  }

  private renderInputBuffer(inputBuffer: DirectionInput[]) {
    const state = this.controller.getState();
    const currentCount = inputBuffer.length;
    const maxLimit = state.maxInputLimit;
    
    // Update input limit display
    this.elements.inputCount.textContent = currentCount.toString();
    this.elements.inputLimit.textContent = maxLimit.toString();
    
    // Update input limit text color based on usage
    const limitPercent = (currentCount / maxLimit) * 100;
    if (limitPercent >= 100) {
      this.elements.inputCount.parentElement!.style.color = '#FF6B6B';
    } else if (limitPercent >= 80) {
      this.elements.inputCount.parentElement!.style.color = '#FFA500';
    } else {
      this.elements.inputCount.parentElement!.style.color = 'var(--parchment)';
    }
    
    this.elements.inputDisplay.innerHTML = '';

    if (inputBuffer.length === 0) {
      this.elements.inputDisplay.innerHTML = 
        '<span style="opacity: 0.5; font-style: italic;">Use arrow buttons below...</span>';
    } else {
      const arrows: Record<DirectionInput, string> = {
        UP: '▲',
        DOWN: '▼',
        LEFT: '◀',
        RIGHT: '▶'
      };

      // Show input arrows horizontally
      const arrowsContainer = document.createElement('div');
      arrowsContainer.style.display = 'flex';
      arrowsContainer.style.gap = '4px';
      arrowsContainer.style.flexWrap = 'wrap';
      
      inputBuffer.forEach((dir, index) => {
        const arrow = document.createElement('div');
        arrow.className = 'input-arrow';
        if (index >= maxLimit) {
          arrow.classList.add('over-limit');
        }
        arrow.textContent = arrows[dir];
        arrowsContainer.appendChild(arrow);
      });
      this.elements.inputDisplay.appendChild(arrowsContainer);

      // Show combo preview
      const matchedCombos = this.comboParser.parseAllCombos(inputBuffer);
      if (matchedCombos.length > 0 && matchedCombos[0].id !== FALLBACK_ACTION.id) {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'combo-preview';
        previewDiv.innerHTML = `
          <div class="combo-preview-label">Will execute:</div>
          <div class="combo-preview-name">${matchedCombos.map(c => c.name).join(' + ')}</div>
        `;
        this.elements.inputDisplay.appendChild(previewDiv);
      }

      // Show combo hints (potential combos that could continue)
      if (currentCount < maxLimit) {
        const potentialCombos = this.comboParser.findPotentialCombos(inputBuffer);
        const discoveredIds = state.discoveredCombos;
        const undiscoveredHints = potentialCombos
          .filter(c => !discoveredIds.includes(c.id) && c.sequence.length > inputBuffer.length)
          .slice(0, 3); // Show max 3 hints
        
        if (undiscoveredHints.length > 0) {
          const hintsDiv = document.createElement('div');
          hintsDiv.className = 'combo-hints';
          hintsDiv.innerHTML = '<div class="combo-hints-label">Possible combos:</div>';
          
          undiscoveredHints.forEach(combo => {
            const nextInput = combo.sequence[inputBuffer.length];
            const hintItem = document.createElement('div');
            hintItem.className = 'combo-hint-item';
            hintItem.innerHTML = `
              <span class="combo-hint-next">${arrows[nextInput as DirectionInput]}</span>
              <span class="combo-hint-name">${combo.name}</span>
            `;
            hintsDiv.appendChild(hintItem);
          });
          
          this.elements.inputDisplay.appendChild(hintsDiv);
        }
      }
    }
  }

  private renderComboLibrary(discoveredComboIds: string[]) {
    this.elements.comboLibrary.innerHTML = '';

    if (discoveredComboIds.length === 0) {
      this.elements.comboLibrary.innerHTML = '<div class="combo-library-empty">No combos discovered yet</div>';
      return;
    }

    // Get combo details from database
    const discoveredCombos = COMBO_DATABASE.filter(combo => 
      discoveredComboIds.includes(combo.id)
    ).sort((a, b) => a.sequence.length - b.sequence.length);

    discoveredCombos.forEach(combo => {
      const comboItem = document.createElement('div');
      comboItem.className = 'combo-item';
      
      const arrows: Record<DirectionInput, string> = {
        UP: '▲',
        DOWN: '▼',
        LEFT: '◀',
        RIGHT: '▶'
      };

      const sequenceDisplay = combo.sequence.map(dir => arrows[dir as DirectionInput]).join(' ');
      const elementBadge = combo.element ? `<span class="element-badge ${combo.element.toLowerCase()}">${combo.element}</span>` : '';
      const damageText = combo.damage > 0 ? `${combo.damage} dmg` : '';
      const targetingText = combo.targeting === 'ALL_ENEMIES' ? 'AOE' : combo.targeting === 'SINGLE_ENEMY' ? 'Single' : combo.targeting === 'SELF' ? 'Self' : 'Random';

      comboItem.innerHTML = `
        <div class="combo-name">${combo.name}</div>
        <div class="combo-sequence">${sequenceDisplay}</div>
        <div class="combo-stats">
          ${elementBadge}
          <span class="combo-damage">${damageText}</span>
          <span class="combo-targeting">${targetingText}</span>
        </div>
      `;

      this.elements.comboLibrary.appendChild(comboItem);
    });
  }

  private renderCombatLog(combatLog: any[]) {
    this.elements.combatLog.innerHTML = '';

    const recentLogs = combatLog.slice(-20);
    recentLogs.forEach(entry => {
      const logEntry = document.createElement('div');
      logEntry.className = `log-entry ${entry.type}`;
      logEntry.textContent = entry.message;
      this.elements.combatLog.appendChild(logEntry);
    });

    this.elements.combatLog.scrollTop = this.elements.combatLog.scrollHeight;
  }

  private renderCombatStatus(state: CombatState) {
    if (state.isVictory) {
      this.elements.victoryBanner.classList.add('show');
      // Show streak info
      if (state.battleStreak > 0) {
        this.elements.streakInfo.textContent = `Battle Streak: ${state.battleStreak + 1}x (${(1.0 + state.battleStreak * 0.1).toFixed(1)}x XP bonus)`;
      } else {
        this.elements.streakInfo.textContent = 'First battle - continue fighting for XP bonuses!';
      }
    } else {
      this.elements.victoryBanner.classList.remove('show');
    }
    
    if (state.isDefeat) {
      this.elements.defeatBanner.classList.add('show');
    } else {
      this.elements.defeatBanner.classList.remove('show');
    }
  }

  private updateButtonStates(state: CombatState) {
    const isOver = this.controller.isCombatOver();
    const hasInput = state.inputBuffer.length > 0;
    const hasLastCombo = state.lastSuccessfulCombo !== null;
    const isAtLimit = state.inputBuffer.length >= state.maxInputLimit;

    // Disable input buttons when at limit or combat over
    this.elements.dirBtns.forEach(btn => {
      btn.disabled = isOver || isAtLimit;
      if (isAtLimit && !isOver) {
        btn.classList.add('disabled-at-limit');
      } else {
        btn.classList.remove('disabled-at-limit');
      }
    });

    this.elements.confirmBtn.disabled = isOver || !hasInput;
    this.elements.clearBtn.disabled = isOver;
    this.elements.replayBtn.disabled = isOver || !hasLastCombo;
  }

  /**
   * Play attack animations based on pending animation data
   */
  private playAnimations(animation: AnimationData): Promise<void> {
    return new Promise((resolve) => {
      if (animation.type === 'player_attack') {
        this.animatePlayerAttack(animation);
        // After player attack animation, animate hits on targets
        setTimeout(() => {
          this.animateHits(animation);
          setTimeout(() => resolve(), 600);
        }, 400);
      } else if (animation.type === 'enemy_attack') {
        this.animateEnemyAttack(animation);
        // After enemy attack animation, animate hit on player
        setTimeout(() => {
          this.animateHits(animation);
          setTimeout(() => resolve(), 600);
        }, 400);
      } else {
        this.animateHits(animation);
        setTimeout(() => resolve(), 600);
      }
    });
  }

  /**
   * Animate player attack
   */
  private animatePlayerAttack(animation: AnimationData) {
    const playerCard = this.elements.playerCard;
    if (!playerCard) return;

    // Add element-specific attack class
    const elementClass = animation.element ? `attack-${animation.element.toLowerCase()}` : 'attack-physical';
    playerCard.classList.add('attacking', elementClass);
    
    setTimeout(() => {
      playerCard.classList.remove('attacking', elementClass);
    }, 400);
  }

  /**
   * Animate enemy attack
   */
  private animateEnemyAttack(animation: AnimationData) {
    // Animate the attacking enemy, not the target
    if (animation.attackerId) {
      const attackerCard = document.getElementById(animation.attackerId);
      if (attackerCard) {
        const elementClass = animation.element ? `attack-${animation.element.toLowerCase()}` : 'attack-physical';
        attackerCard.classList.add('enemy-attacking', elementClass);
        
        setTimeout(() => {
          attackerCard.classList.remove('enemy-attacking', elementClass);
        }, 400);
      }
    }
  }

  /**
   * Animate hits on targets
   */
  private animateHits(animation: AnimationData) {
    animation.targetIds.forEach((targetId, index) => {
      const targetCard = document.getElementById(targetId);
      if (!targetCard) return;

      // Add hit animation with element-specific class
      const elementClass = animation.element ? `hit-${animation.element.toLowerCase()}` : 'hit-physical';
      targetCard.classList.add('hit', elementClass);
      
      // Show damage number if available
      if (animation.damage !== undefined) {
        this.showDamageNumber(targetCard, animation.damage, animation.element);
      }
      
      // Remove hit class after animation
      setTimeout(() => {
        targetCard.classList.remove('hit', elementClass);
      }, 600);
    });
  }

  /**
   * Show floating damage number
   */
  private showDamageNumber(targetElement: HTMLElement, damage: number, element: ElementType | null) {
    const damageText = document.createElement('div');
    damageText.className = 'damage-number';
    if (element) {
      damageText.classList.add(`damage-${element.toLowerCase()}`);
    }
    damageText.textContent = `-${damage}`;
    
    // Position relative to target
    const rect = targetElement.getBoundingClientRect();
    damageText.style.position = 'fixed';
    damageText.style.left = `${rect.left + rect.width / 2}px`;
    damageText.style.top = `${rect.top + rect.height / 2}px`;
    damageText.style.pointerEvents = 'none';
    damageText.style.zIndex = '10000';
    
    document.body.appendChild(damageText);
    
    // Animate and remove
    setTimeout(() => {
      damageText.style.transition = 'all 0.8s ease-out';
      damageText.style.transform = 'translateY(-60px) scale(1.2)';
      damageText.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(damageText);
      }, 800);
    }, 10);
  }

  /**
   * Get image path for an enemy based on its name or id
   */
  private getEnemyImagePath(enemy: EnemyEntity): string {
    // Normalize enemy name: lowercase, replace spaces with underscores
    const normalizedName = enemy.name.toLowerCase().replace(/\s+/g, '_');
    return `./assets/enemies/${normalizedName}.png`;
  }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
  startNewBattle();
});
