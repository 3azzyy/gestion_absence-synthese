import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { handleSaveAbsences } from '../../utils/storage';

const AddAbsenceModal = ({ trainee, onClose, onSave }) => {
  const [absences, setAbsences] = useState([{
    id: Date.now(),
    date: '',
    mode: 'absence', // 'absence' ou 'retard'
    type: 'non-justifiee', // Seulement pour les absences
    heuresRetard: '', // Pour les heures de retard
    seances: { // Pour les séances d'absence
      seance1: false,
      seance2: false,
      seance3: false,
      seance4: false
    }
  }]);

  // Types d'absences disponibles (seulement pour les absences)
  const absenceTypes = [
    { value: 'non-justifiee', label: 'Non Justifiée', color: '#dc2626' },
    { value: 'justifiee', label: 'Justifiée', color: '#ea580c' },
    // { value: 'maladie', label: 'Maladie', color: '#0284c7' },
  ];

  // Séances 
const seancesList = [
  { key: 'seance1', label: 'Séance 1', time: '8h30 - 11h00', heures: 1 },
  { key: 'seance2', label: 'Séance 2', time: '11h00 - 13h30', heures: 1 },
  { key: 'seance3', label: 'Séance 3', time: '13h30 - 16h00', heures: 1 },
  { key: 'seance4', label: 'Séance 4', time: '16h00 - 18h30', heures: 1 }
];

  // Ajouter une nouvelle absence
  const addAbsence = () => {
    setAbsences([...absences, {
      id: Date.now(),
      date: '',
      mode: 'absence',
      type: 'non-justifiee',
      heuresRetard: '',
      seances: {
        seance1: false,
        seance2: false,
        seance3: false,
        seance4: false
      }
    }]);
  };

  // Supprimer une absence
  const removeAbsence = (id) => {
    if (absences.length > 1) {
      setAbsences(absences.filter(a => a.id !== id));
    }
  };

  // Mettre à jour une absence
  const updateAbsence = (id, field, value) => {
    setAbsences(absences.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  // Mettre à jour une séance
  const updateSeance = (absenceId, seanceKey, checked) => {
    setAbsences(absences.map(a => {
      if (a.id === absenceId) {
        return {
          ...a,
          seances: {
            ...a.seances,
            [seanceKey]: checked
          }
        };
      }
      return a;
    }));
  };

  // Calculer les heures d'une absence
const calculateAbsenceHours = (absence) => {
  if (absence.mode === 'retard') {
    return parseFloat(absence.heuresRetard) || 0;
  } else {
    // Compter les séances cochées et multiplier par 2.33 heures
    const seancesChecked = Object.values(absence.seances).filter(Boolean).length;
    return seancesChecked; // Chaque séance = 2h20min = 2.33h
  }
};
  // Sauvegarder les absences
  const handleSave = () => {
    const invalidAbsences = absences.filter(a => {
      if (!a.date) return true;
      if (a.mode === 'retard' && !a.heuresRetard) return true;
      if (a.mode === 'absence' && !Object.values(a.seances).some(Boolean)) return true;
      return false;
    });
    
    if (invalidAbsences.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const formattedAbsences = absences.map(a => ({
      date: a.date,
      type: a.mode === 'absence' ? a.type : null,
      isRetard: a.mode === 'retard',
      heures: calculateAbsenceHours(a),
      seances: a.mode === 'absence' ? a.seances : null,
      heuresRetard: a.mode === 'retard' ? parseFloat(a.heuresRetard) : null
    }));

    handleSaveAbsences(trainee.id, { absences: formattedAbsences });
    onClose();
  };

  const totalHeures = absences.filter(a => a.mode === 'absence').reduce((sum, a) => sum + calculateAbsenceHours(a), 0);
  const totalRetards = absences.filter(a => a.mode === 'retard').length;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '950px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Ajouter des Absences</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Informations du stagiaire */}
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '20px' 
          }}>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                marginBottom: '6px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Stagiaire
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>
                {trainee.name}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                marginBottom: '6px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Groupe
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>
                {trainee.group}
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                marginBottom: '6px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Heures
              </div>
              <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '18px' }}>
                {trainee.heures.toFixed(1)}h
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '11px', 
                color: '#64748b', 
                marginBottom: '6px', 
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Retards
              </div>
              <div style={{ fontWeight: 700, color: '#ea580c', fontSize: '18px' }}>
                {trainee.retards}
              </div>
            </div>
          </div>
        </div>

        {/* En-tête de la liste */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#0f172a' 
          }}>
            Enregistrements ({absences.length})
          </h3>
          <button 
            className="btn btn-sm" 
            onClick={addAbsence}
            style={{ fontSize: '13px' }}
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {/* Liste des absences */}
        <div style={{ 
          // maxHeight: '500px', 
          overflowY: 'auto', 
          marginBottom: '20px' 
        }}>
          {absences.map((absence, index) => (
            <div key={absence.id} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              {/* En-tête de la carte */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <span style={{ 
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#64748b'
                }}>
                  Enregistrement #{index + 1}
                </span>
                {absences.length > 1 && (
                  <button 
                    onClick={() => removeAbsence(absence.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={14} /> Supprimer
                  </button>
                )}
              </div>

              {/* Date */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={absence.date}
                  onChange={(e) => updateAbsence(absence.id, 'date', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Radio: Retard ou Absence */}
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
                  Type d'enregistrement
                </label>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    border: '2px solid',
                    borderColor: absence.mode === 'retard' ? '#ea580c' : '#e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: absence.mode === 'retard' ? '#fff7ed' : '#ffffff',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name={`mode-${absence.id}`}
                      value="retard"
                      checked={absence.mode === 'retard'}
                      onChange={(e) => updateAbsence(absence.id, 'mode', e.target.value)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ea580c' }}
                    />
                    <div>
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: '14px',
                        color: absence.mode === 'retard' ? '#ea580c' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Clock size={16} />
                        Retard
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    border: '2px solid',
                    borderColor: absence.mode === 'absence' ? '#dc2626' : '#e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: absence.mode === 'absence' ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name={`mode-${absence.id}`}
                      value="absence"
                      checked={absence.mode === 'absence'}
                      onChange={(e) => updateAbsence(absence.id, 'mode', e.target.value)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#dc2626' }}
                    />
                    <div>
                      <div style={{ 
                        fontWeight: 600, 
                        fontSize: '14px',
                        color: absence.mode === 'absence' ? '#dc2626' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <AlertCircle size={16} />
                        Absence
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Si Retard */}
              {absence.mode === 'retard' && (
                <div style={{
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ marginBottom: '8px' }}>
                      Nombre d'heures de retard
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="Ex: 0.5 pour 30 minutes"
                      min="0"
                      step="0.25"
                      value={absence.heuresRetard}
                      onChange={(e) => updateAbsence(absence.id, 'heuresRetard', e.target.value)}
                      style={{ width: '100%' }}
                    />
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#92400e', 
                      marginTop: '8px'
                    }}>
                      Exemples: 0.25h = 15min • 0.5h = 30min • 1h = 60min
                    </div>
                  </div>
                </div>
              )}

              {/* Si Absence */}
              {absence.mode === 'absence' && (
                <>
                  {/* Type d'absence */}
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" style={{ marginBottom: '8px' }}>
                      Type d'absence
                    </label>
                    <select
                      className="input"
                      value={absence.type}
                      onChange={(e) => updateAbsence(absence.id, 'type', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {absenceTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Séances */}
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>
                      Séances absentes (2.5h par séance)
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '10px'
                    }}>
                      {seancesList.map(seance => (
                        <label 
                          key={seance.key}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            padding: '12px',
                            background: absence.seances[seance.key] ? '#dc2626' : '#ffffff',
                            color: absence.seances[seance.key] ? '#ffffff' : '#0f172a',
                            border: '1px solid',
                            borderColor: absence.seances[seance.key] ? '#dc2626' : '#e2e8f0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              type="checkbox"
                              checked={absence.seances[seance.key]}
                              onChange={(e) => updateSeance(absence.id, seance.key, e.target.checked)}
                              style={{ 
                                width: '16px', 
                                height: '16px', 
                                cursor: 'pointer'
                              }}
                            />
                            <span style={{ fontWeight: 600, fontSize: '13px' }}>
                              {seance.label}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            opacity: 0.85,
                            paddingLeft: '24px'
                          }}>
                            {seance.time}
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    {/* Total des séances */}
                    <div style={{
                      marginTop: '12px',
                      padding: '10px 12px',
                      background: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      border: '1px solid #e2e8f0'
                    }}>
                      Total: {Object.values(absence.seances).filter(Boolean).length} séance(s) = {Object.values(absence.seances).filter(Boolean).length * 2.5}h
                    </div>
                  </div>
                </>
              )}

              {/* Résumé */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0f172a',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Heures à ajouter:</span>
                <span style={{ fontSize: '16px', color: '#dc2626' }}>
                  {(calculateAbsenceHours(absence) * (absence?.mode === 'retard' ? 1 : 2.5)).toFixed(2)}h
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif final */}
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          color: '#ffffff',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>
              Total heures
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>
              {totalHeures.toFixed(2) * 2.5}h
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>
              Total retards
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>
              {totalRetards}
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn" onClick={handleSave}>
            <Plus size={16} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAbsenceModal;