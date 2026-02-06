import React from 'react';

const ClassFilterControls = ({
  searchInput,
  setSearchInput,
  yearFilter,
  setYearFilter
}) => (
  <div className="controls-section">
    <div className="controls-grid">
      <div className="form-group">
        <label className="form-label">Rechercher une classe</label>
        <div 
        style={{
          display: 'flex',
          width: '50%',
          gap: '5%'
        }}>
        <input style={{width: '50%'}}
          className="input"
          placeholder="Nom de la classe..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select className="input" style={{width: '50%'}} value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="" >Tous Les Groups</option>
          <option value="1er année">1er année</option>
          <option value="2ème année">2ème année</option>
          {/* <option value="3ème année">3ème année</option> */}
        </select>
        </div>
      </div>
    </div>
  </div>
);

export default ClassFilterControls;