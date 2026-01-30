import React, { useState } from 'react';
import TraineeForm from './TraineeForm';

const AddTraineeModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    group: '',
    heures: 0,
    retards: 0,
    indiscipline: 0
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('Le nom est obligatoire');
      return;
    }
    onAdd({
      ...formData,
      group: formData.group || 'Général'
    });
    onClose();
  };

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Ajouter un nouveau stagiaire</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <TraineeForm formData={formData} setFormData={setFormData} />
        
        <div className="action-buttons">
          <button className="btn" onClick={handleSubmit}>✓ Confirmer</button>
          <button className="btn btn-secondary" onClick={onClose}>✕ Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default AddTraineeModal;