import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/validate', {
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
      <h1>Vítejte ve hře <em>Záhada orloje</em></h1>
      <img 
        src="/images/úvod.png"
        alt="Úvodní obrazek" 
        style={{ maxWidth: '100%', height: 'auto' }} 
      />
      <p>Orloj u Divadla loutek se zastavil. Archivář Karel Kašpárek náhle odešel do důchodu – a zároveň zmizel. Spolu s ním zmizely i plány k opravě orloje, které nikdo jiný nezná. Bez nich orloj zůstane navždy tichý.</p>
      <p>Vaším úkolem je zjistit, co se stalo, a vypátrat archivářovy stopy. Budete se pohybovat centrem Ostravy, hledat místa spojená s jeho minulostí, luštit hádanky, odemykat stopy a postupně skládat celý příběh.</p>
      <h2>Co vás čeká:</h2>
  <ul>
    <li>Trasa měří přibližně 3 kilometry</li>
    <li>Hra trvá kolem 90 minut</li>
    <li>Stačí vám chytrý telefon s připojením k internetu</li>
    <li>Trasa je vhodná pro kočárky</li>
    <li>Začínáte i končíte u Divadla loutek Ostrava</li>
     <p>Důležitá bude všímavost a týmová spolupráce. Sledujte detaily kolem sebe – některé indicie mohou být na první pohled nenápadné.</p>

  <h2>Zahájení pátrání</h2>

  <p>Právě se hlásíte jako expertní tým spolupracující s IT oddělením ostravské policie. Byl jste povoláni k případu ztraceného archiváře, protože dokážete číst mezi řádky, všímat si souvislostí a spojovat stopy. Během pátraní nás bude posouvat spousta hesel, ale žádne z nich neobsahuje mezery, na velikosti písmen nezáleží, ale na diakritice už ano.</p>

  <p>Policie lokalizovala archivářův telefon naposledy v okolí Divadla loutek. Je rozbitý a zamčený, ale může obsahovat zásadní vodítka. Nevíme však přesně, kde se nachází.</p>

  <p><strong>Vaším prvním úkolem je najít tento rozbitý telefon a opsat jaho sériové číslo.</strong></p>

  </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="NOKIA3310"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Odeslat</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LandingPage;
