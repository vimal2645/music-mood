const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  moodPrompt: {
    type: String,
    required: true
  },
  tracks: [
    {
      trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
      },
      order: Number,
      weight: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
