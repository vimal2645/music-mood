const Track = require('../models/Track');
const { getCache, setCache } = require('../redis');

// Get top tracks with caching
const getTopTracks = async (req, res) => {
  try {
    const cacheKey = 'top_tracks';
    
    // Check cache first
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ 
        success: true, 
        fromCache: true, 
        data: cached,
        message: 'Data from cache'
      });
    }

    // Get top tracks from DB
    const topTracks = await Track.find()
      .sort({ usageCount: -1 })
      .limit(10);

    // Cache for 5 minutes (300 seconds)
    await setCache(cacheKey, topTracks, 300);

    res.json({ 
      success: true, 
      fromCache: false, 
      data: topTracks,
      message: 'Data from database'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTopTracks };
