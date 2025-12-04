const Track = require('../models/Track');

// Upload track
const uploadTrack = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const track = new Track({
      filename: req.file.originalname,
      filepath: `/uploads/${req.file.filename}`,
      duration: 0
    });

    await track.save();
    console.log(`✅ Track uploaded: ${req.file.originalname}`);
    res.json({ success: true, track, message: 'Track uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tracks
const getTracks = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ uploadDate: -1 });
    res.json({ success: true, total: tracks.length, tracks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single track
const getTrack = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    res.json({ success: true, track });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete track
const deleteTrack = async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Track deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { uploadTrack, getTracks, getTrack, deleteTrack };
