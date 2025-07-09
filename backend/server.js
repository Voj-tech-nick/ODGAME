// Backend server using Express.js
// Install dependencies:
//   npm install express cors

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initial phone code for landing page
const initialPhoneCode = 'NOKIA3310';

// Load points data
const dataPath = path.join(__dirname, 'data', 'points.json');
let points = [];

function loadPoints() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    points = JSON.parse(raw);
    console.log(`Loaded ${points.length} points from points.json`);
  } catch (err) {
    console.error('Error loading points.json:', err);
  }
}

// Initial load
loadPoints();

// GET /api/points - return all points
app.get('/api/points', (req, res) => {
  res.json(points);
});

// POST /api/validate - validate answer code for a given point or the initial phone code
// Expecting JSON: { pointId: number, code: string }
app.post('/api/validate', (req, res) => {
  const { pointId, code } = req.body;
  if (pointId === 0) {
    const isValid = code && code.trim().toUpperCase() === initialPhoneCode;
    return res.json({ success: isValid });
  }

  const point = points.find(p => p.id === pointId);
  if (!point) {
    return res.status(404).json({ success: false, message: 'Point not found' });
  }

  const isValid = code && code.trim().toUpperCase() === point.answer.toUpperCase();
  res.json({ success: isValid });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
