import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [showHints, setShow]  = useState({ 1: false, 2: false, 3: false });
  const navigate              = useNavigate();

  // Přepínání nápověd
  const toggleHint = idx => {
    setShow(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://odgame-backend.onrender.com/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointId: 0, code }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/point/1');
      } else {
        setError('Špatný kód, zkuste to znovu.');
      }
    } catch (err) {
      console.error(err);
      setError('Chyba serveru. Zkuste to později.');
    }
  };

  return (
    <div className="landing-page">
      {/* … vaši stávající úvodní obsah … */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NOKIA3310"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button type="submit">Odeslat</button>
      </form>
      {error && <p className="error">{error}</p>}

      {/* --- sem vložíme nápovědy --- */}
      <div className="hints">
        <div>
          <button
            type="button"
            className="hint-toggle"
            onClick={() => toggleHint(1)}
          >
            NÁPOVĚDA 1
          </button>
          {showHints[1] && (
            <p className="hint hint-1">
              Pan Kašpárek si své věci uklízel na podivná místa, někdy i kolem divadla loutek.
            </p>
          )}
        </div>
        <div>
          <button
            type="button"
            className="hint-toggle"
            onClick={() => toggleHint(2)}
          >
            NÁPOVĚDA 2
          </button>
          {showHints[2] && (
            <p className="hint hint-2">
              Pan Kašpárek rád sedával v Loutkové kavárně na zahrádce.
            </p>
          )}
        </div>
        <div>
          <button
            type="button"
            className="hint-toggle"
            onClick={() => toggleHint(3)}
          >
            NÁPOVĚDA 3
          </button>
          {showHints[3] && (
            <p className="hint hint-3">
              Telefon najdete ve vitríně z boku nové budovy. Sériové číslo telefonu je KR4L2011.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
