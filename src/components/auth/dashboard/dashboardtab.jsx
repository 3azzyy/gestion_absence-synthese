import React, { useEffect, useState } from 'react';
import { Eye, Printer } from 'lucide-react';
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

  const sanctionDistribution = []
  const groupStats = []

  useEffect(() => {

    const fetchall = async () => {
      await fetchWeeklyStats();
      await fetchTopStudents();
      await fetchWorstStudents();
    }

    fetchall();
  }, [])


  useEffect(() => {
    const loadData = async () => {
      // Await the data from your functions
      const statsData = 'statsData' in localStorage ? JSON.parse(localStorage.getItem("statsData")) : await fetchWeeklyStats();
      const worstData = 'worstData' in localStorage ? JSON.parse(localStorage.getItem("worstData")) : await fetchWorstStudents();
      const topData = 'topData' in localStorage ? JSON.parse(localStorage.getItem("topData")) : await fetchTopStudents();

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
      localStorage.setItem('statsData', JSON.stringify(response.data.data))
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
      localStorage.setItem('worstData', JSON.stringify(response.data.data))
      return response.data.data;
    } catch (error) {
      console.error('Error fetching worst students:', error);
      return [];
    }
  };

  const fetchTopStudents = async (idclass) => {
    try {
      const url = idclass ? `/dashboard/best/${idclass}` : '/dashboard/best';
      const response = await api.get(url);
      localStorage.setItem('topData', JSON.stringify(response.data.data))
      return response.data.data;
    } catch (error) {
      console.error('Error fetching top students:', error);
      return [];
    }
  };

  const handlePrintTopStudents = () => {
    const printWindow = window.open('', '', 'width=800,height=600');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Meilleurs Stagiaires</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1a1a1a;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #1a1a1a;
            }
            .date {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #f5f5f5;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              border-bottom: 2px solid #ddd;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            tr:hover {
              background-color: #fafafa;
            }
            .rank {
              font-weight: 700;
              color: #3a7ca5;
            }
            .score {
              font-weight: 700;
              color: #16a34a;
              font-size: 16px;
            }
            .group {
              color: #666;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Meilleurs Stagiaires</h1>
          <div class="date">${new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</div>
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">Rang</th>
                <th>Nom</th>
                <th>Groupe</th>
                <th>Heures</th>
                <th style="width: 100px; text-align: right;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${formattedTopStudents.map((student, index) => `
                <tr>
                  <td class="rank">${index + 1}</td>
                  <td><strong>${student.name}</strong></td>
                  <td class="group">${student.group}</td>
                  <td>${student.heures} heures</td>
                  <td class="score" style="text-align: right;">${student.attendance.toFixed(2)}/10</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePrintWorstStudents = () => {
    const printWindow = window.open('', '', 'width=800,height=600');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Stagiaires À Surveiller</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #1a1a1a;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #1a1a1a;
            }
            .date {
              font-size: 14px;
              color: #666;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background-color: #f5f5f5;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              border-bottom: 2px solid #ddd;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #eee;
            }
            tr:hover {
              background-color: #fafafa;
            }
            .rank {
              font-weight: 700;
              color: #3a7ca5;
            }
            .hours {
              font-weight: 700;
              color: #dc2626;
              font-size: 16px;
            }
            .group {
              color: #666;
              font-size: 14px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Stagiaires À Surveiller Cette Semaine</h1>
          <div class="date">${new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}</div>
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">Rang</th>
                <th>Nom</th>
                <th>Groupe</th>
                <th>Jours d'absence</th>
                <th style="width: 120px; text-align: right;">Heures</th>
              </tr>
            </thead>
            <tbody>
              ${formattedWorstStudents.map((student, index) => `
                <tr>
                  <td class="rank">${index + 1}</td>
                  <td><strong>${student.name}</strong></td>
                  <td class="group">${student.group}</td>
                  <td>${student.days.toFixed(2)} jours</td>
                  <td class="hours" style="text-align: right;">${student.heures} heures</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Total Stagiaires" value={stats?.total} />
        <StatCard label="À Risque" value={stats?.atRisk} />
        <StatCard label="Total Heures" value={stats?.totalHours?.toFixed(2) || 0} />
        <StatCard label="Total Jours" value={stats?.totalDays?.toFixed(2) || 0} />
        <StatCard label="Taux Absence Moyen" value={avgAttendance || 0} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '12px' }}>
            <h2 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'visible', flexShrink: 0, fontSize: '18px' }}>Meilleurs Stagiaires</h2>
            <button
              className="btn btn-sm"
              onClick={handlePrintTopStudents}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
            >
              <Printer size={14} /> Imprimer
            </button>
          </div>

          {formattedTopStudents && formattedTopStudents?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucune donnée</p>
          ) : (
            formattedTopStudents.slice(0, 5).map((t, i) => (
              <div
                key={t.id}
                style={{
                  padding: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <div>
                  <strong>{i + 1}. {t.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {t.group} • {parseFloat(t.heures).toFixed(2)} heures
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
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '12px' }}>
            <h2 style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'visible', flexShrink: 0, fontSize: '18px' }}>Stagiaires À Surveiller Cette Semaine</h2>
            <button
              className="btn btn-sm"
              onClick={handlePrintWorstStudents}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
            >
              <Printer size={14} /> Imprimer
            </button>
          </div>

          {formattedWorstStudents && formattedWorstStudents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucune donnée</p>
          ) : (
            formattedWorstStudents.slice(0, 5).map((t, i) => (
              <div
                key={t.id}
                style={{
                  padding: 12,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'default',
                  transition: 'background 0.2s'
                }}
              >
                <div>
                  <strong>{i + 1}. {t.name}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {t.group} • {t.days.toFixed(2)} jours
                  </div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--danger)' }}>
                  {parseFloat(t.heures).toFixed(2)} heures
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Distribution des sanctions</h3>
          <div style={{ display: 'grid', gap: 12 }}>
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
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: 24,
                    background: 'var(--accent)',
                    borderRadius: 4,
                    width: `${(count / trainees.length) * 100}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ minWidth: 60, textAlign: 'right', fontWeight: 700 }}>
                  {count} ({((count / trainees.length) * 100).toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Comparaison des groupes</h3>
          <div style={{ display: 'grid', gap: 12 }}>
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
                  <div style={{ flex: 1 }}>
                    <div style={{
                      height: 24,
                      background: avg >= 5 ? 'var(--danger)' : avg >= 3 ? 'var(--warning)' : 'var(--success)',
                      borderRadius: 4,
                      width: `${Math.min((avg / 10) * 100, 100)}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ minWidth: 100, textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{avg.toFixed(2)} jours</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stats.count} élèves</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div> */}
    </>
  );
};

export default DashboardTab;