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

  const yearLabel = (classee) => {
  if (!classee) return "n/a" ;

  // Regex : ([A-Z]+) capture les lettres, ([0-9]+) capture les chiffres
  const match = classee.match(/^([A-Za-z]+)([0-9]+)$/);

  if (match) {
    const filiere = match[1]; // ex: DEV
    const numero = match[2];  // ex: 101
    
    // Déterminer l'année selon le premier chiffre du numéro
    const firstDigit = numero.charAt(0);
    const labels = {
      '1': "1er année",
      '2': "2ème année",
      '3': "3ème année"
    };

    return labels[firstDigit] || "n/a"
    
  }

  return "n/a";
};

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
        const year = yearLabel(group.name)
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