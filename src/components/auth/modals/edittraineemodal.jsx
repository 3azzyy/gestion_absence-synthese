import React, { useState } from 'react';
import TraineeForm from './TraineeForm';

const EditTraineeModal = ({ trainee, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    name: trainee.name,
    group: trainee.group,
    heures: trainee.heures || 0,
    retards: trainee.retards || 0,
    indiscipline: trainee.indiscipline || 0
  });

  const handleSubmit = () => {
    onEdit(formData);
  };

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Modifier le stagiaire</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <TraineeForm formData={formData} setFormData={setFormData} />
        
        <div className="action-buttons">
          <button className="btn" onClick={handleSubmit}>✓ Enregistrer</button>
          <button className="btn btn-secondary" onClick={onClose}>✕ Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default EditTraineeModal;