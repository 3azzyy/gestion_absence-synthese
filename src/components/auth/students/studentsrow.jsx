import React from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';

const StudentRow = ({ trainee, onEditClick, onDeleteClick, onViewClick }) => {
  const t = trainee;
  console.log(t);
  
  return (
    <tr className={t.days >= 5 ? 'at-risk' : ''}>
      <td><strong>{t.name}</strong></td>
      <td>{t.group}</td>
      <td>{t.heures.toFixed(1)}</td>
      <td>{t.retards}</td>
      <td>{t.days.toFixed(2)}</td>
      <td>
        {/* <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{
              width: `${t.attendance}%`,
              background: t.attendance >= 80 ? 'var(--success)' : t.attendance >= 60 ? 'var(--warning)' : 'var(--danger)'
            }}
          />
        </div> */}
        {t.attendance.toFixed(1)}/10
      </td>
      <td>
        <span 
          className="status-badge" 
          style={{background: t.sanction.color, minWidth: 'auto', padding: '4px 8px'}}
        >
          {t.sanction.label}
        </span>
      </td>
      <td style={{ 
        display:"flex",
        gap:"5px",
        justifyContent:"center",
       }}>
        <button className="btn btn-sm btn-secondary" onClick={() => onEditClick(t.id)} style={{marginLeft: 4}}>
          <Plus size={14} /> Ajouter Absence
        </button>
        <span></span>
        <button className="btn btn-sm" onClick={() => onViewClick(t.id)}>
          <Eye size={14} />
        </button>
        {/* <button className="btn btn-sm btn-danger" onClick={() => onDeleteClick(t.id)} style={{marginLeft: 4}}>
          <Trash2 size={14} />
        </button> */}
      </td>
    </tr>
  );
};

export default StudentRow;