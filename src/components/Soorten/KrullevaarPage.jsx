import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './KrullevaarPage.css';

function maakVeer() {
  return {
    id: Math.random(),
    left: Math.random() * 96,
    duur: 4 + Math.random() * 5,
    delay: Math.random() * -8,
    grootte: 1.4 + Math.random() * 1.6,
    sway: (Math.random() - 0.5) * 120,
    rotStart: Math.floor(Math.random() * 360),
  };
}

const INIT_VEREN = Array.from({ length: 28 }, maakVeer);

export default function KrullevaarPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function voegVeerToe() {
      const v = maakVeer();
      const span = document.createElement('span');
      span.className = 'kv-veer';
      span.textContent = '🪶';
      span.style.cssText = `
        left: ${v.left}vw;
        font-size: ${v.grootte}rem;
        animation-duration: ${v.duur}s;
        animation-delay: 0s;
        --sway: ${v.sway}px;
        --rot-start: ${v.rotStart}deg;
        --rot-end: ${v.rotStart + 540}deg;
      `;
      container.appendChild(span);
      setTimeout(() => span.remove(), v.duur * 1000 + 200);
    }
    const interval = setInterval(voegVeerToe, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page kv-page">

      {/* Vallende veren */}
      <div className="kv-veren-container" ref={containerRef} aria-hidden="true">
        {INIT_VEREN.map(v => (
          <span
            key={v.id}
            className="kv-veer"
            style={{
              left: `${v.left}vw`,
              fontSize: `${v.grootte}rem`,
              animationDuration: `${v.duur}s`,
              animationDelay: `${v.delay}s`,
              '--sway': `${v.sway}px`,
              '--rot-start': `${v.rotStart}deg`,
              '--rot-end': `${v.rotStart + 540}deg`,
            }}
          >
            🪶
          </span>
        ))}
      </div>

      <button className="btn-secondary page-back" onClick={() => navigate(-1)}>← Terug</button>

      {/* Hero — zelfde structuur als SoortDetail */}
      <div className="sd-hero">
        <div className="sd-foto kv-foto">
          <img
            src="/krullevaar.jpg"
            alt="De Krullevaar — illustratie Fiep Westendorp"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 18%',
              display: 'block',
            }}
          />
        </div>
        <div className="sd-hero-info">
          <h2 className="sd-title">Krullevaar</h2>
          <p className="sd-subtitle">Ciconia pettefletensis</p>
          <div className="sd-badges">
            <span className="sd-badge sd-badge-accent">EURING 00001</span>
            <span className="sd-badge sd-badge-muted">Ill. Fiep Westendorp (1971)</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="sd-card">
        <blockquote className="kv-quote">
          "Er woont een vogel in de Petteflet. Hij heet de Krullevaar."
        </blockquote>
        <p className="kv-bron">
          Schmidt, A.M.G. (1971). <em>Pluk van de Petteflet.</em> Em. Querido's Uitgeverij.
        </p>
      </div>

      {/* Determinatie */}
      <div className="sd-card">
        <h3 className="sd-card-title">Determinatie</h3>
        <p className="sd-notities-text">
          Onverwisselbaar. Krul op de kop is diagnostisch. Vleugels opvallend groot voor een
          appartementsbewoner. Woont permanent op zolder van de Petteflet, Ottocar Stamstraat.
        </p>
        <p className="sd-notities-text" style={{ marginTop: 8 }}>
          Verwar niet met gewone Ooievaar <em>Ciconia ciconia</em> — die woont buiten.
          Verwar ook niet met de Kraanvogel <em>Grus grus</em>: de Krullevaar heeft een
          vast woonadres.
        </p>
      </div>

      {/* Biometrie */}
      <div className="sd-card">
        <h3 className="sd-card-title">Biometrie</h3>
        <div className="sd-row">
          <span className="sd-label">Vleugel</span>
          <span className="sd-value">310–312 mm</span>
        </div>
        <div className="sd-row">
          <span className="sd-label">Tarsus</span>
          <span className="sd-value">198–203 mm (past net op de vensterbank)</span>
        </div>
        <div className="sd-row">
          <span className="sd-label">Gewicht</span>
          <span className="sd-value">1800–4200 g (afhankelijk van wat Pluk heeft gekookt)</span>
        </div>
        <p className="kv-bron" style={{ marginTop: 10 }}>Bron: eigen waarneming vanuit de lift</p>
      </div>

      {/* Rui */}
      <div className="sd-card">
        <h3 className="sd-card-title">Rui</h3>
        <p className="sd-notities-text">
          Geen rui geregistreerd. Nieuwe veren worden incidenteel door Pluk bijgeknipt
          met de keukenschaar. Tijdstip onbekend, vermoedelijk na de maaltijd.
        </p>
      </div>

      {/* Leeftijd & geslacht */}
      <div className="sd-card">
        <h3 className="sd-card-title">Leeftijd &amp; geslacht</h3>
        <p className="sd-notities-text">
          <strong>Leeftijd:</strong> Niet bepaalbaar. De Krullevaar woont al in de Petteflet
          zolang de Petteflet bestaat. Iris: geel, met een welwillende blik.
        </p>
        <p className="sd-notities-text" style={{ marginTop: 8 }}>
          <strong>Geslacht:</strong> Niet te bepalen. De Krullevaar heeft zich hier nooit
          over uitgelaten. Geen betrouwbaar visueel kenmerk.
        </p>
      </div>

      {/* Vangst-checklist */}
      <div className="sd-card">
        <h3 className="sd-card-title">Vangst-checklist</h3>
        <ul className="kv-checklist">
          <li>🔔 Vraag of Pluk thuis is <em>(belang: hoog)</em></li>
          <li>🛗 Controleer of de lift werkt <em>(belang: hoog)</em></li>
          <li>🚗 Noteer aanwezigheid van Dolly <em>(belang: gemiddeld)</em></li>
          <li>📏 Tarsus meten — pas op voor lift <em>(belang: laag)</em></li>
        </ul>
      </div>

      {/* Ondersoorten */}
      <div className="sd-card">
        <h3 className="sd-card-title">Ondersoorten</h3>
        <p className="sd-notities-text">
          <strong>pettefletensis</strong> (zolder, Petteflet, Ottocar Stamstraat) — Nominaatvorm.
          Enige bekende broedvogel van dit adres.
        </p>
        <p className="sd-notities-text" style={{ marginTop: 8 }}>
          <strong>terrasformis</strong> (platte daken, grote steden) — Zeldzaam. Overwinteraar.
          Wordt soms verward met een schotelantenne.
        </p>
      </div>

      {/* Literatuur */}
      <div className="sd-card">
        <h3 className="sd-card-title">Literatuur</h3>
        <ul className="kv-checklist">
          <li>Schmidt, A.M.G. (1971). <em>Pluk van de Petteflet.</em> Em. Querido's Uitgeverij.</li>
          <li>Blok, C. (ill.) (1971). <em>Pluk van de Petteflet — Illustraties.</em></li>
        </ul>
      </div>

    </div>
  );
}
