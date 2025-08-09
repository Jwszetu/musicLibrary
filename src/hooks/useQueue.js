import { useState, useEffect, useCallback } from 'react';
import { queueManager } from '../services/QueueManager';

export function useQueue() {
  const [queueState, setQueueState] = useState(() => queueManager.getState());

  useEffect(() => {
    // Subscribe to queue changes
    const unsubscribe = queueManager.subscribe(setQueueState);
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Wrap queue actions to maintain the same API
  const actions = {
    add: useCallback((item) => queueManager.add(item), []),
    playNow: useCallback((item) => queueManager.playNow(item), []),
    remove: useCallback((url) => queueManager.remove(url), []),
    clear: useCallback(() => queueManager.clear(), []),
    next: useCallback(() => queueManager.next(), []),
    previous: useCallback(() => queueManager.previous(), [])
  };

  return {
    ...queueState,
    ...actions
  };
}

// Lightweight hook for components that only need queue actions (no re-renders on state changes)
export function useQueueActions() {
  return {
    add: useCallback((item) => queueManager.add(item), []),
    playNow: useCallback((item) => queueManager.playNow(item), []),
    remove: useCallback((url) => queueManager.remove(url), []),
    clear: useCallback(() => queueManager.clear(), []),
    next: useCallback(() => queueManager.next(), []),
    previous: useCallback(() => queueManager.previous(), [])
  };
}

// Hook for components that only need current playing item (minimal re-renders)
export function useCurrentItem() {
  const [currentItem, setCurrentItem] = useState(() => queueManager.getState().currentItem);

  useEffect(() => {
    const unsubscribe = queueManager.subscribe((state) => {
      setCurrentItem(state.currentItem);
    });
    return unsubscribe;
  }, []);

  return currentItem;
}
