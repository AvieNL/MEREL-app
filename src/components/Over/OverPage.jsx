import { useTranslation } from 'react-i18next';
import { VERSIE, CHANGELOG } from '../../data/changelog';
import { formatDatum } from '../../utils/dateHelper';
import './OverPage.css';

export default function OverPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="over-page">
      <h1>VRS App <span className="over-version">v{VERSIE}</span></h1>

      <div className="over-sectie">
        <h2>{t('about_title')}</h2>
        <p>{t('about_app_description')}</p>
      </div>

      <div className="over-sectie">
        <h2>{t('about_maker')}</h2>
        <p>Thijs ter Avest</p>
        <p>VRS Breedenbroek (Gelderland)</p>
        <p><a href="mailto:thijs@teravest.net">thijs@teravest.net</a></p>
      </div>

      <div className="over-sectie">
        <h2>{t('about_sources')}</h2>
        <p className="over-sources-subtitle over-sources-subtitle--ring">{t('about_sources_ringing')}</p>
        <ul>
          <li>EURING Exchange Code 2000+ v1161 — du Feu, Clark, Fiedler, Baillie &amp; Laesser (2016)</li>
          <li>Ringmaten NLA — Speek, Van der Jeugd &amp; Van den Berg (2025)</li>
          <li>CES-handleiding — Vogeltrekstation (2012)</li>
          <li>Griel bulkupload specificatie — Vogeltrekstation</li>
          <li>Handkenmerken voor Dummies (en gevorderen) 2.0 — Klaasen, Sandifort &amp; De Vries</li>
          <li>Identification Guide to Birds in the Hand — Demongin (2016)</li>
        </ul>
        <p className="over-sources-subtitle over-sources-subtitle--nest">{t('about_sources_nest')}</p>
        <ul>
          <li>Handleiding Sovon nestonderzoek. De nestkaart: hoe, wat, waar, waarom — Bijlsma, Majoor &amp; Nienhuis (2020)</li>
          <li>Handleiding AviNest: de invoerapp voor Meetnet Nestkaarten — Goffin (2026)</li>
        </ul>
        <p className="over-sources-subtitle over-sources-subtitle--tech">{t('about_sources_tech')}</p>
        <ul>
          <li>Leaflet — open-source kaartbibliotheek</li>
        </ul>
      </div>

      <div className="over-sectie">
        <h2>{t('about_changelog')}</h2>
        <div className="over-changelog">
          {CHANGELOG.map(entry => (
            <div key={entry.versie} className="over-changelog-entry">
              <div className="over-changelog-header">
                <span className="over-changelog-versie">v{entry.versie}</span>
                <span className="over-changelog-datum">{formatDatum(entry.datum)}</span>
              </div>
              <ul>
                {(entry[`wijzigingen_${lang}`] || entry.wijzigingen).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
