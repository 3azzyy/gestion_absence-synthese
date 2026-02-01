import React from 'react';

const ClassFilterControls = ({
  searchInput,
  setSearchInput
}) => (
  <div className="controls-section">
    <div className="controls-grid">
      <div className="form-group">
        <label className="form-label">Rechercher une classe</label>
        <input 
          className="input" 
          placeholder="Nom de la classe..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  </div>
);

export default ClassFilterControls;