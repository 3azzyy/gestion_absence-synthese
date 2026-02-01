import React from 'react';
import { Eye } from 'lucide-react';

const ClassRow = ({ classData, onViewClass }) => {
  return (
    <tr>
      <td><strong>{classData.className}</strong></td>
      <td>{classData.year}</td>
      <td>
        <span style={{
          background: 'rgba(58,124,165,0.1)',
          padding: '4px 12px',
          borderRadius: '12px',
          color: 'var(--primary)',
          fontWeight: 600
        }}>
          {classData.studentCount}
        </span>
      </td>
      <td>
        <button 
          className="btn btn-sm" 
          onClick={() => onViewClass(classData.className)}
          title="Consulter les stagiaires"
        >
          <Eye size={14} /> Voir stagiaires
        </button>
      </td>
    </tr>
  );
};

export default ClassRow;