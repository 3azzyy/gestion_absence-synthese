import React from 'react';

const TraineeForm = ({ formData, setFormData }) => (
  <>
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Nom complet {!formData.name && '*'}</label>
        <input 
          className="input" 
          placeholder="Prénom Nom"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Groupe</label>
        <input 
          className="input" 
          placeholder="Général"
          value={formData.group}
          onChange={(e) => setFormData({...formData, group: e.target.value})}
        />
      </div>
    </div>
    
    <div className="form-row">
      <div className="form-group">
        <label className="form-label">Heures</label>
        <input 
          className="input" 
          type="number" 
          min="0" 
          step="0.5"
          value={formData.heures}
          onChange={(e) => setFormData({...formData, heures: Number(e.target.value)})}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Retards</label>
        <input 
          className="input" 
          type="number" 
          min="0"
          value={formData.retards}
          onChange={(e) => setFormData({...formData, retards: Number(e.target.value)})}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Indiscipline</label>
        <input 
          className="input" 
          type="number" 
          min="0"
          value={formData.indiscipline}
          onChange={(e) => setFormData({...formData, indiscipline: Number(e.target.value)})}
        />
      </div>
    </div>
  </>
);

export default TraineeForm;