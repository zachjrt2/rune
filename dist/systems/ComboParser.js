export class ComboParser {
    constructor(combos, fallbackAction) {
        this.fallbackAction = fallbackAction;
        // Sort combos by sequence length (longest first) for greedy matching
        this.combos = [...combos].sort((a, b) => b.sequence.length - a.sequence.length);
    }
    /**
     * Parse input buffer using greedy longest-match from left to right
     * Returns matched combo or fallback action
     */
    parseCombo(buffer) {
        // Try to match combos from longest to shortest
        for (const combo of this.combos) {
            if (this.matchesSequence(buffer, combo.sequence)) {
                return combo;
            }
        }
        // No match found - return fallback
        return this.fallbackAction;
    }
    /**
     * Check if buffer starts with the target sequence
     */
    matchesSequence(buffer, sequence) {
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
    findPotentialCombos(buffer) {
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
    getAllCombos() {
        return [...this.combos];
    }
}
