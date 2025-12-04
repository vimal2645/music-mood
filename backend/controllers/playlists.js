const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const { generatePlaylist } = require('../playlistservice');
const { deleteCache } = require('../redis');

// Generate playlist
const generateMix = async (req, res) => {
  try {
    const { moodPrompt } = req.body;
    
    if (!moodPrompt) {
      return res.status(400).json({ error: 'Mood prompt required' });
    }

    const tracks = await Track.find();
    
    if (tracks.length === 0) {
      return res.status(400).json({ error: 'No tracks available. Upload music files first.' });
    }

    console.log(`🎵 Generating playlist for mood: "${moodPrompt}"`);
    const result = await generatePlaylist(moodPrompt, tracks);

    if (!result.playlist || result.playlist.length === 0) {
      return res.status(400).json({ error: 'Failed to generate playlist' });
    }

    // Map filenames back to track IDs and update usage count
    const playlistTracks = [];
    
    for (let p of result.playlist) {
      const track = tracks.find(t => t.filename === p.filename);
      if (track) {
        await Track.findByIdAndUpdate(track._id, { $inc: { usageCount: 1 } });
        playlistTracks.push({
          trackId: track._id,
          order: p.order,
          weight: p.weight
        });
      }
    }

    // Save playlist
    const playlist = new Playlist({
      moodPrompt,
      tracks: playlistTracks
    });

    await playlist.save();

    // Invalidate top tracks cache
    await deleteCache('top_tracks');

    console.log(`✅ Playlist generated with ${playlistTracks.length} tracks`);
    res.json({ 
      success: true, 
      playlist,
      message: `Generated ${playlistTracks.length}-track playlist`
    });
  } catch (err) {
    console.error('❌ Error generating mix:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all playlists
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate('tracks.trackId')
      .sort({ createdAt: -1 });
    res.json({ success: true, total: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { generateMix, getPlaylists };
