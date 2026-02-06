import { DirectionInput, ComboDefinition } from '../types/index.js';

export class ComboParser {
  private combos: ComboDefinition[];
  
  constructor(combos: ComboDefinition[], private fallbackAction: ComboDefinition) {
    // Sort combos by sequence length (longest first) for greedy matching
    this.combos = [...combos].sort((a, b) => 
      b.sequence.length - a.sequence.length
    );
  }
  
  /**
   * Parse input buffer to find ALL combos within it
   * Returns array of all matched combos, or fallback action if none found
   */
  parseAllCombos(buffer: DirectionInput[]): ComboDefinition[] {
    const foundCombos: ComboDefinition[] = [];
    let remainingBuffer = [...buffer];
    
    // Try to find all combos in the buffer
    while (remainingBuffer.length > 0) {
      let found = false;
      
      // Try each combo to see if it matches at the start of remaining buffer
      for (const combo of this.combos) {
        if (this.matchesSequence(remainingBuffer, combo.sequence)) {
          foundCombos.push(combo);
          // Remove the matched sequence from buffer
          remainingBuffer = remainingBuffer.slice(combo.sequence.length);
          found = true;
          break; // Found a match, continue with remaining buffer
        }
      }
      
      // If no combo matched, break to avoid infinite loop
      if (!found) {
        break;
      }
    }
    
    // If we found combos, return them; otherwise return fallback
    return foundCombos.length > 0 ? foundCombos : [this.fallbackAction];
  }

  /**
   * Parse input buffer using greedy longest-match from left to right
   * Returns matched combo or fallback action (kept for backwards compatibility)
   */
  parseCombo(buffer: DirectionInput[]): ComboDefinition {
    const combos = this.parseAllCombos(buffer);
    return combos[0];
  }
  
  /**
   * Check if buffer starts with the target sequence
   */
  private matchesSequence(
    buffer: DirectionInput[], 
    sequence: DirectionInput[]
  ): boolean {
    if (buffer.length < sequence.length) {
      return false;
    }
    
    for (let i = 0; i < sequence.length; i++) {
      if (buffer[i] !== sequence[i]) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Find all valid combos that could start with the current buffer
   * Used for UI hints/autocomplete
   */
  findPotentialCombos(buffer: DirectionInput[]): ComboDefinition[] {
    return this.combos.filter(combo => {
      if (buffer.length > combo.sequence.length) {
        return false;
      }
      
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] !== combo.sequence[i]) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Get all combos sorted by length
   */
  getAllCombos(): ComboDefinition[] {
    return [...this.combos];
  }
}