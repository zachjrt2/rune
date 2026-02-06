export class EnemyAI {
    constructor(actions) {
        this.actionRegistry = new Map(actions.map(a => [a.id, a]));
    }
    /**
     * Select an action for the enemy to perform
     */
    selectAction(enemy, _state) {
        // Get available actions
        const availableActions = enemy.actionPool
            .map(id => this.actionRegistry.get(id))
            .filter((a) => a !== undefined);
        if (availableActions.length === 0) {
            throw new Error(`Enemy ${enemy.id} has no valid actions!`);
        }
        // Simple random selection (can be extended with patterns)
        const randomIndex = Math.floor(Math.random() * availableActions.length);
        return availableActions[randomIndex];
    }
    /**
     * Pattern-based AI (optional enhancement)
     */
    selectActionByPattern(enemy, pattern, state) {
        const actions = enemy.actionPool
            .map(id => this.actionRegistry.get(id))
            .filter((a) => a !== undefined);
        if (actions.length === 0) {
            throw new Error(`Enemy ${enemy.id} has no valid actions!`);
        }
        switch (pattern.strategy) {
            case 'RANDOM':
                return actions[Math.floor(Math.random() * actions.length)];
            case 'SEQUENTIAL':
                // Cycle through actions based on turn count
                const index = state.turnCount % actions.length;
                return actions[index];
            case 'CONDITIONAL':
                // Example: use defensive action if low HP
                const hpPercent = enemy.currentHp / enemy.maxHp;
                if (hpPercent < 0.3) {
                    // Prefer defensive/healing actions
                    const defensiveAction = actions.find(a => a.statusEffects.some(s => s.statusId === 'shield' || s.statusId === 'regen'));
                    return defensiveAction || actions[0];
                }
                return actions[0];
            default:
                return actions[0];
        }
    }
    /**
     * Get action definition by ID
     */
    getAction(actionId) {
        return this.actionRegistry.get(actionId);
    }
}
