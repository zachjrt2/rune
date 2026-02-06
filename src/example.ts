import { CombatController } from './controllers/CombatController.js';
import { CombatState, PlayerEntity, EnemyEntity } from './types/index.js';
import { COMBO_DATABASE, FALLBACK_ACTION } from './data/combos.js';
import { STATUS_DATABASE } from './data/statuses.js';
import { ENEMY_ACTION_DATABASE } from './data/enemyActions.js';

/**
 * Create initial combat state with player and enemies
 */
function createInitialState(): CombatState {
  const player: PlayerEntity = {
    id: 'player',
    name: 'Hero',
    maxHp: 100,
    currentHp: 100,
    shield: 0,
    statuses: [],
    elementalAffinities: {
      FIRE: 1.0,
      ICE: 1.0,
      LIGHTNING: 0.5, // Resistant to lightning
      POISON: 1.0,
      PHYSICAL: 1.0
    },
    isAlive: true,
    team: 'player'
  };

  const enemies: EnemyEntity[] = [
    {
      id: 'goblin_1',
      name: 'Goblin Warrior',
      maxHp: 50,
      currentHp: 50,
      shield: 0,
      statuses: [],
      elementalAffinities: {
        FIRE: 1.5, // Weak to fire
        ICE: 1.0,
        LIGHTNING: 1.0,
        POISON: 0.5, // Resistant to poison
        PHYSICAL: 1.0
      },
      isAlive: true,
      team: 'enemy',
      aiPatternId: 'basic',
      actionPool: ['claw_swipe', 'bite', 'weakening_howl']
    },
    {
      id: 'slime_1',
      name: 'Toxic Slime',
      maxHp: 30,
      currentHp: 30,
      shield: 0,
      statuses: [],
      elementalAffinities: {
        FIRE: 2.0, // Very weak to fire
        ICE: 0.5, // Resistant to ice
        LIGHTNING: 1.0,
        POISON: 0.0, // Immune to poison
        PHYSICAL: 0.8
      },
      isAlive: true,
      team: 'enemy',
      aiPatternId: 'basic',
      actionPool: ['poison_spit', 'tail_sweep']
    }
  ];

  return {
    player,
    enemies,
    turnPhase: 'PLAYER_INPUT',
    turnCount: 1,
    inputBuffer: [],
    lastSuccessfulCombo: null,
    combatLog: [],
    isVictory: false,
    isDefeat: false
  };
}

/**
 * Example combat scenario
 */
function runExampleCombat() {
  console.log('=== INITIALIZING COMBAT ===\n');
  
  // Create combat controller
  const initialState = createInitialState();
  const controller = new CombatController(
    initialState,
    COMBO_DATABASE,
    STATUS_DATABASE,
    ENEMY_ACTION_DATABASE,
    FALLBACK_ACTION
  );
  
  console.log('Player HP:', controller.getState().player.currentHp);
  console.log('Enemies:', controller.getState().enemies.map(e => 
    `${e.name} (${e.currentHp}/${e.maxHp} HP)`
  ).join(', '));
  console.log('\n=== TURN 1 ===\n');
  
  // Turn 1: Player uses Fireball (UP, UP, RIGHT)
  console.log('Player inputs: UP, UP, RIGHT');
  controller.addInput('UP');
  controller.addInput('UP');
  controller.addInput('RIGHT');
  controller.confirmAction();
  
  // Check state after turn 1
  let state = controller.getState();
  console.log('\nCombat Log:');
  state.combatLog.slice(-10).forEach(entry => {
    console.log(`  ${entry.message}`);
  });
  
  console.log('\nPlayer HP:', state.player.currentHp);
  console.log('Enemies:', state.enemies.map(e => 
    `${e.name} (${e.currentHp}/${e.maxHp} HP, ${e.statuses.length} statuses)`
  ).join(', '));
  
  // Turn 2: Replay last combo
  console.log('\n=== TURN 2 ===\n');
  console.log('Player replays last combo (Fireball)');
  controller.replayLastCombo();
  
  state = controller.getState();
  console.log('\nCombat Log (recent):');
  state.combatLog.slice(-10).forEach(entry => {
    console.log(`  ${entry.message}`);
  });
  
  console.log('\nPlayer HP:', state.player.currentHp);
  console.log('Enemies:', state.enemies.map(e => 
    `${e.name} (${e.currentHp}/${e.maxHp} HP, alive: ${e.isAlive})`
  ).join(', '));
  
  // Turn 3: Use Meteor Storm (UP, UP, RIGHT, DOWN, DOWN)
  if (!controller.isCombatOver()) {
    console.log('\n=== TURN 3 ===\n');
    console.log('Player inputs: UP, UP, RIGHT, DOWN, DOWN (Meteor Storm)');
    controller.addInput('UP');
    controller.addInput('UP');
    controller.addInput('RIGHT');
    controller.addInput('DOWN');
    controller.addInput('DOWN');
    controller.confirmAction();
    
    state = controller.getState();
    console.log('\nCombat Log (recent):');
    state.combatLog.slice(-15).forEach(entry => {
      console.log(`  ${entry.message}`);
    });
    
    console.log('\nPlayer HP:', state.player.currentHp);
    console.log('Enemies:', state.enemies.map(e => 
      `${e.name} (${e.currentHp}/${e.maxHp} HP, alive: ${e.isAlive})`
    ).join(', '));
  }
  
  // Check combat result
  console.log('\n=== COMBAT RESULT ===\n');
  const result = controller.getCombatResult();
  console.log('Result:', result.toUpperCase());
  
  if (result === 'victory') {
    console.log('The hero is victorious!');
  } else if (result === 'defeat') {
    console.log('The hero has fallen...');
  } else {
    console.log('Combat continues...');
    console.log(`Turn count: ${controller.getState().turnCount}`);
  }
  
  // Display full combat log
  console.log('\n=== FULL COMBAT LOG ===\n');
  controller.getState().combatLog.forEach(entry => {
    console.log(`[${entry.type}] ${entry.message}`);
  });
}

/**
 * Example of testing combo parser
 */
function testComboParser() {
  console.log('\n\n=== TESTING COMBO PARSER ===\n');
  
  const controller = new CombatController(
    createInitialState(),
    COMBO_DATABASE,
    STATUS_DATABASE,
    ENEMY_ACTION_DATABASE,
    FALLBACK_ACTION
  );
  
  // Test various input sequences
  const testSequences = [
    ['UP', 'UP', 'RIGHT'], // Should match Fireball
    ['UP', 'UP', 'RIGHT', 'DOWN', 'DOWN'], // Should match Meteor Storm (longer)
    ['DOWN', 'DOWN', 'LEFT'], // Should match Regenerate
    ['LEFT', 'LEFT', 'LEFT'], // Should match nothing (fallback)
    ['RIGHT', 'LEFT'], // Should match Slash
  ];
  
  testSequences.forEach(sequence => {
    controller.clearInput();
    sequence.forEach(dir => controller.addInput(dir as any));
    
    console.log(`Input: ${sequence.join(', ')}`);
    console.log('Buffer:', controller.getState().inputBuffer);
    console.log('---');
  });
}

// Run examples
runExampleCombat();
testComboParser();

export { createInitialState, runExampleCombat, testComboParser };