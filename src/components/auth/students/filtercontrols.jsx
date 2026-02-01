import React from 'react';
import { Plus, Download } from 'lucide-react';

const FilterControls = ({
  groups,
  uniqueCodes,
  groupFilter,
  setGroupFilter,
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput,
  onAddClick,
  onExport
}) => (
  <div className="controls-section">
    <div className="controls-grid">
      <div className="form-group">
        <label className="form-label">Filtrer par groupe</label>
        <select className="input" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option value="">Tous les groupes</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Filtrer par statut</label>
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tous les statuts</option>
          {uniqueCodes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Rechercher</label>
        <input 
          className="input" 
          placeholder="Nom du stagiaire..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      {/* <button className="btn" onClick={onAddClick}>
        <Plus size={16} /> Ajouter
      </button> */}
      {onExport && (
        <button className="btn btn-success" onClick={onExport}>
          <Download size={16} /> Exporter
        </button>
      )}
    </div>
  </div>
);

export default FilterControls;