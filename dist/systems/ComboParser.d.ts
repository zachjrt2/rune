import { DirectionInput, ComboDefinition } from '../types/index.js';
export declare class ComboParser {
    private fallbackAction;
    private combos;
    constructor(combos: ComboDefinition[], fallbackAction: ComboDefinition);
    /**
     * Parse input buffer using greedy longest-match from left to right
     * Returns matched combo or fallback action
     */
    parseCombo(buffer: DirectionInput[]): ComboDefinition;
    /**
     * Check if buffer starts with the target sequence
     */
    private matchesSequence;
    /**
     * Find all valid combos that could start with the current buffer
     * Used for UI hints/autocomplete
     */
    findPotentialCombos(buffer: DirectionInput[]): ComboDefinition[];
    /**
     * Get all combos sorted by length
     */
    getAllCombos(): ComboDefinition[];
}
//# sourceMappingURL=ComboParser.d.ts.map