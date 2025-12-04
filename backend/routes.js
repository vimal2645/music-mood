const express = require('express');
const router = express.Router();
const upload = require('./uploadMiddleware');
const { uploadTrack, getTracks, getTrack, deleteTrack } = require('./controllers/tracks');
const { generateMix, getPlaylists } = require('./controllers/playlists');
const { getTopTracks } = require('./controllers/stats');

// Track routes
router.post('/tracks/upload', upload.single('file'), uploadTrack);
router.get('/tracks', getTracks);
router.get('/tracks/:id', getTrack);
router.delete('/tracks/:id', deleteTrack);

// Playlist routes
router.post('/playlists/generate', generateMix);
router.get('/playlists', getPlaylists);

// Stats routes
router.get('/stats/top-tracks', getTopTracks);

module.exports = router;
