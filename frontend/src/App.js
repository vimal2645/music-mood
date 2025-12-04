import React, { useState, useEffect } from 'react';
import UploadMusic from './components/UploadMusic';
import MoodPrompt from './components/MoodPrompt';
import PlaylistPlayer from './components/PlaylistPlayer';
import TopTracks from './components/TopTracks';
import './App.css';

// ✅ API base for backend (Render URL by default)
const API_BASE =
  process.env.REACT_APP_API_BASE || 'https://music-mood-86s0.onrender.com';
const API = `${API_BASE}/api`;

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tracks
  const fetchTracks = async () => {
    try {
      const res = await fetch(`${API}/tracks`);
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      alert('Failed to fetch tracks');
    }
  };

  // Fetch top tracks
  const fetchTopTracks = async () => {
    try {
      const res = await fetch(`${API}/stats/top-tracks`);
      const data = await res.json();
      setTopTracks(data.data || []);
    } catch (err) {
      console.error('Error fetching top tracks:', err);
    }
  };

  // Generate playlist
  const handleGeneratePlaylist = async (moodPrompt) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/playlists/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moodPrompt })
      });
      const data = await res.json();

      if (data.success) {
        setPlaylist(data.playlist);
        await fetchTopTracks();
        alert(`✅ Generated ${data.playlist.tracks.length}-track playlist!`);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('Error generating playlist:', err);
      alert('Failed to generate playlist');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTracks();
    fetchTopTracks();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🎵 Music Mood DJ</h1>
        <p>AI-powered mood-based playlist generator</p>
      </header>

      <main className="container">
        <div className="grid">
          <section className="card">
            <h2>📤 Upload Music</h2>
            <UploadMusic onUpload={fetchTracks} />
            <p className="info">
              Total Tracks: <strong>{tracks.length}</strong>
            </p>
          </section>

          <section className="card">
            <h2>🎯 Generate Mix</h2>
            <MoodPrompt onGenerate={handleGeneratePlaylist} loading={loading} />
          </section>
        </div>

        <section className="card full-width">
          <h2>▶️ Your Playlist</h2>
          <PlaylistPlayer playlist={playlist} tracks={tracks} />
        </section>

        <section className="card full-width">
          <h2>🏆 Top 10 Tracks</h2>
          <TopTracks topTracks={topTracks} />
        </section>
      </main>

      <footer className="footer">
        <p>Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
