import React, { useState } from 'react';

/**
 * SongQueue Component
 * Allows users to add songs to a queue, view the queue, and remove songs from it.
 */
function SongQueue() {
  const [queue, setQueue] = useState([]);
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');

  // Add a song to the queue
  const handleAddSong = (e) => {
    e.preventDefault();
    if (songTitle.trim() === '') return;
    setQueue([
      ...queue,
      {
        id: Date.now(),
        title: songTitle,
        artist: songArtist,
      },
    ]);
    setSongTitle('');
    setSongArtist('');
  };

  // Remove a song from the queue by id
  const handleRemoveSong = (id) => {
    setQueue(queue.filter((song) => song.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Song Queue</h2>
      <form onSubmit={handleAddSong} className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Song Title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="text"
          placeholder="Artist (optional)"
          value={songArtist}
          onChange={(e) => setSongArtist(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
        >
          Add to Queue
        </button>
      </form>
      <ul className="divide-y">
        {queue.length === 0 && (
          <li className="text-gray-500 text-center py-4">No songs in queue.</li>
        )}
        {queue.map((song) => (
          <li key={song.id} className="flex items-center justify-between py-2">
            <div>
              <span className="font-medium">{song.title}</span>
              {song.artist && (
                <span className="text-gray-500 ml-2">by {song.artist}</span>
              )}
            </div>
            <button
              onClick={() => handleRemoveSong(song.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Function to display the current queue in the console
function displayQueue(queue) {
  if (!Array.isArray(queue) || queue.length === 0) {
    console.log("The queue is currently empty.");
    return;
  }
  console.log("Current Song Queue:");
  queue.forEach((song, idx) => {
    if (song.artist) {
      console.log(`${idx + 1}. ${song.title} by ${song.artist}`);
    } else {
      console.log(`${idx + 1}. ${song.title}`);
    }
  });
}


export default SongQueue;
