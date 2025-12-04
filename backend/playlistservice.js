const { Groq } = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generatePlaylist = async (moodPrompt, tracks) => {
  try {
    const trackList = tracks
      .map((t, i) => `${i + 1}. ${t.filename}`)
      .join('\n');

    const prompt = `You are a DJ that creates mood-based playlists.

Given the mood "${moodPrompt}", select 3–6 BEST matching tracks from the list below, in order.
Use ONLY these exact filenames. Do NOT invent or rename tracks.

Return ONLY valid JSON (no markdown):

{
  "playlist": [
    { "filename": "song1.mp3", "order": 1, "weight": 0.95 },
    { "filename": "song2.mp3", "order": 2, "weight": 0.85 }
  ]
}

Available tracks:
${trackList}`;

    const response = await groq.chat.completions.create({
      // 🔁 updated model here:
      model: 'llama-3.3-70b-versatile',   // or 'llama-3.1-8b-instant'
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 512
    });

    const text = response.choices[0].message.content;
    console.log('Groq raw:', text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { playlist: [] };

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.playlist || !Array.isArray(parsed.playlist)) {
      return { playlist: [] };
    }

    return parsed;
  } catch (err) {
    console.error('Groq error:', err);
    return { playlist: [] };
  }
};

module.exports = { generatePlaylist };
