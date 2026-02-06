export class InputBufferSystem {
    constructor(maxBufferSize = 20) {
        this.buffer = [];
        this.maxBufferSize = maxBufferSize;
    }
    /**
     * Add input to buffer
     */
    addInput(direction) {
        this.buffer.push(direction);
        // Prevent infinite buffer growth
        if (this.buffer.length > this.maxBufferSize) {
            this.buffer.shift();
        }
    }
    /**
     * Get current buffer (immutable copy)
     */
    getBuffer() {
        return [...this.buffer];
    }
    /**
     * Clear buffer after successful execution
     */
    clearBuffer() {
        this.buffer = [];
    }
    /**
     * Remove last input (backspace/undo)
     */
    removeLastInput() {
        return this.buffer.pop();
    }
    /**
     * Set buffer to specific sequence (for replay)
     */
    setBuffer(sequence) {
        this.buffer = [...sequence];
    }
    /**
     * Get buffer length
     */
    getLength() {
        return this.buffer.length;
    }
    /**
     * Check if buffer is empty
     */
    isEmpty() {
        return this.buffer.length === 0;
    }
}
