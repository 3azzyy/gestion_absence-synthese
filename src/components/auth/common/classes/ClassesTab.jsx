import React, { useEffect, useState } from 'react';
import ClassesTable from './ClassesTable';
import ClassFilterControls from './ClassFilterControls';
import api from '../../../../services/api';

const ClassesTab = () => {
  const [searchInput, setSearchInput] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [allGroups, setAllGroups] = useState([]); // Master list
  const [filteredGroups, setFilteredGroups] = useState([]); // Display list
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Fetch from API
  useEffect(() => {
    const loadGroups = async () => {

      try {
        const response = await api.get('/groups');
        const data = response.data.data || response.data;
        
        setAllGroups(data);
        setFilteredGroups(data);
        // Optional: Keep backup in localStorage
        localStorage.setItem('classlist', JSON.stringify(data));
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    loadGroups();
  }, []);

  const yearLabel = (classe) => {
    if (classe && classe.name) {
      if (classe.name.includes('10')) return "1er année";
      if (classe.name.includes('20')) return "2ème année";
      if (classe.name.includes('30')) return "3ème année";
      else return "n/a";
    }
  }

  // 2. Filter Logic: Runs whenever searchInput, yearFilter, or the master list changes
  useEffect(() => {
    let result = JSON.parse(localStorage.getItem('classlist')) || allGroups;

    // Filter by name
    if (searchInput) {
      result = result.filter(group => 
        group.name.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    if (yearFilter) {
      result = result.filter(group =>{ 
        const year = yearLabel(group)
        return year === yearFilter
      }
      );
    }
    
    setFilteredGroups(result);
  }, [searchInput, yearFilter, allGroups]);

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
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '8px' }}>
            ({filteredGroups.length} classe{filteredGroups.length > 1 ? 's' : ''})
          </span>
        </h2>

        {loading ? (
          <div className="p-4 text-center">Chargement...</div>
        ) : (
          <ClassesTable
            classes={filteredGroups} 
            year={yearFilter}
          />
        )}
      </div>
    </>
  );
};

export default ClassesTab;