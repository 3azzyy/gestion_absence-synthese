import React, { useState } from 'react';

const SettingsModal = ({ settings, onClose, onSave }) => {
  const [formData, setFormData] = useState(settings);

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Paramètres du système</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Heures pour 1 jour d'absence</label>
          <input 
            className="input" 
            type="number" 
            min="1" 
            step="0.5"
            value={formData.hoursPerDay}
            onChange={(e) => setFormData({...formData, hoursPerDay: Number(e.target.value)})}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Retards pour 1 jour d'absence</label>
          <input 
            className="input" 
            type="number" 
            min="1"
            value={formData.retardsPerDay}
            onChange={(e) => setFormData({...formData, retardsPerDay: Number(e.target.value)})}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Année académique</label>
          <input 
            className="input" 
            type="number" 
            min="2020" 
            max="2030"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: Number(e.target.value)})}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Jours de formation totaux</label>
          <input 
            className="input" 
            type="number" 
            min="1"
            value={formData.totalDays}
            onChange={(e) => setFormData({...formData, totalDays: Number(e.target.value)})}
          />
          <small style={{color: 'var(--text-muted)'}}>Pour le calcul du taux d'assiduité</small>
        </div>
        
        <div className="action-buttons">
          <button className="btn" onClick={() => onSave(formData)}>✓ Enregistrer</button>
          <button className="btn btn-secondary" onClick={onClose}>✕ Annuler</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;