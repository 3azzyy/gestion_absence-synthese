import React, { useState } from 'react';
import QuickStats from '../dashboard/quickstat';
import FilterControls from './filtercontrols';
import StudentsTable from './studentstable';
import AddAbsenceModal from '../modals/AddAbsenceModal';
import ViewAbsencesModal from '../modals/ViewAbsencesModal';

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
  sanctionConfig,
  onSaveAbsences  // Nouvelle prop
}) => {
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);

  const uniqueCodes = [...new Set(sanctionConfig.map(s => s.code))];

  // Ouvrir le modal d'ajout d'absence
  const handleAddAbsence = (traineeId) => {
    const trainee = trainees.find(t => t.id === traineeId);
    setSelectedTrainee(trainee);
    setShowAbsenceModal(true);
  };

  // Ouvrir le modal de visualisation
  const handleViewAbsences = (traineeId) => {
    const trainee = trainees.find(t => t.id === traineeId);
    setSelectedTrainee(trainee);
    setShowViewModal(true);
  };

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
          onEditClick={handleAddAbsence}
          onDeleteClick={onDeleteClick}
          onViewClick={handleViewAbsences}
        />
      </div>

      {/* Modal d'ajout d'absences */}
      {showAbsenceModal && selectedTrainee && (
        <AddAbsenceModal
          trainee={selectedTrainee}
          onClose={() => setShowAbsenceModal(false)}
          onSave={onSaveAbsences}
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

export default StudentsTab;