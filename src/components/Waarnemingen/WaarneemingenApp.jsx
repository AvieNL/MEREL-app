import { useState } from 'react';
import { useWaarnemingen } from '../../hooks/useWaarnemingen';
import OverzichtPage from './OverzichtPage';
import LifelistPage from './LifelistPage';
import LandenPage from './LandenPage';
import JaarlijstPage from './JaarlijstPage';
import WInstellingenPage from './WInstellingenPage';
import './WaarneemingenApp.css';

const TABS = [
  { id: 'overzicht',   label: 'Overzicht',   icon: '◎' },
  { id: 'lifelist',    label: 'Lifelist',    icon: '✦' },
  { id: 'landen',      label: 'Landen',      icon: '⊕' },
  { id: 'jaar',        label: 'Jaarlijst',   icon: '◷' },
  { id: 'instellingen', label: 'Inst.',      icon: '⚙' },
];

export default function WaarneemingenApp({ onSwitchModule }) {
  const [activeTab, setActiveTab] = useState('overzicht');
  const { waarnemingen, importWaarnemingen, clearAllWaarnemingen } = useWaarnemingen();

  const renderTab = () => {
    switch (activeTab) {
      case 'overzicht':   return <OverzichtPage waarnemingen={waarnemingen} />;
      case 'lifelist':    return <LifelistPage waarnemingen={waarnemingen} />;
      case 'landen':      return <LandenPage waarnemingen={waarnemingen} />;
      case 'jaar':        return <JaarlijstPage waarnemingen={waarnemingen} />;
      case 'instellingen': return <WInstellingenPage waarnemingen={waarnemingen} onImport={importWaarnemingen} onClear={clearAllWaarnemingen} />;
      default:            return null;
    }
  };

  return (
    <div className="app-shell">
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)', gap: 12,
      }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
          🔭 Vogelwaarnemingen
        </span>
        {onSwitchModule && (
          <button
            onClick={() => onSwitchModule(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '0.8rem', padding: 0 }}
          >
            Wissel module
          </button>
        )}
      </header>

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
