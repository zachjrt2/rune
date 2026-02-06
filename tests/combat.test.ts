import { ComboParser } from '../src/systems/ComboParser';
import { COMBO_DATABASE, FALLBACK_ACTION } from '../src/data/combos';
import { DirectionInput } from '../src/types';

describe('ComboParser', () => {
  let parser: ComboParser;
  
  beforeEach(() => {
    parser = new ComboParser(COMBO_DATABASE, FALLBACK_ACTION);
  });
  
  describe('parseCombo', () => {
    it('should match exact combo sequence', () => {
      const input: DirectionInput[] = ['UP', 'UP', 'RIGHT'];
      const result = parser.parseCombo(input);
      
      expect(result.id).toBe('fireball');
      expect(result.name).toBe('Fireball');
    });
    
    it('should match longest combo first (greedy)', () => {
      // Meteor Storm is UP, UP, RIGHT, DOWN, DOWN
      // Fireball is UP, UP, RIGHT
      // Should match Meteor Storm, not Fireball
      const input: DirectionInput[] = ['UP', 'UP', 'RIGHT', 'DOWN', 'DOWN'];
      const result = parser.parseCombo(input);
      
      expect(result.id).toBe('meteor_storm');
      expect(result.name).toBe('Meteor Storm');
    });
    
    it('should return fallback action when no combo matches', () => {
      const input: DirectionInput[] = ['LEFT', 'LEFT', 'LEFT'];
      const result = parser.parseCombo(input);
      
      expect(result.id).toBe('weak_attack');
      expect(result.name).toBe('Weak Attack');
    });
    
    it('should match shorter combos', () => {
      const input: DirectionInput[] = ['RIGHT', 'LEFT'];
      const result = parser.parseCombo(input);
      
      expect(result.id).toBe('slash');
    });
    
    it('should handle empty buffer', () => {
      const input: DirectionInput[] = [];
      const result = parser.parseCombo(input);
      
      expect(result.id).toBe('weak_attack');
    });
  });
  
  describe('findPotentialCombos', () => {
    it('should find combos that start with given prefix', () => {
      const input: DirectionInput[] = ['UP', 'UP'];
      const potentials = parser.findPotentialCombos(input);
      
      // Should include Fireball and Meteor Storm
      const ids = potentials.map(c => c.id);
      expect(ids).toContain('fireball');
      expect(ids).toContain('meteor_storm');
    });
    
    it('should return empty array when no combos match prefix', () => {
      const input: DirectionInput[] = ['DOWN', 'UP', 'LEFT'];
      const potentials = parser.findPotentialCombos(input);
      
      expect(potentials).toHaveLength(0);
    });
    
    it('should return all combos for empty buffer', () => {
      const input: DirectionInput[] = [];
      const potentials = parser.findPotentialCombos(input);
      
      expect(potentials.length).toBe(COMBO_DATABASE.length);
    });
  });
});

describe('InputBufferSystem', () => {
  let buffer: any;
  
  beforeEach(() => {
    const { InputBufferSystem } = require('../src/systems/InputBufferSystem');
    buffer = new InputBufferSystem(5);
  });
  
  it('should add inputs to buffer', () => {
    buffer.addInput('UP');
    buffer.addInput('DOWN');
    
    expect(buffer.getBuffer()).toEqual(['UP', 'DOWN']);
  });
  
  it('should respect max buffer size', () => {
    buffer.addInput('UP');
    buffer.addInput('DOWN');
    buffer.addInput('LEFT');
    buffer.addInput('RIGHT');
    buffer.addInput('UP');
    buffer.addInput('DOWN'); // Should remove first 'UP'
    
    expect(buffer.getBuffer()).toEqual(['DOWN', 'LEFT', 'RIGHT', 'UP', 'DOWN']);
    expect(buffer.getLength()).toBe(5);
  });
  
  it('should clear buffer', () => {
    buffer.addInput('UP');
    buffer.addInput('DOWN');
    buffer.clearBuffer();
    
    expect(buffer.isEmpty()).toBe(true);
  });
  
  it('should remove last input', () => {
    buffer.addInput('UP');
    buffer.addInput('DOWN');
    const removed = buffer.removeLastInput();
    
    expect(removed).toBe('DOWN');
    expect(buffer.getBuffer()).toEqual(['UP']);
  });
});

describe('StatusManager', () => {
  let manager: any;
  let entity: any;
  
  beforeEach(() => {
    const { StatusManager } = require('../src/systems/StatusManager');
    const { STATUS_DATABASE } = require('../src/data/statuses');
    
    manager = new StatusManager(STATUS_DATABASE);
    entity = {
      id: 'test',
      name: 'Test Entity',
      maxHp: 100,
      currentHp: 100,
      shield: 0,
      statuses: [],
      isAlive: true
    };
  });
  
  it('should apply status to entity', () => {
    manager.applyStatus(entity, 'burn', 3);
    
    expect(entity.statuses).toHaveLength(1);
    expect(entity.statuses[0].statusId).toBe('burn');
    expect(entity.statuses[0].stacks).toBe(3);
  });
  
  it('should stack status on existing status', () => {
    manager.applyStatus(entity, 'burn', 3);
    manager.applyStatus(entity, 'burn', 2);
    
    expect(entity.statuses).toHaveLength(1);
    expect(entity.statuses[0].stacks).toBe(5);
  });
  
  it('should apply shield status to shield pool', () => {
    manager.applyStatus(entity, 'shield', 2);
    
    expect(entity.shield).toBe(20); // 2 stacks * 10 per stack
  });
  
  it('should trigger damage over time effects', () => {
    entity.statuses.push({ statusId: 'burn', stacks: 3 });
    
    const results = manager.triggerStatusEffects(entity, 'TURN_END');
    
    expect(results).toHaveLength(1);
    expect(entity.currentHp).toBe(91); // 100 - (3 * 3)
  });
  
  it('should decay statuses', () => {
    entity.statuses.push({ statusId: 'burn', stacks: 3 });
    
    manager.decayStatuses(entity);
    
    expect(entity.statuses[0].stacks).toBe(2);
  });
  
  it('should remove statuses at 0 stacks', () => {
    entity.statuses.push({ statusId: 'burn', stacks: 1 });
    
    manager.decayStatuses(entity);
    
    expect(entity.statuses).toHaveLength(0);
  });
});