import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmeDeleteGroupModal from '../../modals/classconfirmdelete';

const ClassRow = (props) => {
  const [showconfirmdelete, setShowconfirmdelete] = useState(false);
  const [selectedgroup, setSelectedgroup] = useState(null);

  const onDeleteClick = (cls)=>{
    setSelectedgroup(cls);
    setShowconfirmdelete(true)
  };

  const navigate = useNavigate();
  const classe = props.class;

  const yearLabel = (classee) => {
  if (!classee) return "n/a" ;

  // Regex : ([A-Z]+) capture les lettres, ([0-9]+) capture les chiffres
  const match = classee.match(/^([A-Za-z]+)([0-9]+)$/);

  if (match) {
    const filiere = match[1]; // ex: DEV
    const numero = match[2];  // ex: 101
    
    // Déterminer l'année selon le premier chiffre du numéro
    const firstDigit = numero.charAt(0);
    const labels = {
      '1': "1er année",
      '2': "2ème année",
      '3': "3ème année"
    };

    return labels[firstDigit] || "n/a"
    
  }

  return "n/a";
};


  return (<>

    <tr key={classe.id} >
      <td><strong>{classe.name}</strong></td>
      <td>{yearLabel(classe.name)}</td>
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
        <button className="btn btn-sm btn-danger" onClick={() => onDeleteClick(classe)} style={{ marginLeft: 4 }}>
          <Trash2 size={14} />
        </button>
      </td>
    </tr >

    {/* Modal Row */}
    {(showconfirmdelete) && (
      <tr>
        <td colSpan="8" style={{ padding: 0, border: 0 }}>
          {showconfirmdelete && (

            <ConfirmeDeleteGroupModal
              group={selectedgroup}
              onClose={() => setShowconfirmdelete(false)}
            />
          )}
        </td>
      </tr>
    )}

  </>);

};

export default ClassRow;