import { useState } from 'react';

const GESLACHT_LABELS = { M: '♂', V: '♀', O: '' };

/**
 * Sectie voor het koppelen / bewerken van oudervogels aan een legsel.
 * Gedeeld tussen NestDetailPage, NieuwBezoekPage en WijzigBezoekPage.
 */
export default function LegselOuderBlok({
  legselId, ouders, canNestEdit,
  addOuder, updateOuder, deleteOuder,
  records, speciesByEuring, switchModule, navigate,
}) {
  const [open, setOpen] = useState(false);
  // formulier: false | 'nieuw' | <ouder-id> (bewerken)
  const [formulier, setFormulier] = useState(false);
  const [ring, setRing] = useState('');
  const [geslacht, setGeslacht] = useState('O');
  const [naamVogel, setNaamVogel] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [bezig, setBezig] = useState(false);

  const ringNorm = ring.replace(/[\s.]/g, '').toUpperCase();
  const gekoppeldeVangst = ringNorm.length >= 4
    ? records?.find(v => (v.ringnummer || '').replace(/[\s.]/g, '').toUpperCase() === ringNorm)
    : null;
  const effectiefNaam = naamVogel || (gekoppeldeVangst?.vogelnaam
    ? gekoppeldeVangst.vogelnaam.charAt(0).toUpperCase() + gekoppeldeVangst.vogelnaam.slice(1)
    : '');

  function openNieuw() {
    setRing(''); setGeslacht('O'); setNaamVogel('');
    setFormulier('nieuw');
  }

  function openEdit(ouder) {
    setRing(ouder.ringnummer || '');
    setGeslacht(ouder.geslacht || 'O');
    setNaamVogel(ouder.naam_vogel || '');
    setFormulier(ouder.id);
  }

  function sluitFormulier() {
    setFormulier(false); setRing(''); setGeslacht('O'); setNaamVogel('');
  }

  async function handleOpslaan(e) {
    e.preventDefault();
    if (!ring.trim()) return;
    setBezig(true);
    if (formulier === 'nieuw') {
      await addOuder({
        legsel_id: legselId,
        ringnummer: ring.trim(),
        geslacht,
        naam_vogel: effectiefNaam,
        soort_euring: gekoppeldeVangst?.soort_euring || '',
        vangst_id: gekoppeldeVangst?.id || null,
      });
    } else {
      await updateOuder(formulier, {
        ringnummer: ring.trim(),
        geslacht,
        naam_vogel: effectiefNaam,
        soort_euring: gekoppeldeVangst?.soort_euring || '',
        vangst_id: gekoppeldeVangst?.id || null,
      });
    }
    sluitFormulier();
    setBezig(false);
  }

  if (ouders.length === 0 && !canNestEdit) return null;

  return (
    <div className="legsel-ouder-blok">
      <button type="button" className="legsel-ouder-toggle" onClick={() => setOpen(o => !o)}>
        <span className="legsel-ouder-toggle__label">
          Ouders
          {ouders.length > 0 && <span className="legsel-ouder-toggle__teller">{ouders.length}</span>}
        </span>
        <span className={`toggle-pijl${open ? ' open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="legsel-ouder-inhoud">
          {ouders.length === 0 && (
            <p className="legsel-ouder-leeg">Nog geen oudervogels gekoppeld.</p>
          )}
          {ouders.map(ouder => {
            const nr = ouder.ringnummer?.replace(/\./g, '') || '—';
            const vangst = records?.find(v => v.id === ouder.vangst_id);
            const geslLabel = GESLACHT_LABELS[ouder.geslacht] || '';
            const wordtBewerkt = formulier === ouder.id;

            if (wordtBewerkt) {
              return (
                <form key={ouder.id} className="legsel-ouder-form" onSubmit={handleOpslaan}>
                  <div className="legsel-ouder-form__rij">
                    <input className="legsel-ouder-form__ring" type="text" placeholder="Ringnummer"
                      value={ring} onChange={e => setRing(e.target.value)} autoFocus />
                    <select className="legsel-ouder-form__geslacht" value={geslacht} onChange={e => setGeslacht(e.target.value)}>
                      <option value="O">Onbekend</option>
                      <option value="M">♂ Man</option>
                      <option value="V">♀ Vrouw</option>
                    </select>
                  </div>
                  {gekoppeldeVangst && (
                    <p className="legsel-ouder-form__match">Gevonden: {effectiefNaam} — {gekoppeldeVangst.vangstdatum}</p>
                  )}
                  {ring.length >= 4 && !gekoppeldeVangst && (
                    <input className="legsel-ouder-form__naam" type="text" placeholder="Soort (optioneel)"
                      value={naamVogel} onChange={e => setNaamVogel(e.target.value)} />
                  )}
                  <div className="legsel-ouder-form__acties">
                    <button type="submit" className="btn-primary btn-xs" disabled={!ring.trim() || bezig}>Opslaan</button>
                    <button type="button" className="btn-secondary btn-xs" onClick={sluitFormulier}>Annuleren</button>
                  </div>
                </form>
              );
            }

            return (
              <span key={ouder.id} className="legsel-ouder-rij">
                {deleteId === ouder.id ? (
                  <span className="legsel-ouder-confirm">
                    <span>Verwijderen?</span>
                    <button type="button" className="btn-danger btn-xs"
                      onClick={async () => { await deleteOuder(ouder.id); setDeleteId(null); }}>Ja</button>
                    <button type="button" className="btn-secondary btn-xs"
                      onClick={() => setDeleteId(null)}>Nee</button>
                  </span>
                ) : (
                  <>
                    {geslLabel && <span className="legsel-ouder-geslacht">{geslLabel}</span>}
                    {vangst && switchModule
                      ? <button className="bezoek-item__ring-link" type="button"
                          onClick={() => {
                            try { sessionStorage.setItem('vrs-edit-record', JSON.stringify(vangst)); } catch { /* ignore */ }
                            switchModule('ring'); navigate('/ring/');
                          }}>{nr}</button>
                      : <span className="bezoek-item__ring-orphan">{nr}</span>
                    }
                    {ouder.naam_vogel && <span className="legsel-ouder-naam">{ouder.naam_vogel}</span>}
                    {canNestEdit && (
                      <>
                        <button type="button" className="bezoek-item__ring-delete legsel-ouder-edit-btn"
                          title="Bewerken" onClick={() => openEdit(ouder)}>✎</button>
                        <button type="button" className="bezoek-item__ring-delete"
                          title="Verwijderen" onClick={() => setDeleteId(ouder.id)}>×</button>
                      </>
                    )}
                  </>
                )}
              </span>
            );
          })}

          {canNestEdit && !formulier && (
            <button type="button" className="legsel-ouder-add-btn" onClick={openNieuw}>
              + Oudervogel koppelen
            </button>
          )}

          {formulier === 'nieuw' && (
            <form className="legsel-ouder-form" onSubmit={handleOpslaan}>
              <div className="legsel-ouder-form__rij">
                <input className="legsel-ouder-form__ring" type="text" placeholder="Ringnummer"
                  value={ring} onChange={e => setRing(e.target.value)} autoFocus />
                <select className="legsel-ouder-form__geslacht" value={geslacht} onChange={e => setGeslacht(e.target.value)}>
                  <option value="O">Onbekend</option>
                  <option value="M">♂ Man</option>
                  <option value="V">♀ Vrouw</option>
                </select>
              </div>
              {gekoppeldeVangst && (
                <p className="legsel-ouder-form__match">Gevonden: {effectiefNaam} — {gekoppeldeVangst.vangstdatum}</p>
              )}
              {ring.length >= 4 && !gekoppeldeVangst && (
                <input className="legsel-ouder-form__naam" type="text" placeholder="Soort (optioneel)"
                  value={naamVogel} onChange={e => setNaamVogel(e.target.value)} />
              )}
              <div className="legsel-ouder-form__acties">
                <button type="submit" className="btn-primary btn-xs" disabled={!ring.trim() || bezig}>Koppelen</button>
                <button type="button" className="btn-secondary btn-xs" onClick={sluitFormulier}>Annuleren</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
