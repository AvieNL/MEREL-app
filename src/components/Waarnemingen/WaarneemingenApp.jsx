import { useState } from 'react';
import { useWaarnemingen } from '../../hooks/useWaarnemingen';
import Header from '../Layout/Header';
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
