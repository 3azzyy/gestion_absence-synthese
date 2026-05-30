import React from 'react';

const QuickStats = ({ trainees}) => {
  const total = trainees.length;
  const atRisk = trainees.filter(t => t.days >= 5).length;
  const warnings = trainees.filter(t => t.days >= 2 && t.days < 5).length;
  const normal = trainees.filter(t => t.days < 2).length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: 12,
      marginBottom: 24,
      padding: 16,
      background: 'rgba(58,124,165,0.05)',
      borderRadius: 'var(--radius)'
    }}>
      <QuickStatItem label="Total" value={total} color="var(--primary)" />
      <QuickStatItem label="Normal" value={normal} color="var(--success)" />
      <QuickStatItem label="Avertis" value={warnings} color="var(--warning)" />
      <QuickStatItem label="À risque" value={atRisk} color="var(--danger)" />
    </div>
  );
};

const QuickStatItem = ({ label, value, color, onClick }) => (
  <div 
    
    style={{
      textAlign: 'center',
      padding: 12,
      background: 'white',
      borderRadius: 'var(--radius)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      border: '2px solid transparent'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'transparent';
    }}
  >
    <div style={{fontSize: 24, fontWeight: 700, color: color}}>{value}</div>
    <div style={{fontSize: 12, color: 'var(--text-secondary)', textTransform: 'uppercase'}}>
      {label}
    </div>
  </div>
);

export default QuickStats;