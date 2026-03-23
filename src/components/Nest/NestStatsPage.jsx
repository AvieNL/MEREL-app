import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRecords } from '../../hooks/useRecords';
import {
  buildNestExportData, exportNestJSON, exportNestJSONBackup,
  exportNestCSV, exportAviNestTXT, exportAviNestXML,
} from '../../utils/nestExport';

const HUIDIG_JAAR = new Date().getFullYear();

export default function NestStatsPage() {
  const { t } = useTranslation();
  const { nesten, legsels, bezoeken, ringen } = useNestData();
  const { records: vangsten } = useRecords();
  const species = useSpeciesRef();

  const speciesByEuring = useMemo(() => {
    const map = {};
    species.forEach(s => { if (s.euring_code) map[s.euring_code] = s; });
    return map;
  }, [species]);

  const beschikbareJaren = useMemo(() => {
    const jaren = new Set(legsels.map(l => l.jaar).filter(Boolean).map(String));
    jaren.add(String(HUIDIG_JAAR));
    return [...jaren].sort((a, b) => b - a);
  }, [legsels]);

  const [seizoenFilter, setSeizoenFilter] = useState(String(HUIDIG_JAAR));

  const stats = useMemo(() => {
    const jaar = parseInt(seizoenFilter, 10);
    const legselsInJaar = legsels.filter(l => l.jaar === jaar);
    const legselIds = new Set(legselsInJaar.map(l => l.id));
    const bezoeken_jaar = bezoeken.filter(b => legselIds.has(b.legsel_id));

    // Nesten met legsel dit jaar
    const nestenMetLegsel = new Set(legselsInJaar.map(l => l.nest_id));
    const nestenMetBezoek = new Set(
      bezoeken_jaar.map(b => legsels.find(l => l.id === b.legsel_id)?.nest_id).filter(Boolean)
    );

    // Soorten verdeling
    const soortTelling = {};
    legselsInJaar.forEach(l => {
      if (!l.soort_euring) return;
      soortTelling[l.soort_euring] = (soortTelling[l.soort_euring] || 0) + 1;
    });

    // Stadium verdeling (laatste bezoek per legsel)
    const stadiumTelling = {};
    legselsInJaar.forEach(legsel => {
      const bezoekenVanLegsel = bezoeken_jaar
        .filter(b => b.legsel_id === legsel.id)
        .sort((a, b) => b.datum.localeCompare(a.datum));
      const laatste = bezoekenVanLegsel[0];
      if (laatste?.stadium) {
        stadiumTelling[laatste.stadium] = (stadiumTelling[laatste.stadium] || 0) + 1;
      }
    });

    // Bezoeken per maand
    const maandTelling = {};
    bezoeken_jaar.forEach(b => {
      const maand = b.datum.slice(0, 7); // YYYY-MM
      maandTelling[maand] = (maandTelling[maand] || 0) + 1;
    });

    return {
      aantalNesten: nesten.length,
      nestenMetSeizoen: nestenMetLegsel.size,
      nestenMetBezoek: nestenMetBezoek.size,
      aantalLegsels: legselsInJaar.length,
      aantalBezoeken: bezoeken_jaar.length,
      soortTelling,
      stadiumTelling,
      maandTelling,
    };
  }, [seizoenFilter, legsels, bezoeken, nesten]);

  const stadiumVolgorde = ['B1','B2','B3','E1','E2','E3','E4','N1','N2','N3','N4','C','P','L1','L2'];

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <select
          className="nest-seizoen-select"
          value={seizoenFilter}
          onChange={e => setSeizoenFilter(e.target.value)}
        >
          {beschikbareJaren.map(j => <option key={j} value={j}>{j}</option>)}
        </select>
      </div>

      {/* Kerngetallen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 24 }}>
        <StatTegel label={t('nest_stats_total_nests')} waarde={stats.aantalNesten} />
        <StatTegel label={t('nest_stats_active_season', { jaar: seizoenFilter })} waarde={stats.nestenMetSeizoen} />
        <StatTegel label={t('nest_stats_visited')} waarde={stats.nestenMetBezoek} />
        <StatTegel label={t('nest_stats_visits')} waarde={stats.aantalBezoeken} />
      </div>

      {/* Soorten */}
      {Object.keys(stats.soortTelling).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            {t('nest_stats_species')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(stats.soortTelling)
              .sort((a, b) => b[1] - a[1])
              .map(([euring, count]) => {
                const naam = speciesByEuring[euring]?.naam_nl || euring;
                const max = Math.max(...Object.values(stats.soortTelling));
                return (
                  <BarRij key={euring} label={naam} waarde={count} max={max} kleur="var(--success)" />
                );
              })}
          </div>
        </div>
      )}

      {/* Stadia */}
      {Object.keys(stats.stadiumTelling).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            {t('nest_stats_stadiums')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[...Object.entries(stats.stadiumTelling)]
              .sort((a, b) => {
                const ia = stadiumVolgorde.indexOf(a[0]);
                const ib = stadiumVolgorde.indexOf(b[0]);
                return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
              })
              .map(([stadium, count]) => {
                const max = Math.max(...Object.values(stats.stadiumTelling));
                return (
                  <BarRij key={stadium} label={stadium} waarde={count} max={max} kleur="var(--accent)" />
                );
              })}
          </div>
        </div>
      )}

      {/* Bezoeken per maand */}
      {Object.keys(stats.maandTelling).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            {t('nest_stats_visits_per_month')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(stats.maandTelling)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([maand, count]) => {
                const max = Math.max(...Object.values(stats.maandTelling));
                const [, mm] = maand.split('-');
                const maandNaam = new Date(maand + '-01').toLocaleDateString('nl-NL', { month: 'long' });
                return (
                  <BarRij key={maand} label={maandNaam} waarde={count} max={max} kleur="var(--warning, #f59e0b)" />
                );
              })}
          </div>
        </div>
      )}

      {stats.aantalBezoeken === 0 && stats.nestenMetSeizoen === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 40 }}>
          {t('nest_stats_empty', { jaar: seizoenFilter })}
        </p>
      )}

      {/* ── Export ── */}
      <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
          {t('nest_export_title')}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t('nest_export_summary', {
            nesten: nesten.length,
            legsels: legsels.length,
            bezoeken: bezoeken.length,
            ringen: ringen.length,
          })}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {t('nest_export_hint')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-secondary"
            onClick={() => {
              const data = buildNestExportData({ nesten, legsels, bezoeken, ringen, jaar: seizoenFilter, speciesByEuring });
              exportNestCSV(data, seizoenFilter);
            }}
          >
            ↓ {t('nest_export_csv_label')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => exportAviNestTXT({ nesten, legsels, bezoeken, ringen, vangsten: vangsten ?? [], speciesByEuring })}
          >
            ↓ {t('nest_export_csv_label')} (AviNest TXT — alle jaren)
          </button>
          <button
            className="btn-secondary"
            onClick={() => exportAviNestXML({ nesten, legsels, speciesByEuring })}
          >
            ↓ {t('nest_export_xml_label')}
          </button>
          <button
            className="btn-secondary"
            onClick={() => exportNestJSONBackup({ nesten, legsels, bezoeken, ringen, vangsten: vangsten ?? [] })}
          >
            ↓ {t('nest_export_json_label')}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatTegel({ label, waarde }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>{waarde}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function BarRij({ label, waarde, max, kleur }) {
  const pct = max > 0 ? (waarde / max) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 110, fontSize: '0.8rem', color: 'var(--text-secondary)', flexShrink: 0, textAlign: 'right' }}>{label}</div>
      <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 3, height: 16, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, background: kleur, height: '100%', borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
      <div style={{ width: 24, fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{waarde}</div>
    </div>
  );
}
