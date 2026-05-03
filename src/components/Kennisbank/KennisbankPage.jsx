import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KENNISBANK, getKennisbankCategorieen } from '../../data/kennisbank';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import BronBadge from '../shared/BronBadge';
import './KennisbankPage.css';

// ── Renderers per sectietype ─────────────────────────────────────────────────

function SectieTekst({ sectie }) {
  return <p className="kb-tekst">{sectie.tekst}</p>;
}

function SectieLijst({ sectie }) {
  return (
    <ul className="kb-lijst">
      {sectie.items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function SectieDefinitielijst({ sectie }) {
  return (
    <dl className="kb-dl">
      {sectie.items.map((item, i) => (
        <div key={i} className="kb-dl-item">
          <dt className="kb-dt">{item.term}</dt>
          <dd className="kb-dd">{item.definitie}</dd>
        </div>
      ))}
    </dl>
  );
}

function SectieTabel({ sectie }) {
  return (
    <div className="kb-tabel-wrapper">
      <table className="kb-tabel">
        <thead>
          <tr>{sectie.koptekst.map((k, i) => <th key={i}>{k}</th>)}</tr>
        </thead>
        <tbody>
          {sectie.rijen.map((rij, i) => (
            <tr key={i}>
              {rij.map((cel, j) => <td key={j}>{cel}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectieWaarschuwing({ sectie }) {
  return (
    <div className="kb-waarschuwing">
      <span className="kb-waarschuwing-icon">⚠</span>
      {sectie.tekst}
    </div>
  );
}

function SectieKoptitel({ sectie }) {
  return <h4 className="kb-koptitel">{sectie.tekst}</h4>;
}

function SectieAfbeelding({ sectie }) {
  return (
    <figure className="kb-figuur">
      <img
        src={sectie.src}
        alt={sectie.alt}
        className="kb-afbeelding"
        loading="lazy"
      />
      {sectie.bijschrift && (
        <figcaption className="kb-bijschrift">{sectie.bijschrift}</figcaption>
      )}
    </figure>
  );
}

function renderSectie(sectie, i) {
  switch (sectie.type) {
    case 'tekst':           return <SectieTekst key={i} sectie={sectie} />;
    case 'lijst':           return <SectieLijst key={i} sectie={sectie} />;
    case 'definitielijst':  return <SectieDefinitielijst key={i} sectie={sectie} />;
    case 'tabel':           return <SectieTabel key={i} sectie={sectie} />;
    case 'waarschuwing':    return <SectieWaarschuwing key={i} sectie={sectie} />;
    case 'koptitel':        return <SectieKoptitel key={i} sectie={sectie} />;
    case 'afbeelding':      return <SectieAfbeelding key={i} sectie={sectie} />;
    default:                return null;
  }
}

// ── Artikel-kaart ────────────────────────────────────────────────────────────

function ArtikelKaart({ artikel }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`kb-artikel${open ? ' kb-artikel--open' : ''}`}>
      <button
        className="kb-artikel-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="kb-artikel-titels">
          <span className="kb-artikel-titel">{artikel.titel}</span>
          {artikel.soort && (
            <span className="kb-artikel-soort">{artikel.soort}</span>
          )}
        </div>
        <span className="kb-artikel-toggle">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="kb-artikel-inhoud">
          {artikel.bron && <BronBadge bron={artikel.bron} />}
          {artikel.secties.map((s, i) => renderSectie(s, i))}
        </div>
      )}
    </div>
  );
}

// ── Categorie-blok ───────────────────────────────────────────────────────────

function CategorieBlok({ categorie, artikelen }) {
  return (
    <section className="kb-categorie">
      <h3 className="kb-categorie-titel">{categorie}</h3>
      <div className="kb-artikelen">
        {artikelen.map(a => <ArtikelKaart key={a.id} artikel={a} />)}
      </div>
    </section>
  );
}

// ── Soorten-sectie (gedocumenteerde soorten uit Supabase) ────────────────────

function SoortenBankSectie() {
  const navigate = useNavigate();
  const allSpecies = useSpeciesRef();

  // Alleen soorten die een foto hebben (= volledig gedocumenteerd)
  const gedocumenteerd = allSpecies.filter(s => s.foto);

  if (gedocumenteerd.length === 0) return null;

  return (
    <section className="kb-categorie">
      <h3 className="kb-categorie-titel">Soorten ({gedocumenteerd.length})</h3>
      <div className="kb-soorten-grid">
        {gedocumenteerd.map(soort => (
          <button
            key={soort.naam_nl}
            className="kb-soort-kaart"
            onClick={() => navigate(`/kennis/soorten/${encodeURIComponent(soort.naam_nl)}`)}
          >
            <img
              className="kb-soort-foto"
              src={soort.foto}
              alt={soort.naam_nl}
              loading="lazy"
            />
            <div className="kb-soort-info">
              <span className="kb-soort-naam">{soort.naam_nl}</span>
              <span className="kb-soort-latijn">{soort.naam_lat}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Hoofd-pagina ─────────────────────────────────────────────────────────────

export default function KennisbankPage() {
  const [zoek, setZoek] = useState('');
  const categorieen = getKennisbankCategorieen();

  const q = zoek.toLowerCase().trim();
  const gefilterd = q
    ? KENNISBANK.filter(a =>
        a.titel.toLowerCase().includes(q) ||
        (a.soort?.toLowerCase().includes(q)) ||
        (a.categorie?.toLowerCase().includes(q)) ||
        a.secties.some(s =>
          (s.tekst?.toLowerCase().includes(q)) ||
          (s.items?.some(item =>
            (typeof item === 'string' && item.toLowerCase().includes(q)) ||
            (item.term?.toLowerCase().includes(q)) ||
            (item.definitie?.toLowerCase().includes(q))
          )) ||
          (s.rijen?.some(rij => rij.some(cel => cel.toLowerCase().includes(q))))
        )
      )
    : KENNISBANK;

  return (
    <div className="page kb-page">
      <div className="kb-topbar">
        <h2 className="kb-page-titel">Kennisbank</h2>
        <input
          className="kb-zoek"
          type="search"
          placeholder="Zoeken…"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
        />
      </div>

      {q ? (
        // Zoekresultaten — plat, zonder categoriegroepering
        <div className="kb-zoekresultaten">
          {gefilterd.length === 0 ? (
            <p className="kb-leeg">Geen resultaten voor "{zoek}".</p>
          ) : (
            gefilterd.map(a => <ArtikelKaart key={a.id} artikel={a} />)
          )}
        </div>
      ) : (
        // Normale weergave per categorie
        <>
          {categorieen.map(cat => {
            const artikelen = gefilterd.filter(a => a.categorie === cat);
            if (artikelen.length === 0) return null;
            return <CategorieBlok key={cat} categorie={cat} artikelen={artikelen} />;
          })}
          <SoortenBankSectie />
        </>
      )}
    </div>
  );
}
