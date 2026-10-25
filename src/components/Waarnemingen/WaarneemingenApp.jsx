import { useState, useEffect, useRef } from 'react';
import { useWaarnemingen } from '../../hooks/useWaarnemingen';
import Header from '../Layout/Header';
import OverzichtPage from './OverzichtPage';
import LifelistPage from './LifelistPage';
import LandenPage from './LandenPage';
import JaarlijstPage from './JaarlijstPage';
import KaartPage from './KaartPage';
import WInstellingenPage from './WInstellingenPage';
import VolledigheidsPage from './VolledigheidsPage';
import './WaarneemingenApp.css';

const TABS = [
  { id: 'overzicht',     label: 'Overzicht',     icon: '◎' },
  { id: 'lifelist',      label: 'Lifelist',      icon: '✦' },
  { id: 'landen',        label: 'Landen',        icon: '⊕' },
  { id: 'volledigheid',  label: 'Volledigheid',  icon: '◈' },
  { id: 'jaar',          label: 'Jaarlijst',     icon: '◷' },
  { id: 'kaart',         label: 'Kaart',         icon: '⬡' },
  { id: 'instellingen',  label: 'Inst.',         icon: '⚙' },
];

export default function WaarneemingenApp({ onSwitchModule }) {
  const [activeTab, setActiveTab] = useState('overzicht');
  const { waarnemingen, importWaarnemingen, clearAllWaarnemingen, syncFromSupabase } = useWaarnemingen();
  const didSync = useRef(false);

  // Auto-pull from Supabase when local Dexie is empty (first use on a new device)
  useEffect(() => {
    if (didSync.current) return;
    if (waarnemingen === undefined) return; // still loading
    if (waarnemingen.length > 0) { didSync.current = true; return; }
    didSync.current = true;
    syncFromSupabase().catch(() => {});
  }, [waarnemingen, syncFromSupabase]);

  const renderTab = () => {
    switch (activeTab) {
      case 'overzicht':   return <OverzichtPage waarnemingen={waarnemingen} />;
      case 'lifelist':    return <LifelistPage waarnemingen={waarnemingen} />;
      case 'landen':      return <LandenPage waarnemingen={waarnemingen} />;
      case 'jaar':        return <JaarlijstPage waarnemingen={waarnemingen} />;
      case 'volledigheid': return <VolledigheidsPage waarnemingen={waarnemingen} />;
      case 'kaart':       return <KaartPage waarnemingen={waarnemingen} />;
      case 'instellingen': return <WInstellingenPage waarnemingen={waarnemingen} onImport={importWaarnemingen} onClear={clearAllWaarnemingen} onSync={syncFromSupabase} />;
      default:            return null;
    }
  };

  return (
    <div className="app-shell">
      <Header onSwitchModule={onSwitchModule} activeModule="waarnemingen" />

      <main className="app-content">
        {renderTab()}
      </main>

      <nav className="waarnemingen-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`w-nav-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="w-nav-icon">{tab.icon}</span>
            <span className="w-nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
