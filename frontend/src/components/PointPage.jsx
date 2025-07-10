import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Při změně souřadnic vystředí mapu
function RecenterMap({ lat, lng }) {
const map = useMap();
useEffect(() => {
map.setView([lat, lng], map.getZoom());
}, [lat, lng, map]);
return null;
}

// Ikona otazníku pro oblasti
const questionIcon = L.divIcon({
html: '<div style="font-size:24px; color: var(--color-primary)">?</div>',
className: '',
iconSize: [30, 30],
iconAnchor: [15, 15],
});

export default function PointPage() {
const { id } = useParams();
const navigate = useNavigate();
const [point, setPoint] = useState(null);
const [code, setCode] = useState('');
const [error, setError] = useState('');
const [selected, setSelected] = useState({});
const [showHints, setShowHints] = useState({
  1: false,
  2: false,
  3: false
});
useEffect(() => {
  setShowHints({1:false,2:false,3:false});
}, [id]);
const toggleHint = idx => {
  setShowHints(prev => ({ ...prev, [idx]: !prev[idx] }));
};

const [submitted, setSubmitted] = useState(false);
const maxId = 8;

// Načtení dat bodu
useEffect(() => {
  fetch('https://odgame-backend.onrender.com/api/points')
    .then(res => {
      return res.json();
    })
    .then(data => {
      const p = data.find(item => item.id === parseInt(id, 10));
      if (p) {
        setPoint(p);
setCode('');
setError('');
setSelected({});
setSubmitted(false);
} else {
navigate('/');
}
})
.catch(() => setError('Nelze načíst data bodu.'));
}, [id, navigate]);
if (!point) {
  return <p>Načítám…</p>;
}

// Odeslání kódu nebo validace kvízu
const handleSubmit = e => {
e.preventDefault();
setError('');
if (point.quiz) {
// Klientská validace kvízu
const score = point.quiz.reduce(
(sum, q, idx) => sum + (selected[idx] === q.correct ? 1 : 0),
0
);
if (code === String(score)) {
const next = parseInt(id, 10) + 1;
navigate(next > maxId ? '/complete' : `/point/${next}`);
} else {
setError(`Špatně – měl jsi ${score} správně.`);
}
return;
}
// Standardní serverová validace
fetch('https://odgame-backend.onrender.com/api/validate', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ pointId: parseInt(id, 10), code }),
})
.then(res => res.json())
.then(data => {
if (data.success) {
const next = parseInt(id, 10) + 1;
navigate(next > maxId ? '/complete' : `/point/${next}`);
} else {
setError('Špatný kód, zkuste to znovu.');
}
})
.catch(() => setError('Chyba serveru.'));
};

if (!point) return <p>Načítám...</p>;

const center = [point.lat, point.lng];
const hasArea = point.areaRadius > 0;

// Počet správných odpovědí pro zobrazení skóre
const score = point.quiz
? point.quiz.reduce((sum, q, idx) => sum + (selected[idx] === q.correct ? 1 : 0), 0)
: 0;

return ( <div className="point-page"> <h1>Bod {point.id}: {point.name}</h1>
  <MapContainer center={center} zoom={16} style={{ height: '300px', width: '100%' }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <RecenterMap lat={point.lat} lng={point.lng} />
    {hasArea ? (
      <>
        <Circle center={center} pathOptions={{ color: 'var(--color-primary)', fillOpacity: 0.2 }} radius={point.areaRadius} />
        <Marker position={center} icon={questionIcon} />
      </>
    ) : (
      <Marker position={center} />
    )}
  </MapContainer>
  
{point.motivation && (
   <div className="motivation">
     <p>{point.motivation}</p>
   </div>
 )}

  {point.image && <img src={point.image} alt={point.name} style={{ maxWidth: '100%', margin: '1rem 0' }} />}
  {point.images?.length > 0 && (
  <div className="images">
    {point.images.map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt={`${point.name} obrázek ${idx + 1}`}
        style={{ maxWidth: '50%', margin: '0.5rem 0' }}
      />
    ))}
    </div>
)}
  {point.audio && <audio controls style={{ width: '100%', marginBottom: '1rem' }}><source src={point.audio} /></audio>}
  {point.description && <p className="description">{point.description}</p>}{point.id === maxId ? (
  <div className="complete-button">
    <button onClick={() => navigate('/complete')}>
      Pokračovat
    </button>
  </div>
  ) : point.quiz ? (
    <div className="quiz">
      <h2>Kvíz</h2>
      {point.quiz.map((q, idx) => (
        <div key={idx} className="question">
          <p>{q.question}</p>
          {q.options.map(opt => (
            <label key={opt} style={{ display: 'block', margin: '0.5rem 0' }}>
              <input
                type="radio"
                name={`q${idx}`} value={opt}
                disabled={submitted}
                checked={selected[idx] === opt}
                onChange={() => setSelected(prev => ({ ...prev, [idx]: opt }))}
              /> {opt}
            </label>
          ))}
          {submitted && (
            selected[idx] === q.correct
              ? <p className="correct">Správně!</p>
              : <p className="incorrect">Špatně! Správná odpověď: {q.correct}</p>
          )}
        </div>
      ))}
      {!submitted ? (
        <button onClick={() => setSubmitted(true)}>Odeslat</button>
      ) : (
        <div className="quiz-complete">
          <p>Výsledek: {score} / {point.quiz.length}</p>
          <button onClick={() => {
            const next = parseInt(id, 10) + 1;
            navigate(next > maxId ? '/complete' : `/point/${next}`);
          }}>Pokračovat</button>
        </div>
      )}
    </div>
  ):(
    <>
        <p>{point.puzzle}</p>      
        <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={point.answer || 'Zadejte kód'}
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button type="submit">Potvrdit</button>
      </form>
      {error && <p className="error">{error}</p>}

   <div className="hints">
        {point.hint1 && (
          <div>
            <button type="button" className="hint-toggle" onClick={() => toggleHint(1)}>
              NÁPOVĚDA 1
            </button>
            {showHints[1] && <p className="hint hint-1">{point.hint1}</p>}
          </div>
        )}
        {point.hint2 && (
          <div>
            <button type="button" className="hint-toggle" onClick={() => toggleHint(2)}>
              NÁPOVĚDA 2
            </button>
            {showHints[2] && <p className="hint hint-2">{point.hint2}</p>}
          </div>
        )}
        {point.hint3 && (
          <div>
            <button type="button" className="hint-toggle" onClick={() => toggleHint(3)}>
              NÁPOVĚDA 3
            </button>
            {showHints[3] && <p className="hint hint-3">{point.hint3}</p>}
          </div>
        )}
      </div>
    </>
  )}
</div>
  );
}