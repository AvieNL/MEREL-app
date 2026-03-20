import { useToast } from '../../context/ToastContext';
import './ToastContainer.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span className="toast__message">{t.message}</span>
          <button className="toast__close" onClick={() => removeToast(t.id)} aria-label="Sluiten">✕</button>
        </div>
      ))}
    </div>
  );
}
