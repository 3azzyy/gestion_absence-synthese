import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClassRow = (props) => {

  const navigate = useNavigate();
  const classe = props.class;

  const yearLabel = (classe) => {
    if (classe && classe.name) {
      if (classe.name.includes('10')) return "1er année";
      if (classe.name.includes('20')) return "2ème année";
      if (classe.name.includes('30')) return "3ème année";
      else return "n/a";
    }
  }

  
  return (<>
   { yearLabel(classe) !== props.year ? null :
      <tr key={classe.id} >
        <td><strong>{classe.name}</strong></td>
        <td>{yearLabel(classe)}</td>
        <td>
          <span style={{
            background: 'rgba(58,124,165,0.1)',
            padding: '4px 12px',
            borderRadius: '12px',
            color: 'var(--primary)',
            fontWeight: 600
          }}>
            {classe.students_count}
          </span>
        </td>
        <td>
          <button
            className="btn btn-sm"
            onClick={() => navigate(`/view-students/${classe.name}`)}
            title="Consulter les stagiaires"
          >
            <Eye size={14} /> Voir stagiaires
          </button>
        </td>
      </tr >
}
</>);

};

export default ClassRow;