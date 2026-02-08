import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Clock, AlertCircle, Printer } from 'lucide-react';
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
    setAbsences(absences.map(a => {
      if (a.id === id) {
        const updated = { ...a, [field]: value };
        if (field === 'mode') {
          updated.seances = {
            seance1: false,
            seance2: false,
            seance3: false,
            seance4: false
          };
          if (value === 'absence') updated.heuresRetard = '';
        }
        return updated;
      }
      return a;
    }));
  };

  // Mettre à jour une séance
  const updateSeance = (absenceId, seanceKey, checked) => {
    setAbsences(absences.map(a => {
      if (a.id === absenceId) {
        if (a.mode === 'retard') {
          const resetSeances = {
            seance1: false, seance2: false, seance3: false, seance4: false
          };
          return {
            ...a,
            seances: { ...resetSeances, [seanceKey]: true }
          };
        } else {
          return {
            ...a,
            seances: { ...a.seances, [seanceKey]: checked }
          };
        }
      }
      return a;
    }));
  };

  // Calculer les heures d'une absence
  const calculateAbsenceHours = (absence) => {
    const seancesChecked = Object.values(absence.seances).filter(Boolean).length;
    return seancesChecked;
  };

  // Fonction pour imprimer l'historique
  const handlePrint = () => {
    // Only use absences from the current form that have a date
    const allAbsences = absences
      .filter(a => a.date) // Only include absences with dates
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    const totalAbsenceHours = allAbsences
      .filter(a => a.mode === 'absence')
      .reduce((sum, a) => sum + calculateAbsenceHours(a) * 2.5, 0);
    
    const totalRetards = allAbsences.filter(a => a.mode === 'retard').length;

    const printContent = `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Historique des Absences - ${trainee.name}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #333;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #1e3a5f;
            }
            
            h1 {
              color: #1e3a5f;
              margin-bottom: 10px;
              font-size: 24px;
            }
            
            .student-info {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            
            .info-item {
              text-align: center;
            }
            
            .info-label {
              font-size: 11px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            
            .info-value {
              font-size: 18px;
              font-weight: bold;
              color: #1e3a5f;
            }
            
            .info-value.danger {
              color: #dc2626;
            }
            
            .info-value.warning {
              color: #ea580c;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 12px 10px;
              text-align: left;
            }
            
            th {
              background-color: #1e3a5f;
              color: white;
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
              color: white;
            }
            
            .badge-retard {
              background-color: #ea580c;
            }
            
            .badge-absence {
              background-color: #dc2626;
            }
            
            .badge-justifiee {
              background-color: #ea580c;
            }
            
            .badge-non-justifiee {
              background-color: #dc2626;
            }
            
            .summary {
              background: #1e3a5f;
              color: white;
              padding: 20px;
              border-radius: 8px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            
            .summary-item {
              text-align: center;
            }
            
            .summary-label {
              font-size: 12px;
              opacity: 0.8;
              margin-bottom: 5px;
            }
            
            .summary-value {
              font-size: 32px;
              font-weight: bold;
            }
            
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
            
            .seances-list {
              font-size: 11px;
              color: #666;
            }

            .empty-state {
              text-align: center;
              padding: 40px;
              color: #666;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Absences et Retards à Enregistrer</h1>
            <p style="color: #666; margin-top: 5px;">
              Généré le ${new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div class="student-info">
            <div class="info-item">
              <div class="info-label">Stagiaire</div>
              <div class="info-value">${trainee.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Groupe</div>
              <div class="info-value">${trainee.group}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Heures</div>
              <div class="info-value danger">${totalAbsenceHours.toFixed(1)}h</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total Retards</div>
              <div class="info-value warning">${totalRetards}</div>
            </div>
          </div>

          ${allAbsences.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th style="width: 100px;">Date</th>
                  <th style="width: 100px;">Type</th>
                  <th style="width: 150px;">Statut</th>
                  <th>Séances</th>
                  <th style="width: 80px; text-align: center;">Heures</th>
                </tr>
              </thead>
              <tbody>
                ${allAbsences.map(absence => {
                  const isRetard = absence.mode === 'retard';
                  const absenceType = absence.type || 'non-justifiee';
                  const heures = calculateAbsenceHours(absence) * (isRetard ? 1 : 2.5);
                  
                  // Get selected seances
                  const selectedSeances = seancesList
                    .filter(s => absence.seances && absence.seances[s.key])
                    .map(s => s.label)
                    .join(', ') || '-';
                  
                  return `
                    <tr>
                      <td>${new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <span class="badge badge-${isRetard ? 'retard' : 'absence'}">
                          ${isRetard ? 'Retard' : 'Absence'}
                        </span>
                      </td>
                      <td>
                        ${!isRetard ? `
                          <span class="badge badge-${absenceType}">
                            ${absenceType === 'justifiee' ? 'Justifiée' : 'Non Justifiée'}
                          </span>
                        ` : '-'}
                      </td>
                      <td class="seances-list">${selectedSeances}</td>
                      <td style="text-align: center; font-weight: bold; color: #dc2626;">
                        ${heures.toFixed(1)}h
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-item">
                <div class="summary-label">Total Heures d'Absence</div>
                <div class="summary-value">${totalAbsenceHours.toFixed(1)}h</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Retards</div>
                <div class="summary-value">${totalRetards}</div>
              </div>
            </div>
          ` : `
            <div class="empty-state">
              <p style="font-size: 16px;">Aucune absence ou retard à enregistrer</p>
              <p style="font-size: 14px; margin-top: 10px; color: #999;">Veuillez remplir au moins une entrée avec une date</p>
            </div>
          `}

          <div class="footer">
            <p>Document confidentiel - ${trainee.name} - ${trainee.group}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Create a new window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour imprimer');
      return;
    }

    // Write content
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Focus the window
    printWindow.focus();
  };

  // Sauvegarder les absences
  const handleSave = () => {
    const invalidAbsences = absences.filter(a => {
      if (!a.date) return true;
      if (a.mode === 'retard' && !Object.values(a.seances).some(Boolean)) return true;
      if (a.mode === 'absence' && !Object.values(a.seances).some(Boolean)) return true;
      return false;
    });

    if (invalidAbsences.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const formattedAbsences = absences.map(a => ({
      date: a.date,
      type: a.type,
      isRetard: a.mode === 'retard',
      heures: calculateAbsenceHours(a),
      seances: a.seances,
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
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn btn-sm"
              onClick={handlePrint}
              style={{ 
                background: 'var(--info)', 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={16} /> Imprimer
            </button>
            <button className="close-modal" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
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
                  {absence.mode === 'absence' ? "Séances absentes (2.5h par séance)" : "Séances de retard"}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '10px'
                }}>
                  {seancesList.map(seance => (
                    absence.mode && absence.mode === "absence" ?
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
                      :
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
                            type="radio"
                            name={`seance-radio-${absence.id}`}
                            checked={absence.seances[seance.key]}
                            onChange={(e) => updateSeance(absence.id, seance.key, true)}
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
                {absence.mode === "absence" && <div style={{
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
                </div>}
              </div>

              {/* Résumé */}
              {absence.mode === "absence" && 
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
              </div>}
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