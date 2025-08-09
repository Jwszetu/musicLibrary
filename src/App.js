import React from 'react';
import HomePage from './HomePage';

/**
 * Main App Component
 * Renders the HomePage directly, as modal logic is now handled within HomePage.
 */
function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
