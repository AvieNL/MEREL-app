import { VERSIE, CHANGELOG } from '../../data/changelog';
import { formatDatum } from '../../utils/dateHelper';
import './OverPage.css';

export default function OverPage() {
  return (
    <div className="over-page">
      <h1>VRS App <span className="over-version">v{VERSIE}</span></h1>

      <div className="over-sectie">
        <h2>Over deze app</h2>
        <p>
          VRS App is een digitaal veldregistratiesysteem voor vogelringers.
          De app vervangt papieren formulieren en maakt het mogelijk om vangsten
          direct in het veld te registreren — ook zonder internetverbinding.
          Gegevens worden automatisch gesynchroniseerd met de cloud en kunnen
          worden geëxporteerd naar Griel XML-formaat voor aanlevering bij het
          Vogeltrekstation.
        </p>
      </div>

      <div className="over-sectie">
        <h2>Maker</h2>
        <p>Thijs ter Avest</p>
        <p>VRS Breedenbroek (Gelderland)</p>
        <p><a href="mailto:thijs@teravest.net">thijs@teravest.net</a></p>
      </div>

      <div className="over-sectie">
        <h2>Bronnen</h2>
        <ul>
          <li>EURING Exchange Code 2000+ v1161 — du Feu, Clark, Fiedler, Baillie &amp; Laesser (2016)</li>
          <li>Ringmaten NLA — Speek, Van der Jeugd &amp; Van den Berg (2025)</li>
          <li>CES-handleiding — Vogeltrekstation (2012)</li>
          <li>Griel bulkupload specificatie — Vogeltrekstation</li>
          <li>Handkenmerken voor Dummies (en gevorderen) 2.0 — Klaasen, Sandifort &amp; De Vries</li>
          <li>Identification Guide to Birds in the Hand — Demongin (2016)</li>
          <li>Leaflet — open-source kaartbibliotheek</li>
        </ul>
      </div>

      <div className="over-sectie">
        <h2>Versiegeschiedenis</h2>
        <div className="over-changelog">
          {CHANGELOG.map(entry => (
            <div key={entry.versie} className="over-changelog-entry">
              <div className="over-changelog-header">
                <span className="over-changelog-versie">v{entry.versie}</span>
                <span className="over-changelog-datum">{formatDatum(entry.datum)}</span>
              </div>
              <ul>
                {entry.wijzigingen.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
