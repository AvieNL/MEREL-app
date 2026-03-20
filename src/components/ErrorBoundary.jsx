import { Component } from 'react';
import i18n from '../i18n/index.js';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          padding: '2rem',
          gap: '1rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem' }}>⚠️</div>
          <h2 style={{ margin: 0 }}>{i18n.t('error_something_wrong')}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, maxWidth: 400 }}>
            {this.state.error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '0.5rem' }}
          >
            {i18n.t('btn_reload_page')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
