import React from 'react';
import ClassRow from './ClassRow';
import EmptyState from './EmptyState';

const ClassesTable = (props) => (<>

  <div className="table-wrapper">
    <style> 
      {`
        th, td {  
          text-align: center!important;
        }
      `}
    </style>
    <table className="table">
      <thead>
        <tr>
          <th>Classe</th>
          <th>Année d'étude</th>
          <th>Nombre de stagiaires</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.classes?.length === 0 ? (
          <tr>
            <td colSpan="4" style={{padding: 0}}>
              <EmptyState 
                message="Aucune classe trouvée"
                description="Aucune classe ne correspond à votre recherche"
              />
            </td>
          </tr>
        ) : (
          props.classes?.map(classData => (
            <ClassRow 
              key={classData.id}
              class={classData}
              year={props.year}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
</>);

export default ClassesTable;