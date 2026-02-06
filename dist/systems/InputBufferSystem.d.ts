import { DirectionInput } from '../types/index.js';
export declare class InputBufferSystem {
    private buffer;
    private maxBufferSize;
    constructor(maxBufferSize?: number);
    /**
     * Add input to buffer
     */
    addInput(direction: DirectionInput): void;
    /**
     * Get current buffer (immutable copy)
     */
    getBuffer(): DirectionInput[];
    /**
     * Clear buffer after successful execution
     */
    clearBuffer(): void;
    /**
     * Remove last input (backspace/undo)
     */
    removeLastInput(): DirectionInput | undefined;
    /**
     * Set buffer to specific sequence (for replay)
     */
    setBuffer(sequence: DirectionInput[]): void;
    /**
     * Get buffer length
     */
    getLength(): number;
    /**
     * Check if buffer is empty
     */
    isEmpty(): boolean;
}
//# sourceMappingURL=InputBufferSystem.d.ts.map