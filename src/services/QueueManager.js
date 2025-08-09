class QueueManager {
  constructor() {
    this.queue = [];
    this.currentIndex = -1;
    this.subscribers = new Set();
  }

  // Subscribe to queue changes
  subscribe(callback) {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers of changes
  notify() {
    this.subscribers.forEach(callback => callback(this.getState()));
  }

  // Get current state
  getState() {
    return {
      queue: [...this.queue],
      currentIndex: this.currentIndex,
      currentItem: this.currentIndex >= 0 && this.currentIndex < this.queue.length 
        ? this.queue[this.currentIndex] 
        : null
    };
  }

  // Queue actions
  add(item) {
    if (!item || !item.url) return;
    
    // Check if item already exists
    const exists = this.queue.find(i => i.url === item.url);
    if (exists) return;
    
    this.queue.push(item);
    this.notify();
  }

  playNow(item) {
    if (!item || !item.url) return;
    
    const existingIndex = this.queue.findIndex(i => i.url === item.url);
    
    if (existingIndex !== -1) {
      // Item exists - move it to the front and rearrange queue
      const itemToPlay = { ...this.queue[existingIndex], ...item }; // Merge metadata
      
      // Create new queue with this item first, then remaining items in order
      const remainingItems = this.queue.filter((_, index) => index !== existingIndex);
      this.queue = [itemToPlay, ...remainingItems];
      this.currentIndex = 0; // Playing the first item
    } else {
      // New item - add it to the front and push everything else back
      this.queue = [item, ...this.queue];
      this.currentIndex = 0; // Playing the new first item
    }
    
    this.notify();
  }

  remove(url) {
    const index = this.queue.findIndex(i => i.url === url);
    if (index === -1) return;
    
    this.queue.splice(index, 1);
    
    // Adjust current index
    if (this.currentIndex > index) {
      this.currentIndex--;
    } else if (this.currentIndex === index) {
      // If we removed the current item, adjust to stay in bounds
      this.currentIndex = this.queue.length ? Math.min(index, this.queue.length - 1) : -1;
    }
    
    this.notify();
  }

  clear() {
    this.queue = [];
    this.currentIndex = -1;
    this.notify();
  }

  next() {
    if (this.queue.length > 0 && this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.notify();
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notify();
    }
  }
}

// Create singleton instance
export const queueManager = new QueueManager();
