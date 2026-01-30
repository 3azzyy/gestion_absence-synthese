import React from 'react';
import { Eye } from 'lucide-react';
import StatCard from './StatCard';

const DashboardTab = ({ trainees, settings, sanctionConfig, onViewStudent }) => {
  const total = trainees.length;
  const atRisk = trainees.filter(t => t.days >= 5).length;
  const totalHours = trainees.reduce((sum, t) => sum + t.heures, 0);
  const totalDays = trainees.reduce((sum, t) => sum + t.days, 0);
  const avgAttendance = total > 0 
    ? (trainees.reduce((sum, t) => sum + t.attendance, 0) / total).toFixed(1)
    : 0;

  const warnings = trainees
    .filter(t => t.days >= 2)
    .sort((a, b) => b.days - a.days);

  const topStudents = [...trainees]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);

  const worstStudents = [...trainees]
    .sort((a, b) => a.attendance - b.attendance)
    .slice(0, 5);

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total Stagiaires" value={total} />
        <StatCard label="À Risque" value={atRisk} />
        <StatCard label="Total Heures" value={totalHours.toFixed(1)} />
        <StatCard label="Total Jours" value={totalDays.toFixed(1)} />
        <StatCard label="Taux Présence Moyen" value={`${avgAttendance}%`} />
      </div>

      <div className="card">
        <h2 className="card-header">Alertes et Avertissements</h2>
        {warnings.length === 0 ? (
          <div className="alert alert-success">✓ Aucune alerte pour le moment</div>
        ) : (
          warnings.map(t => (
            <div key={t.id} className={`alert alert-${t.days >= 5 ? 'danger' : 'warning'}`}>
              <div style={{flex: 1}}>
                <strong>{t.name}</strong> — {t.days.toFixed(2)} jours d'absence — {t.sanction.label}
                <br/><small>Action requise: {t.sanction.action}</small>
              </div>
              {onViewStudent && (
                <button className="btn btn-sm" onClick={() => onViewStudent(t.id)}>
                  <Eye size={14} /> Voir
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-header">Meilleurs Stagiaires</h2>
          {topStudents.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>Aucune donnée</p>
          ) : (
            topStudents.map((t, i) => (
              <div 
                key={t.id}
                onClick={onViewStudent ? () => onViewStudent(t.id) : null}
                style={{
                  padding: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: onViewStudent ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (onViewStudent) e.currentTarget.style.background = 'rgba(58,124,165,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (onViewStudent) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div>
                  <strong>{i + 1}. {t.name}</strong>
                  <div style={{fontSize: 12, color: 'var(--text-muted)'}}>
                    {t.group} • {t.days.toFixed(2)} jours
                  </div>
                </div>
                <div style={{fontSize: 18, fontWeight: 700, color: 'var(--success)'}}>
                  {t.attendance.toFixed(1)}%
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2 className="card-header">Stagiaires À Surveiller</h2>
          {worstStudents.length === 0 ? (
            <p style={{color: 'var(--text-muted)'}}>Aucune donnée</p>
          ) : (
            worstStudents.map((t, i) => (
              <div 
                key={t.id}
                onClick={onViewStudent ? () => onViewStudent(t.id) : null}
                style={{
                  padding: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: onViewStudent ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (onViewStudent) e.currentTarget.style.background = 'rgba(183,28,28,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (onViewStudent) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div>
                  <strong>{i + 1}. {t.name}</strong>
                  <div style={{fontSize: 12, color: 'var(--text-muted)'}}>
                    {t.group} • {t.days.toFixed(2)} jours
                  </div>
                </div>
                <div style={{fontSize: 18, fontWeight: 700, color: 'var(--danger)'}}>
                  {t.attendance.toFixed(1)}%
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardTab;