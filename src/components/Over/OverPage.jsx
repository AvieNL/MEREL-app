import { VERSIE, CHANGELOG } from '../../data/changelog';
import './OverPage.css';

export default function OverPage() {
  return (
    <div className="over-page">
      <h1>VRS App</h1>
      <p className="over-version">v{VERSIE}</p>

      <div className="over-sectie">
        <h2>Maker</h2>
        <p>Thijs ter Avest</p>
        <p>VRS Breedenbroek (Gelderland)</p>
        <p>Ringernummer: 3254</p>
      </div>

      <div className="over-sectie">
        <h2>Over deze app</h2>
        <p>
          Vogelringregistratie-app voor in het veld. Werkt offline als PWA en
          exporteert naar Griel XML-formaat voor het Vogeltrekstation.
        </p>
      </div>

      <div className="over-sectie">
        <h2>Versiegeschiedenis</h2>
        <div className="over-changelog">
          {CHANGELOG.map(entry => (
            <div key={entry.versie} className="over-changelog-entry">
              <div className="over-changelog-header">
                <span className="over-changelog-versie">v{entry.versie}</span>
                <span className="over-changelog-datum">{entry.datum}</span>
              </div>
              <ul>
                {entry.wijzigingen.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="over-sectie">
        <h2>Bronnen</h2>
        <ul>
          <li>EURING Exchange Code 2000+ v1161 (2016)</li>
          <li>Ringmaten NLA — Speek, Van der Jeugd &amp; Van den Berg (2025)</li>
          <li>CES-handleiding — Vogeltrekstation (2012)</li>
        </ul>
      </div>
    </div>
  );
}
