import React from 'react';
import './TopTracks.css';

function TopTracks({ topTracks }) {
  if (!topTracks || topTracks.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No tracks yet. Upload and generate playlists to see stats!</p>
      </div>
    );
  }

  return (
    <div className="top-tracks-section">
      <div className="tracks-grid">
        {topTracks.map((track, index) => (
          <div key={track._id} className="track-card">
            <div className="rank">#{index + 1}</div>
            <div className="track-details">
              <p className="filename">{track.filename}</p>
              <div className="usage-bar">
                <div 
                  className="usage-fill"
                  style={{ width: `${Math.min(100, (track.usageCount / (topTracks?.usageCount || 1)) * 100)}%` }}
                ></div>
              </div>
              <p className="usage-count">🎵 {track.usageCount} uses</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopTracks;
