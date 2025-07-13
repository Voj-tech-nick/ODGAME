import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [code, setCode]       = useState('');
  const [error, setError]     = useState('');
  const [showHints, setShow]  = useState({ 1: false, 2: false, 3: false });
  const navigate              = useNavigate();

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
    <><div className="landing-page">
      <h1>Vítejte ve hře <em>Záhada orloje</em></h1>
      <img
        src="/images/úvod.png"
        alt="Úvodní obrazek"
        style={{ maxWidth: '100%', height: 'auto' }} />
      <p><strong>Orloj u Divadla loutek se zastavil.</strong><br>
Archivář Karel Kašpárek náhle odešel do důchodu – a zároveň zmizel. Spolu s ním zmizely i plány na opravu orloje, které nikdo jiný nezná. Bez nich zůstane orloj navždy tichý.</p>

<p>Vaším úkolem je zjistit, co se stalo, a vypátrat archivářovy stopy. Budete se pohybovat centrem Ostravy, hledat místa spojená s jeho minulostí, luštit hádanky, odemykat stopy a postupně skládat celý příběh.</p>

<h2>Co vás čeká:</h2>
<ul>
  <li>Trasa měří přibližně 3 kilometry</li>
  <li>Hra trvá zhruba 90 minut</li>
  <li>Stačí vám chytrý telefon s připojením k internetu</li>
  <li>Trasa je vhodná i pro kočárky</li>
  <li>Začínáte i končíte u Divadla loutek Ostrava</li>
  <li>Během pátrání budete zadávat různá <strong>hesla</strong> – žádné z nich neobsahuje <strong>mezery</strong>, <strong>nezáleží na velikosti písmen</strong>, ale <strong>diakritika je důležitá</strong></li>
</ul>

<p>Buďte všímaví a spolupracujte – některé indicie mohou být nenápadné, schované v detailech kolem vás.</p>

<h2>Zahájení pátrání</h2>

<p>Právě jste se přihlásili jako expertní tým spolupracující s IT oddělením ostravské policie. Byli jste povoláni k případu zmizelého archiváře – umíte číst mezi řádky, všímat si souvislostí a spojovat stopy.</p>

<p>Policie naposledy lokalizovala archivářův telefon v okolí Divadla loutek. Je rozbitý a zamčený, ale může obsahovat zásadní vodítka. Přesné místo však zatím neznáme.</p>

<p><strong>Vaším prvním úkolem je najít tento rozbitý telefon a opsat jeho sériové číslo.</strong></p>

</div>
<div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Zadej kód"
          value={code}
          onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Odeslat</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div><div className="hints">
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
      </div></>
     );
}
export default LandingPage;