import React from 'react';
import StudentRow from './studentsrow';
import EmptyState from './emptystates';

const StudentsTable = ({ trainees, onEditClick, onDeleteClick, onViewClick }) => (
  <div className="table-wrapper">
    <table className="table">
      <thead>
        <tr>
          <th>Nom complet</th>
          <th>Groupe</th>
          <th>Heures</th>
          <th>Retards</th>
          <th>Jours</th>
          <th>Assiduité</th>
          <th>Niveau</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trainees.length === 0 ? (
          <tr>
            <td colSpan="8" style={{padding: 0}}>
              <EmptyState 
                message="Aucun stagiaire trouvé"
                description="Commencez par ajouter des stagiaires ou ajustez vos filtres"
              />
            </td>
          </tr>
        ) : (
          trainees.map(t => (
            <StudentRow 
              key={t.id}
              trainee={t}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onViewClick={onViewClick}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default StudentsTable;