import React, { useState } from 'react';
import './MoodPrompt.css';

function MoodPrompt({ onGenerate, loading }) {
  const [mood, setMood] = useState('');

  const suggestions = [
    'Calm focus',
    'Romantic evening',
    'Workout energy',
    'Happy vibes',
    'Deep relaxation',
    'Party mode'
  ];

  const handleGenerate = () => {
    if (!mood.trim()) {
      alert('Please enter a mood prompt');
      return;
    }
    onGenerate(mood);
  };

  return (
    <div className="mood-section">
      <input
        type="text"
        placeholder="E.g., calm focus, romantic evening..."
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
        disabled={loading}
        className="mood-input"
      />
      
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="generate-btn"
      >
        {loading ? '⏳ Generating...' : '✨ Generate Playlist'}
      </button>

      <div className="suggestions">
        <p>Quick suggestions:</p>
        <div className="tags">
          {suggestions.map((tag, i) => (
            <button
              key={i}
              className="tag"
              onClick={() => setMood(tag)}
              disabled={loading}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodPrompt;
