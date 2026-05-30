import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/http';
import AbsenceTable from "./absencestable";

export default function Absence() {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const [pagination, setPagination] = useState({
    current: 1,
    last: 1,
    total: 0
  });

  const getMonday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    return new Date(today.setDate(diff)).toISOString().split('T')[0];
  };

  const [filters, setFilters] = useState({
    date_from: getMonday(), // Points to this Monday
    date_to: new Date().toISOString().split('T')[0], // Points to today
    status: "",
    group: "",
    input: ""
  });

  useEffect(() => {
    const classList = JSON.parse(localStorage.getItem('classlist')) || [];
    setGroups(classList);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const params = {
          date_from: filters.date_from,
          date_to: filters.date_to,
          status: filters.status !== "" ? filters.status : null,
          group: filters.group !== "" ? filters.group : null,
          page: pagination.current
        };

        const response = await api.get('/absences', { params });
        const result = response.data.data;

        // Sync with Laravel Paginate structure
        setAbsences(result.data || []);
        setPagination(prev => ({
          ...prev,
          current: result.current_page,
          last: result.last_page,
          total: result.total
        }));
      } catch (error) {
        console.error('Error fetching absences:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchHistory, 400);
    return () => clearTimeout(timer);
  }, [filters, pagination.current]);

  // Matches your DB 'status' enum: absent, late, justified, present
  const statusOptions = [
    { label: 'Absent', value: 'absent' },
    { label: 'Retard', value: 'late' },
    { label: 'Justifié', value: 'justified' }
  ];

  const handlereset = () => {
    setFilters({
      date_from: getMonday(), // Points to this Monday
      date_to: new Date().toISOString().split('T')[0], // Points to today
      status: "",
      group: "",
      input: ""
    })
  }

  let displayedData = []

  if (filters.input !== "") {
    displayedData = absences.filter(abs =>
      abs.student?.full_name?.toLowerCase().includes(filters.input.toLowerCase())
    );
  } else displayedData = absences

  return (
    <div className="absence-container">
      <div className="controls-section">
        <div className="controls-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>

          <div className="form-group">
            <label className="form-label">Date Début</label>
            <input
              type="date"
              
              className="input"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date Fin</label>
            <input
              type="date"
              
              className="input"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Groupe</label>
            <select
              className="input"
              value={filters.group}
              onChange={(e) => setFilters({ ...filters, group: e.target.value })}
            >
              <option value="">Tous les groupes</option>
              {groups?.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              className="input"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Recherche Stagiaire</label>
            <input
              className="input"
              placeholder="Nom..."
              value={filters.input}
              onChange={(e) => setFilters({ ...filters, input: e.target.value })}
            />
          </div>

          <button className="btn" style={{justifyContent: "center" }} onClick={() => handlereset()}>Remetter a nouveau</button>
        </div>
        
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
          <h2 style={{ margin: 0 }}>Historique des présences</h2>
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>
            ({pagination.total} résultat{pagination.total > 1 ? 's' : ''})
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Chargement des données...</div>
        ) : (
          <>
            <AbsenceTable absences={displayedData} />

            {pagination.last > 1 && (
              <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', padding: '20px', gap: '15px' }}>
                <button
                  className="btn"
                  disabled={pagination.current === 1}
                  onClick={() => setPagination(p => ({ ...p, current: p.current - 1 }))}
                >
                  Précédent
                </button>
                <span style={{ alignSelf: 'center' }}>Page {pagination.current} / {pagination.last}</span>
                <button
                  className="btn"
                  disabled={pagination.current === pagination.last}
                  onClick={() => setPagination(p => ({ ...p, current: p.current + 1 }))}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}