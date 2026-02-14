import React, { useState } from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import AddAbsenceModal from '../modals/AddAbsenceModal';
import ViewAbsencesModal from '../modals/ViewAbsencesModal';
import api from '../../../services/http';
import ConfirmeDeletemodal from '../modals/confirmdelete';

const StudentRow = ({ trainee }) => {
  const t = trainee;

  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showconfirmdelete, setShowconfirmdelete] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const Changeobservation = async (e, id) => {
    try {
      const response = await api.put('/students/observation', {
        id: id,
        observation: e.target.value
      });

      // Use response.data because that's where Axios puts the Laravel JSON
      if (response.data.success) {

        console.log('Observation updated:', response.data.data);
        window.location.reload()
      }
    } catch (error) {
      // Handle the case where the server returns an error (like 419 or 500)
      console.error('Update failed:', error.response?.data?.message || 'Error');
    }
  }

  // Ouvrir le modal d'ajout d'absence
  const handleAddAbsence = (traineeId) => {
    setSelectedTrainee(traineeId);
    setShowAbsenceModal(true);
  };

  const onDeleteClick = (traineeId)=>{
    setSelectedTrainee(traineeId);
    setShowconfirmdelete(true)
  };

  // Ouvrir le modal de visualisation
  const handleViewAbsences = (traineeId) => {
    setSelectedTrainee(traineeId);
    setShowViewModal(true);
  };
  return (<>
    <tr className={t.days >= 5 ? 'at-risk' : ''} style={{ backgroundColor: t.observation === "depertition" ? "#fff4d0" : "white" }}>
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
        {t.attendance.toFixed(2)}/10
      </td>
      <td>
        <span
          className="status-badge"
          style={{ background: t.sanction.color, minWidth: 'auto', padding: '4px 8px', color: t.sanction.color == "#2e7d32" ||t.sanction.color == "#8B0000"  ? '#ffffff' : '#5a0000' }}
        >
          {t.sanction.label}
        </span>
      </td>
      <td style={{
        display: "flex",
        gap: "5px",
        justifyContent: "center",
      }}>
        <button className="btn btn-sm btn-secondary" onClick={() => handleAddAbsence(t)} style={{ marginLeft: 4 }}>
          <Plus size={14} /> Ajouter Absence
        </button>
        <span></span>
        <button className="btn btn-sm" onClick={() => handleViewAbsences(t)}>
          <Eye size={14} />
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDeleteClick(t)} style={{ marginLeft: 4 }}>
          <Trash2 size={14} />
        </button>
      </td>
      <td>
        <select style={{ padding: "0px 14px" }} value={t.observations} onChange={(e) => Changeobservation(e, t.id)}>
          <option value="en_formation">En formation</option>
          <option value="depertition">Deperdition</option>
        </select>
      </td>
    </tr>


    {/* Modal Row */}
    {(showAbsenceModal || showViewModal || showconfirmdelete) && (
      <tr>
        <td colSpan="8" style={{ padding: 0, border: 0 }}>
          {showAbsenceModal && (
            <AddAbsenceModal
              trainee={selectedTrainee}
              onClose={() => setShowAbsenceModal(false)}
            />
          )}
          {showViewModal && (
            <ViewAbsencesModal
              trainee={selectedTrainee}
              onClose={() => setShowViewModal(false)}
            />
          )}
          {showconfirmdelete && (

            <ConfirmeDeletemodal
              trainee={selectedTrainee}
              onClose={() => setShowconfirmdelete(false)}
            />
          )}
        </td>
      </tr>
    )}
  </>
  );
};

export default StudentRow;