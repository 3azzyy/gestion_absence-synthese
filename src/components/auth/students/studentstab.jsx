import React from 'react';
import QuickStats from '../dashboard/quickstat';
import FilterControls from './filtercontrols';
import StudentsTable from './studentstable';

const StudentsTab = ({ 
  trainees, 
  groups, 
  groupFilter, 
  setGroupFilter,
  statusFilter,
  setStatusFilter,
  searchInput,
  setSearchInput,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onExport,
  sanctionConfig
}) => {
  const uniqueCodes = [...new Set(sanctionConfig.map(s => s.code))];

  return (
    <>
      <QuickStats 
        trainees={trainees} 
        onClick={(filter) => setStatusFilter(filter)}
      />
      
      <FilterControls
        groups={groups}
        uniqueCodes={uniqueCodes}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onAddClick={onAddClick}
        onExport={onExport}
      />

      <div className="card">
        <h2 className="card-header">
          Liste des Stagiaires
          <span style={{fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)'}}>
            ({trainees.length} résultat{trainees.length > 1 ? 's' : ''})
          </span>
        </h2>
        <StudentsTable 
          trainees={trainees}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onViewClick={onViewClick}
        />
      </div>
    </>
  );
};

export default StudentsTab;