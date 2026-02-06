import AbsenceTable from "./absencestable";
import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/http';
import { formatstudents } from '../../utils/calculation';
import { DEFAULT_SANCTION_CONFIG } from '../../utils/constants';
import { fetchWorstStudents } from '../../utils/storage';


export default function Absence(){


 const locate = useLocation();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filTrainees, setFilTrainees] = useState(trainees);
  const [classe, setClasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({ sanction: "", input: "" })
  const sanctions = DEFAULT_SANCTION_CONFIG


  useEffect(() => {
    const pathSegments = locate.pathname.split('/');
    const classFromUrl = pathSegments[2] || "latest";
    setClasse(classFromUrl);
    fetchWorstStudents();
    setGroups(JSON.parse(localStorage.getItem('classlist')));
  }, [locate.pathname]);


  useEffect(() => {
    const loadStudents = async () => {
      if (!classe) return;
      
      setLoading(true);

      try {
        let formattedData = []
        
        if(classe === "latest"){
          formattedData = formatstudents(JSON.parse(localStorage.getItem('worstData'))) 
        }else{
        const targetUrl = `/students/classes/${classe}`;

        const response = await api.get(targetUrl);
        const data = response.data.data || response.data;


        formattedData = formatstudents(data);
        }
        setTrainees(formattedData);
        setFilTrainees(formattedData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setTrainees([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [classe]);


  useEffect(() => {
    // Always start filtering from the master list (trainees)
    let result = [...trainees];

    // 1. Filter by Sanction (Status)
    if (filters.sanction !== "") {
      result = result.filter(t => t.sanction.label === filters.sanction);
    }

    // 2. Filter by Name (Search)
    if (filters.input !== "") {
      const searchTerm = filters.input.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchTerm)
      );
    }

    setFilTrainees(result);
  }, [filters, trainees]);


  
  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    if (newGroup === "") {
      navigate('/view-students/latest');
    } else {
      navigate(`/view-students/${newGroup}`);
    }
  };



  return (
    <>


      <div className="controls-section">
        <div className="controls-grid">

          <div className="form-group">

            <label className="form-label">Filtrer par groupe</label>

            <select className="input" value={classe} onChange={handleGroupChange}>
              <option value="">Stagiaires À Surveiller Cette Semaine</option>
              {groups ? groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>) : <option> rien </option>}
            </select>

          </div>

          <div className="form-group">

            <label className="form-label">Filtrer par statut</label>

            <select className="input" value={filters.sanction} onChange={(e) => setFilters({ ...filters, sanction: e.target.value })}>
              <option value="">Tous les statuts</option>
              {sanctions.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}

            </select>

          </div>

          <div className="form-group">

            <label className="form-label">Rechercher</label>

            <input
              className="input"
              placeholder="chercher stagiaire"
              value={filters.input}
              onChange={(e) => setFilters({ ...filters, input: e.target.value })}
            />

          </div>
          {/* 
          <button className="btn" onClick={onAddClick}>
            <Plus size={16} /> Ajouter
          </button> */}

          {/* {onExport && (
            <button className="btn btn-success" onClick={onExport}>
              <Download size={16} /> Exporter
            </button>
          )} */}
        </div>
      </div>

      <div className="card">

        <h2 className="card-header">

          Liste des Stagiaires

          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>
            ({filTrainees.length} résultat{filTrainees.length > 1 ? 's' : ''})
          </span>

        </h2>

        <AbsenceTable
          trainees={filTrainees}
        />

      </div>


    </>
  );
};
