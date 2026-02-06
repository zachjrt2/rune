import { DirectionInput } from '../types/index.js';

export class InputBufferSystem {
  private buffer: DirectionInput[] = [];
  private maxBufferSize: number;
  
  constructor(maxBufferSize: number = 20) {
    this.maxBufferSize = maxBufferSize;
  }
  
  /**
   * Add input to buffer
   * Returns true if input was added, false if limit reached
   */
  addInput(direction: DirectionInput): boolean {
    // Check if we're at the limit
    if (this.buffer.length >= this.maxBufferSize) {
      return false;
    }
    
    this.buffer.push(direction);
    return true;
  }

  /**
   * Update the maximum buffer size
   */
  setMaxBufferSize(size: number): void {
    this.maxBufferSize = size;
    // Trim buffer if it exceeds new limit
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer = this.buffer.slice(0, this.maxBufferSize);
    }
  }

  /**
   * Get the maximum buffer size
   */
  getMaxBufferSize(): number {
    return this.maxBufferSize;
  }
  
  /**
   * Get current buffer (immutable copy)
   */
  getBuffer(): DirectionInput[] {
    return [...this.buffer];
  }
  
  /**
   * Clear buffer after successful execution
   */
  clearBuffer(): void {
    this.buffer = [];
  }
  
  /**
   * Remove last input (backspace/undo)
   */
  removeLastInput(): DirectionInput | undefined {
    return this.buffer.pop();
  }
  
  /**
   * Set buffer to specific sequence (for replay)
   */
  setBuffer(sequence: DirectionInput[]): void {
    this.buffer = [...sequence];
  }
  
  /**
   * Get buffer length
   */
  getLength(): number {
    return this.buffer.length;
  }
  
  /**
   * Check if buffer is empty
   */
  isEmpty(): boolean {
    return this.buffer.length === 0;
  }
}