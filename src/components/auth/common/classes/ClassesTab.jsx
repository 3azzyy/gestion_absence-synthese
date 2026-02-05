import React, { useEffect, useState } from 'react';
import ClassesTable from './ClassesTable';
import ClassFilterControls from './ClassFilterControls';
import axios from 'axios';
import api from '../../../../services/api';

const ClassesTab = () => {
  const [searchInput, setSearchInput] = useState('');
  const [Groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState('1er année');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
    const loadGroups = async () => {
      setLoading(true);
      const data = await fetchGroups(searchInput);
      setGroups(data);
      setLoading(false);
    };

    loadGroups();
  }, 500); 
  
  return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

const fetchGroups = async (search) => {
    try {
      // Laravel expects query params in 'params' for GET requests
      const response = await api.get('/groups', {
        params: { search: searchInput || '' } 
      });

      // Based on your api.js handleResponse logic:
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes :', error);
      return [];
    }
  };

  return (
    <>

      <ClassFilterControls
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
      />
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 className="card-header">
          Gestion des Classes
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>
            ({Groups.length} classe{Groups.length > 1 ? 's' : ''})
          </span>
        </h2>


        {loading ? (
          <div className="p-4 text-center">Chargement...</div>
        ) : (
          <ClassesTable
            classes={Groups} year={yearFilter} // Ensure your ClassesTable uses this prop correctly
          />
        )}
      </div>
    </>
  );
};

export default ClassesTab;