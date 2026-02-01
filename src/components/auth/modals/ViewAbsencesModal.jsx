import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';

const ViewAbsencesModal = ({ trainee, onClose }) => {
  const absenceTypes = [
    { value: 'non-justifiee', label: 'Non Justifiée', color: '#b71c1c' },
    { value: 'justifiee', label: 'Justifiée', color: '#f57c00' },
    { value: 'maladie', label: 'Maladie', color: '#0288d1' }
  ];

  // Récupérer l'historique des absences
  const absenceHistory = trainee.data?.absenceHistory || [];
  const retardHistory = absenceHistory.filter(a => a.isRetard);
  const heureHistory = absenceHistory.filter(a => !a.isRetard);

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '1000px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Historique des Absences</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Informations du stagiaire */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          padding: '24px',
          borderRadius: 'var(--radius)',
          marginBottom: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Nom Complet
              </div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>
                {trainee.name}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Groupe
              </div>
              <div style={{ fontWeight: 700, fontSize: '18px' }}>
                {trainee.group}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Heures
              </div>
              <div style={{ fontWeight: 700, fontSize: '24px' }}>
                {trainee.heures.toFixed(1)} h
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Retards
              </div>
              <div style={{ fontWeight: 700, fontSize: '24px' }}>
                {trainee.retards}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Assiduité
              </div>
              <div style={{ fontWeight: 700, fontSize: '24px' }}>
                {trainee.attendance.toFixed(1)}/10
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#fff3cd',
            border: '2px solid #f57c00',
            padding: '16px',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#f57c00' }}>
              {absenceHistory.length}
            </div>
            <div style={{ fontSize: '13px', color: '#856404', fontWeight: 600 }}>
              Total Absences
            </div>
          </div>
          <div style={{
            background: '#f8d7da',
            border: '2px solid #b71c1c',
            padding: '16px',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#b71c1c' }}>
              {heureHistory.length}
            </div>
            <div style={{ fontSize: '13px', color: '#721c24', fontWeight: 600 }}>
              Absences (Heures)
            </div>
          </div>
          <div style={{
            background: '#fff3cd',
            border: '2px solid var(--warning)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--warning)' }}>
              {retardHistory.length}
            </div>
            <div style={{ fontSize: '13px', color: '#856404', fontWeight: 600 }}>
              Retards
            </div>
          </div>
        </div>

        {absenceHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
              ✅
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Aucune absence enregistrée
            </div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              Ce stagiaire n'a aucune absence pour le moment
            </div>
          </div>
        ) : (
          <>
            {/* Tableau des absences (heures) */}
            {heureHistory.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  paddingBottom: '12px',
                  borderBottom: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={20} />
                  Absences par Heures ({heureHistory.length})
                </h3>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}>
                  <table className="table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Heures</th>
                      </tr>
                    </thead>
                    <tbody>
                      {heureHistory
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((abs, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Calendar size={14} color="var(--text-muted)" />
                                <strong>{new Date(abs.date).toLocaleDateString('fr-FR', { 
                                  weekday: 'short',
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</strong>
                              </div>
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'white',
                                background: absenceTypes.find(t => t.value === abs.type)?.color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                {absenceTypes.find(t => t.value === abs.type)?.label}
                              </span>
                            </td>
                            <td>
                              <span style={{ 
                                fontWeight: 700, 
                                fontSize: '16px',
                                color: 'var(--danger)'
                              }}>
                                {abs.heures} h
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tableau des retards */}
            {retardHistory.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  paddingBottom: '12px',
                  borderBottom: '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock size={20} />
                  Retards ({retardHistory.length})
                </h3>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)'
                }}>
                  <table className="table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {retardHistory
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((abs, idx) => (
                          <tr key={idx}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                <Calendar size={14} color="var(--text-muted)" />
                                <strong>{new Date(abs.date).toLocaleDateString('fr-FR', { 
                                  weekday: 'short',
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</strong>
                              </div>
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'white',
                                background: absenceTypes.find(t => t.value === abs.type)?.color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                {absenceTypes.find(t => t.value === abs.type)?.label}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: 'white',
                                background: 'var(--warning)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                RETARD
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bouton de fermeture */}
        <div className="action-buttons">
          <button className="btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAbsencesModal;