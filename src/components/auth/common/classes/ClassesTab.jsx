import React from 'react';
import ClassesTable from './ClassesTable';
import ClassFilterControls from './ClassFilterControls';

const ClassesTab = ({ 
  trainees, 
  groups,
  searchInput,
  setSearchInput,
  onViewClass
}) => {
  // Calculer les statistiques par groupe
  const classesData = groups.map(group => {
    const groupTrainees = trainees.filter(t => t.group === group);
    
    // Extraire l'année d'étude du nom du groupe (ex: "DEV101" -> "1ère année")
    const getYear = (groupName) => {
      if (groupName.includes('101') || groupName.includes('1')) return '1ère année';
      if (groupName.includes('201') || groupName.includes('2')) return '2ème année';
      if (groupName.includes('301') || groupName.includes('3')) return '3ème année';
      return 'N/A';
    };

    return {
      id: group,
      className: group,
      year: getYear(group),
      studentCount: groupTrainees.length,
      trainees: groupTrainees
    };
  });

  return (
    <>

    <ClassFilterControls
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-header">
          Gestion des Classes
          <span style={{fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)'}}>
            ({classesData.length} classe{classesData.length > 1 ? 's' : ''})
          </span>
        </h2>
        <ClassesTable 
          classes={classesData}
          onViewClass={onViewClass}
        />
      </div>
    </>
  );
};

export default ClassesTab;