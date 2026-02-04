import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import StatCard from './StatCard';
import axios from 'axios';
import api from '../../../services/http';
import { formatstudents } from '../../utils/calculation';

const DashboardTab = () => {

  const [stats, setStats] = useState({ total: 0, atRisk: 0, totalHours: 0, totalDays: 0 })
  const [topStudents, setTopStudents] = useState([]);
  const [worstStudents, setWorstStudents] = useState([]);
  const [avgAttendance, setAvgAttendance] = useState(stats?.total > 0 ? (stats?.totalHours / stats.total).toFixed(1) : 0);
  const [formattedWorstStudents, setFormattedWorstStudents] = useState([]);
  const [formattedTopStudents, setFormattedTopStudents] = useState([]);


  useEffect(() => {
    const loadData = async () => {
      // Await the data from your functions
      const statsData = await fetchWeeklyStats();
      const worstData = await fetchWorstStudents();
      const topData = await fetchTopStudents();

      // Now update the states with actual data, not Promises
      setStats(statsData);
      setWorstStudents(worstData);
      setTopStudents(topData);
      setAvgAttendance(statsData?.total > 0 ? (statsData?.totalHours / statsData.total).toFixed(1) : 0);
      // Format the lists only after you have the data
      setFormattedWorstStudents(formatstudents(worstData));
      setFormattedTopStudents(formatstudents(topData));
    };

    loadData();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      console.log('Weekly stats response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      return { total: 0, atRisk: 0, totalHours: 0, totalDays: 0 };
    }
  };

  const fetchWorstStudents = async (idclass) => {
    try {
      const url = idclass ? `/dashboard/worst/${idclass}` : '/dashboard/worst';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching worst students:', error);
      return [];
    }
  };

  const fetchTopStudents = async (idclass) => {
    try {
      const url = idclass ? `/dashboard/best/${idclass}` : '/dashboard/best';
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top students:', error);
      return [];
    }
  };

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total Stagiaires" value={stats?.total} />
        <StatCard label="À Risque" value={stats?.atRisk} />
        <StatCard label="Total Heures" value={stats?.totalHours?.toFixed(1) || 0} />
        <StatCard label="Total Jours" value={stats?.totalDays?.toFixed(1) || 0} />
        <StatCard label="Taux Absence Moyen" value={avgAttendance || 0} />
      </div>

      <div className="grid-2">
        <div className="card">
          <h2 className="card-header">Meilleurs Stagiaires</h2>
          
          {formattedTopStudents && formattedTopStudents?.length === 0 ? ( 
            <p style={{ color: 'var(--text-muted)' }}>Aucune donnée</p>
          ) : (  
             formattedTopStudents.slice(0,5).map((t, i) => (
              <div
                key={t.id}
                // onClick={onViewStudent ? () => onViewStudent(t.id) : null}
                style={{
                  padding: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // cursor: onViewStudent ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
                // onMouseEnter={(e) => {
                //   if (onViewStudent) e.currentTarget.style.background = 'rgba(58,124,165,0.04)';
                // }}
                // onMouseLeave={(e) => {
                //   if (onViewStudent) e.currentTarget.style.background = 'transparent';
                // }}
              >
                <div>
                  <strong>{i + 1}. {t.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {t.group} • {t.hours.toFixed(2)} heures
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>
                  {t.attendance.toFixed(1)}/10
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2 className="card-header">Stagiaires À Surveiller Cette Semaine</h2>
          {/* { worstStudents && worstStudents.length === 0 ? ( */}
          <p style={{ color: 'var(--text-muted)' }}>Aucune donnée</p>
          {/* ) : ( ""
            // worstStudents.map((t, i) => (
            //   <div
            //     key={t.id}
            //     onClick={onViewStudent ? () => onViewStudent(t.id) : null}
            //     style={{
            //       padding: 12,
            //       borderBottom: '1px solid var(--border)',
            //       display: 'flex',
            //       justifyContent: 'space-between',
            //       alignItems: 'center',
            //       cursor: onViewStudent ? 'pointer' : 'default',
            //       transition: 'background 0.2s'
            //     }}
            //     onMouseEnter={(e) => {
            //       if (onViewStudent) e.currentTarget.style.background = 'rgba(183,28,28,0.04)';
            //     }}
            //     onMouseLeave={(e) => {
            //       if (onViewStudent) e.currentTarget.style.background = 'transparent';
            //     }}
            //   >
            //     <div>
            //       <strong>{i + 1}. {t.name}</strong>
            //       <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            //         {t.group} • {t.days.toFixed(2)} jours
            //       </div>
            //     </div>
            //     <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>
            //       {t.attendance.toFixed(1)}/10
            //     </div>
            //   </div>
            // ))
          )} */}
        </div>
      </div>

      {/* <div className="card">
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
      </div> */}
    </>
  );
};

export default DashboardTab;