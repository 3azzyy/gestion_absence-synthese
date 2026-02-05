import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import AddAbsenceModal from '../modals/AddAbsenceModal';
import ViewAbsencesModal from '../modals/ViewAbsencesModal';

const StudentRow = ({ trainee }) => {
  const t = trainee;

  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  
    // Ouvrir le modal d'ajout d'absence
  const handleAddAbsence = (traineeId) => {
    setSelectedTrainee(traineeId);
    setShowAbsenceModal(true);
  };

  // Ouvrir le modal de visualisation
  const handleViewAbsences = (traineeId) => {
    setSelectedTrainee(traineeId);
    setShowViewModal(true);
  };
  return ( <>
    <tr className={t.days >= 5 ? 'at-risk' : ''}>
      <td><strong>{t.name}</strong></td>
      <td>{t.group}</td>
      <td>{t.heures.toFixed(1)}</td>
      <td>{t.retards}</td>
      <td>{t.days.toFixed(2)}</td>
      <td>
        {/* <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{
              width: `${t.attendance}%`,
              background: t.attendance >= 80 ? 'var(--success)' : t.attendance >= 60 ? 'var(--warning)' : 'var(--danger)'
            }}
          />
        </div> */}
        {t.attendance.toFixed(1)}/10
      </td>
      <td>
        <span 
          className="status-badge" 
          style={{background: t.sanction.color, minWidth: 'auto', padding: '4px 8px', color: t.sanction.color == "#2e7d32" ? '#ffffff' : '#af4646'}}
        >
          {t.sanction.label}
        </span>
      </td>
      <td style={{ 
        display:"flex",
        gap:"5px",
        justifyContent:"center",
       }}>
        <button className="btn btn-sm btn-secondary" onClick={() => handleAddAbsence(t)} style={{marginLeft: 4}}>
          <Plus size={14} /> Ajouter Absence
        </button>
        <span></span>
        <button className="btn btn-sm" onClick={() => handleViewAbsences(t)}>
          <Eye size={14} />
        </button>
        {/* <button className="btn btn-sm btn-danger" onClick={() => onDeleteClick(t.id)} style={{marginLeft: 4}}>
          <Trash2 size={14} />
        </button> */}
      </td>
    </tr>


      {/* Modal d'ajout d'absences */}
      {showAbsenceModal && selectedTrainee && (
        <AddAbsenceModal
          trainee={selectedTrainee}
          onClose={() => setShowAbsenceModal(false)}
          // onSave={onSaveAbsences}
        />
      )}

      {/* Modal de visualisation des absences */}
      {showViewModal && selectedTrainee && (
        <ViewAbsencesModal
          trainee={selectedTrainee}
          onClose={() => setShowViewModal(false)}
        />
      )}
      </>
  );
};

export default StudentRow;