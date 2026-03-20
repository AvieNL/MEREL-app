import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { loadFromStorage } from '../../utils/storage';
import { toVangstRow } from '../../utils/supabase-helpers';
import './MigrationBanner.css';

const CHUNK_SIZE = 100;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function MigrationBanner({ onComplete }) {
  const { user } = useAuth();
  const { t } = useTranslation(['common', 'errors']);
  const [status, setStatus] = useState('checking'); // checking | needed | migrating | done | dismissed
  const [counts, setCounts] = useState({ records: 0, projects: 0, ringstrengen: 0 });
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    checkMigrationNeeded();
  }, [user]);

  async function checkMigrationNeeded() {
    // Al gemigreerd voor deze gebruiker?
    const migratedKey = `vrs-migrated-${user.id}`;
    if (localStorage.getItem(migratedKey)) {
      setStatus('done');
      return;
    }

    // Check of Supabase al data heeft
    const { count } = await supabase
      .from('vangsten')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count > 0) {
      localStorage.setItem(migratedKey, 'true');
      setStatus('done');
      return;
    }

    const records = loadFromStorage('vrs-records', []);
    const projects = loadFromStorage('vrs-projects', []);
    const ringStrengen = loadFromStorage('vrs-ringstreng', []);

    if (records.length === 0 && projects.length === 0) {
      localStorage.setItem(migratedKey, 'true');
      setStatus('done');
      return;
    }

    setCounts({ records: records.length, projects: projects.length, ringstrengen: ringStrengen.length });
    setStatus('needed');
  }

  async function startMigration() {
    setStatus('migrating');
    setError('');
    try {
      const records = loadFromStorage('vrs-records', []);
      const projects = loadFromStorage('vrs-projects', []);
      const ringStrengen = loadFromStorage('vrs-ringstreng', []);
      const overrides = loadFromStorage('vrs-species-overrides', {});
      const settings = loadFromStorage('vrs-settings', {});

      // 1. Vangsten (in chunks van 100)
      if (records.length > 0) {
        setProgress(t('migration_uploading_catches', { count: records.length }));
        const rows = records.map(r => toVangstRow(r, user.id));
        for (const chunk of chunkArray(rows, CHUNK_SIZE)) {
          const { error: err } = await supabase.from('vangsten').upsert(chunk);
          if (err) throw err;
        }
      }

      // 2. Projecten
      if (projects.length > 0) {
        setProgress(t('migration_uploading_projects', { count: projects.length }));
        const rows = projects.map(p => ({
          id: p.id,
          user_id: user.id,
          naam: p.naam,
          locatie: p.locatie || '',
          nummer: p.nummer || '',
          actief: p.actief !== false,
          updated_at: new Date().toISOString(),
        }));
        const { error: err } = await supabase.from('projecten').upsert(rows);
        if (err) throw err;
      }

      // 3. Ringstrengen
      if (ringStrengen.length > 0) {
        setProgress(t('migration_uploading_ringstrings', { count: ringStrengen.length }));
        const rows = ringStrengen.map(r => ({
          id: r.id,
          user_id: user.id,
          data: r,
          updated_at: new Date().toISOString(),
        }));
        const { error: err } = await supabase.from('ringstrengen').upsert(rows);
        if (err) throw err;
      }

      // 4. Soortenoverschrijvingen
      const overrideEntries = Object.entries(overrides);
      if (overrideEntries.length > 0) {
        setProgress(t('migration_uploading_overrides'));
        const rows = overrideEntries.map(([soort_naam, data]) => ({
          user_id: user.id,
          soort_naam,
          data,
          updated_at: new Date().toISOString(),
        }));
        const { error: err } = await supabase
          .from('species_overrides')
          .upsert(rows, { onConflict: 'user_id,soort_naam' });
        if (err) throw err;
      }

      // 5. Profielinstellingen
      if (settings.ringerNaam || settings.ringerNummer) {
        setProgress(t('migration_uploading_profile'));
        await supabase.from('profiles').update({
          ringer_naam: settings.ringerNaam || '',
          ringer_initiaal: settings.ringerInitiaal || '',
          ringer_nummer: settings.ringerNummer || '',
          hulp_modus: settings.hulpModus || 'uitgebreid',
          updated_at: new Date().toISOString(),
        }).eq('id', user.id);
      }

      localStorage.setItem(`vrs-migrated-${user.id}`, 'true');
      setStatus('success');
      setProgress('');
      onComplete?.();
      setTimeout(() => setStatus('done'), 5000);
    } catch (err) {
      setError(t('errors:migration_failed', { msg: err.message }));
      setStatus('needed');
      setProgress('');
    }
  }

  if (status === 'checking' || status === 'done') return null;
  if (status === 'dismissed') return null;

  if (status === 'success') {
    return (
      <div className="migration-banner migration-banner--success">
        <span className="migration-success-icon">✓</span>
        <span>
          Migratie geslaagd — {counts.records} vangsten, {counts.projects} projecten
          {counts.ringstrengen > 0 ? `, ${counts.ringstrengen} ringstrengen` : ''} staan nu in de cloud.
        </span>
      </div>
    );
  }

  return (
    <div className="migration-banner">
      {status === 'needed' && (
        <>
          <div className="migration-banner__info">
            <strong>{t('migration_found_title')}</strong>
            <span>
              {counts.records} vangsten, {counts.projects} projecten
              {counts.ringstrengen > 0 ? `, ${counts.ringstrengen} ringstrengen` : ''}
              {' '}staan nog alleen lokaal. Zet ze over naar de cloud zodat je ze overal kunt gebruiken.
            </span>
          </div>
          <div className="migration-banner__actions">
            <button className="migration-banner__btn-primary" onClick={startMigration}>
              {t('migration_migrate')}
            </button>
            <button
              className="migration-banner__btn-dismiss"
              onClick={() => setStatus('dismissed')}
            >
              {t('migration_later')}
            </button>
          </div>
        </>
      )}

      {status === 'migrating' && (
        <div className="migration-banner__progress">
          <div className="migration-spinner" />
          <span>{progress || t('migration_busy')}</span>
        </div>
      )}

      {error && (
        <div className="migration-banner__error">{error}</div>
      )}
    </div>
  );
}
