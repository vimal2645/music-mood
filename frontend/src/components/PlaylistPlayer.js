import React, { useState, useEffect, useRef } from 'react';
import './PlaylistPlayer.css';

function PlaylistPlayer({ playlist, tracks }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const hasPlaylist =
    playlist && Array.isArray(playlist.tracks) && playlist.tracks.length > 0;

  const currentTrack = hasPlaylist
    ? tracks.find(t => t._id === playlist.tracks[currentTrackIndex]?.trackId)
    : null;

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  // Reset + autoplay when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrackIndex, currentTrack?.filepath]);

  const handleNext = () => {
    if (!hasPlaylist) return;
    if (currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!hasPlaylist) return;
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleSelectTrack = (index) => {
    if (!hasPlaylist) return;
    setCurrentTrackIndex(index);
  };

  if (!hasPlaylist) {
    return (
      <div className="empty-state">
        <p>📭 No playlist generated yet. Enter a mood and generate a mix!</p>
      </div>
    );
  }

  return (
    <div className="player-section">
      <div className="player-info">
        <p className="mood-badge">
          Mood: <strong>{playlist.moodPrompt}</strong>
        </p>
        <p className="track-count">{playlist.tracks.length} tracks</p>
      </div>

      {currentTrack && (
        <div className="player-main">
          <h3>Now Playing</h3>
          <p className="track-name">{currentTrack.filename}</p>
          <audio ref={audioRef} controls className="audio-player">
            <source
              src={`${API_BASE}${currentTrack.filepath}`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
          <p className="track-indicator">
            Track {currentTrackIndex + 1} of {playlist.tracks.length}
          </p>
        </div>
      )}

      <div className="controls">
        <button onClick={handlePrevious} disabled={currentTrackIndex === 0}>
          ⏮️ Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentTrackIndex === playlist.tracks.length - 1}
        >
          Next ⏭️
        </button>
      </div>

      {/* Playlist queue list */}
      <div className="playlist-queue">
        <h4>Queue</h4>
        <div className="queue-list">
          {playlist.tracks.map((track, idx) => {
            const trackData = tracks.find(t => t._id === track.trackId);
            return (
              <div
                key={idx}
                className={`queue-item ${
                  idx === currentTrackIndex ? 'active' : ''
                }`}
                onClick={() => handleSelectTrack(idx)}
              >
                <span>{idx + 1}</span>
                <span>{trackData?.filename}</span>
                <span className="weight">
                  {(track.weight * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlaylistPlayer;
