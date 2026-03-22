import { lazy, Suspense, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n/index.js';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import NestNavigation from './components/Layout/NestNavigation';
import LoginPage from './components/Auth/LoginPage';
import MigrationBanner from './components/Sync/MigrationBanner';
import ModuleSelector from './components/ModuleSelector/ModuleSelector';
import { useNestRole } from './hooks/useNestRole';

const NieuwPage       = lazy(() => import('./components/Nieuw/NieuwPage'));
const RecordsPage     = lazy(() => import('./components/Records/RecordsPage'));
const StatsPage       = lazy(() => import('./components/Stats/StatsPage'));
const ProjectDetail   = lazy(() => import('./components/Stats/ProjectDetail'));
const SoortenOverzicht = lazy(() => import('./components/Stats/SoortenOverzicht'));
const TerugvangstDetail = lazy(() => import('./components/Stats/TerugvangstDetail'));
const SoortenPage     = lazy(() => import('./components/Soorten/SoortenPage'));
const SoortDetail     = lazy(() => import('./components/Soorten/SoortDetail'));
const DatabasesPage   = lazy(() => import('./components/Databases/DatabasesPage'));
const OverPage        = lazy(() => import('./components/Over/OverPage'));
const InstellingenPage = lazy(() => import('./components/Instellingen/InstellingenPage'));
const ProjectenPage   = lazy(() => import('./components/Projecten/ProjectenPage'));
const RingstrengenPage = lazy(() => import('./components/Ringstreng/RingstrengenPage'));
const AdminPage       = lazy(() => import('./components/Admin/AdminPage'));
const ReferentiebibliotheekPage = lazy(() => import('./components/Referentiebibliotheek/ReferentiebibliotheekPage'));
const NestOverzichtPage = lazy(() => import('./components/Nest/NestOverzichtPage'));
const NieuwNestPage     = lazy(() => import('./components/Nest/NieuwNestPage'));
const NestDetailPage    = lazy(() => import('./components/Nest/NestDetailPage'));
import { useRecords } from './hooks/useRecords';
import { useProjects } from './hooks/useProjects';
import { useSpeciesOverrides } from './hooks/useSpeciesOverrides';
import { useSettings } from './hooks/useSettings';
import { useRingStrengen } from './hooks/useRingStrengen';
import './styles/theme.css';

function UpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  const { t } = useTranslation();
  if (!needRefresh) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 72, left: 0, right: 0, zIndex: 9999,
      display: 'flex', justifyContent: 'center', padding: '0 16px',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'var(--accent)', color: 'var(--bg-primary)',
        borderRadius: 'var(--radius)', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        pointerEvents: 'all', fontSize: '0.9rem', fontWeight: 600,
      }}>
        {t('update_available')}
        <button
          onClick={() => updateServiceWorker(true)}
          style={{
            background: 'var(--bg-primary)', color: 'var(--accent)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            padding: '4px 12px', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem',
            minWidth: 'auto', minHeight: 'auto',
          }}
        >
          {t('btn_refresh')}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <SyncProvider>
              <BrowserRouter>
                <UpdateBanner />
                <AppShell />
                <ToastContainer />
              </BrowserRouter>
            </SyncProvider>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
}

function LoadingText() {
  const { t } = useTranslation();
  return <>{t('loading')}</>;
}

function PageSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
      <LoadingText />
    </div>
  );
}

const MODULE_KEY = 'vrs-module';

function AppShell() {
  const { user, loading, profile, profileError } = useAuth();
  const { hasNestAccess } = useNestRole();
  const { t } = useTranslation();

  // Module opgeslagen in sessionStorage; null = nog niet gekozen
  const [module, setModuleState] = useState(() => sessionStorage.getItem(MODULE_KEY));

  const selectModule = useCallback((mod) => {
    sessionStorage.setItem(MODULE_KEY, mod);
    setModuleState(mod);
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        gap: '0.75rem',
      }}>
        <div style={{
          width: 20, height: 20,
          border: '2px solid var(--bg-tertiary)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <LoadingText />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Gebruikers zonder nestonderzoek-toegang gaan altijd naar ring
  const effectiveModule = !hasNestAccess ? 'ring' : module;

  if (!effectiveModule) {
    return <ModuleSelector onSelect={selectModule} />;
  }

  return (
    <>
      {profileError && (
        <div role="alert" style={{
          background: 'var(--warning-bg)', borderBottom: '2px solid var(--warning)',
          color: 'var(--warning)', padding: '10px 16px', textAlign: 'center', fontSize: '0.85rem',
        }}>
          {t('profile_load_error')}
        </div>
      )}
      {effectiveModule === 'ring'
        ? <MainApp onSwitchModule={hasNestAccess ? () => { sessionStorage.removeItem(MODULE_KEY); setModuleState(null); } : null} activeModule="ring" />
        : <NestApp onSwitchModule={() => { sessionStorage.removeItem(MODULE_KEY); setModuleState(null); }} activeModule="nest" />
      }
    </>
  );
}

function NestApp({ onSwitchModule, activeModule }) {
  return (
    <div className="app-shell">
      <Header onSwitchModule={onSwitchModule} activeModule={activeModule} />
      <main className="app-content">
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/nest" element={<NestOverzichtPage />} />
            <Route path="/nest/nieuw" element={<NieuwNestPage />} />
            <Route path="/nest/:id" element={<NestDetailPage />} />
            <Route path="*" element={<NestOverzichtPage />} />
          </Routes>
        </Suspense>
      </main>
      <NestNavigation />
    </div>
  );
}

function MainApp({ onSwitchModule, activeModule }) {
  const { records, recordsLoading, deletedRecords, addRecord, addExternRecord, updateRecord, deleteRecord, restoreRecord, permanentDeleteRecord, markAllAsUploaded, importRecords, renameProject, fullResync } = useRecords();
  const { projects, addProject, updateProject, deleteProject, myAupis, refreshAupis } = useProjects();
  const speciesOverrides = useSpeciesOverrides();
  const { settings, updateSettings } = useSettings();
  const { ringStrengen, addRingstreng, updateRingstreng, deleteRingstreng, advanceHuidige } = useRingStrengen();

  return (
    <div className="app-shell">
      <Header onSwitchModule={onSwitchModule} activeModule={activeModule} />
      <MigrationBanner onComplete={() => {}} />
      <main className="app-content">
        <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route path="/" element={<NieuwPage />} />
          <Route path="/records" element={
            <RecordsPage
              records={records}
              recordsLoading={recordsLoading}
              deletedRecords={deletedRecords}
              onDelete={deleteRecord}
              onRestore={restoreRecord}
              onPermanentDelete={permanentDeleteRecord}
              onAddRecord={addExternRecord}
            />
          } />
          <Route path="/stats" element={
            <StatsPage records={records} recordsLoading={recordsLoading} markAllAsUploaded={markAllAsUploaded} importRecords={importRecords} projects={projects} myAupis={myAupis} />
          } />
          <Route path="/stats/project/:naam" element={
            <ProjectDetail records={records} />
          } />
          <Route path="/stats/soorten" element={<SoortenOverzicht />} />
          <Route path="/stats/terugvangsten" element={
            <TerugvangstDetail records={records} projects={projects} />
          } />
          <Route path="/soorten" element={
            <SoortenPage records={records} />
          } />
          <Route path="/soorten/:naam" element={
            <SoortDetail records={records} speciesOverrides={speciesOverrides} />
          } />
          <Route path="/databases" element={<DatabasesPage />} />
          <Route path="/over" element={<OverPage />} />
          <Route path="/projecten" element={
            <ProjectenPage projects={projects} onAdd={addProject} onUpdate={updateProject} onDelete={deleteProject} onRenameProject={renameProject} onAupiSaved={refreshAupis} />
          } />
          <Route path="/instellingen" element={
            <InstellingenPage settings={settings} onUpdateSettings={updateSettings} onFullResync={fullResync} />
          } />
          <Route path="/ringstrengen" element={
            <RingstrengenPage
              ringStrengen={ringStrengen}
              records={records}
              onAdd={addRingstreng}
              onUpdate={updateRingstreng}
              onDelete={deleteRingstreng}
            />
          } />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/referentiebibliotheek" element={<ReferentiebibliotheekPage />} />
        </Routes>
        </Suspense>
      </main>
      <Navigation />
    </div>
  );
}
