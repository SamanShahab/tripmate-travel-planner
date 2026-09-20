const express = require('express');
const router = express.Router();
const https = require('https');

const cityMap = {
  'hunza valley': 'Gilgit',
  'hunza': 'Gilgit',
  'skardu': 'Skardu,PK',
  'baltistan': 'Skardu,PK',
  'swat valley': 'Saidu Sharif',
  'swat': 'Saidu Sharif',
  'murree': 'Murree',
  'naran': 'Naran',
  'kaghan': 'Naran',
  'fairy meadows': 'Chilas',
  'bali': 'Denpasar',
  'maldives': 'Male',
};

router.get('/:city', (req, res) => {
  const raw = req.params.city.toLowerCase().trim();
  const city = cityMap[raw] || req.params.city;
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.cod !== '200' && parsed.cod !== 200) {
          return res.status(404).json({ message: parsed.message || 'City not found' });
        }
        res.json(parsed);
      } catch {
        res.status(500).json({ message: 'Failed to parse weather data' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ message: 'Weather API request failed', error: err.message });
  });
});

module.exports = router;
