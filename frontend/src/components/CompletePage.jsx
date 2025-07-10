import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function CompletePage() {
  const navigate = useNavigate();
  // Feedback form state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  const handleRestart = () => {
    navigate('/');
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://odgame-backend.onrender.com/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'vojtech.havle@divadloloutek.cz', email, message })
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="complete-page">
      <h1>Gratulujeme!</h1>
      <p>Právě jste dokončili dobrodružnou hru v okolí Divadla loutek Ostrava.</p>

      <div className="complete-actions">
        <button className="btn-primary" onClick={handleRestart}>
          Zahájit znovu
        </button>
        <button className="btn-secondary" onClick={() => { window.location.href = 'https://www.divadloloutek.cz/'; }}>
          Návrat na web Divadla loutek
        </button>
      </div>

      <section className="feedback-section">
        <h2>Zpětná vazba a novinky</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>
            Váš email:
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vaše@email.cz"
              required
            />
          </label>
          <label>
            Zpráva:
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Napište nám svou zpětnou vazbu"
              required
            />
          </label>
          <button type="submit" className="btn-primary">
            Odeslat
          </button>
        </form>
        {status === 'loading' && <p>Odesílám...</p>}
        {status === 'success' && <p className="success">Děkujeme za zpětnou vazbu!</p>}
        
              {status === 'error' && <p className="error">Něco se pokazilo, zkuste to prosím později.</p>}
        {/* Sociální sítě */}
        <p className="social">
          Sledujte nás na <a href="https://www.instagram.com/divadloloutekostrava/" target="_blank" rel="noopener noreferrer">Instagramu Divadlo loutek Ostrava</a> a sdílejte s námi své fotky a zážitky!
        </p>
      </section>
    </div>
  );
}
