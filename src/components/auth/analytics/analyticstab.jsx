import React, { useState } from 'react';
import { MONTHS } from '../../utils/constants';

const AnalyticsTab = ({ trainees, settings }) => {
  const [chartType, setChartType] = useState('distribution');

  // Calculate statistics
  const monthlyAbsences = new Array(12).fill(0);
  const groupStats = {};
  const sanctionDistribution = {};

  trainees.forEach(t => {
    // Group statistics
    if (!groupStats[t.group]) {
      groupStats[t.group] = { total: 0, count: 0 };
    }
    groupStats[t.group].total += t.days;
    groupStats[t.group].count += 1;

    // Sanction distribution
    const code = t.sanction.code;
    sanctionDistribution[code] = (sanctionDistribution[code] || 0) + 1;

    // Monthly absences (from logs)
    if (t.data.logs) {
      t.data.logs.forEach(log => {
        if (log.type === 'absence' && log.date) {
          const month = new Date(log.date).getMonth();
          monthlyAbsences[month] += log.hours || 0;
        }
      });
    }
  });

  return (
    <div className="card">
      <h2 className="card-header">Analyses Visuelles</h2>

      <div className="form-group" style={{maxWidth: 300, marginBottom: 20}}>
        <label className="form-label">Type de graphique</label>
        <select className="input" value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="distribution">Distribution des sanctions</option>
          <option value="groups">Comparaison des groupes</option>
          <option value="monthly">Absences par mois</option>
        </select>
      </div>

      {chartType === 'distribution' && (
        <div>
          <h3 style={{marginBottom: 16}}>Distribution des sanctions</h3>
          <div style={{display: 'grid', gap: 12}}>
            {Object.entries(sanctionDistribution).map(([code, count]) => (
              <div key={code} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'rgba(58,124,165,0.05)',
                borderRadius: 'var(--radius)'
              }}>
                <div style={{
                  minWidth: 100,
                  fontWeight: 600,
                  color: 'var(--primary)'
                }}>
                  {code}
                </div>
                <div style={{flex: 1}}>
                  <div style={{
                    height: 24,
                    background: 'var(--accent)',
                    borderRadius: 4,
                    width: `${(count / trainees.length) * 100}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{minWidth: 60, textAlign: 'right', fontWeight: 700}}>
                  {count} ({((count / trainees.length) * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartType === 'groups' && (
        <div>
          <h3 style={{marginBottom: 16}}>Comparaison des groupes</h3>
          <div style={{display: 'grid', gap: 12}}>
            {Object.entries(groupStats).map(([group, stats]) => {
              const avg = stats.total / stats.count;
              return (
                <div key={group} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  background: 'rgba(58,124,165,0.05)',
                  borderRadius: 'var(--radius)'
                }}>
                  <div style={{
                    minWidth: 150,
                    fontWeight: 600,
                    color: 'var(--primary)'
                  }}>
                    {group}
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{
                      height: 24,
                      background: avg >= 5 ? 'var(--danger)' : avg >= 3 ? 'var(--warning)' : 'var(--success)',
                      borderRadius: 4,
                      width: `${Math.min((avg / 10) * 100, 100)}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{minWidth: 100, textAlign: 'right'}}>
                    <div style={{fontWeight: 700}}>{avg.toFixed(2)} jours</div>
                    <div style={{fontSize: 12, color: 'var(--text-muted)'}}>{stats.count} élèves</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {chartType === 'monthly' && (
        <div>
          <h3 style={{marginBottom: 16}}>Heures d'absence par mois</h3>
          <div style={{display: 'grid', gap: 12}}>
            {MONTHS.map((month, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: 'rgba(58,124,165,0.05)',
                borderRadius: 'var(--radius)'
              }}>
                <div style={{
                  minWidth: 100,
                  fontWeight: 600,
                  color: 'var(--primary)'
                }}>
                  {month}
                </div>
                <div style={{flex: 1}}>
                  <div style={{
                    height: 24,
                    background: 'var(--accent)',
                    borderRadius: 4,
                    width: `${Math.min((monthlyAbsences[i] / Math.max(...monthlyAbsences)) * 100, 100)}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{minWidth: 80, textAlign: 'right', fontWeight: 700}}>
                  {monthlyAbsences[i].toFixed(1)}h
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;