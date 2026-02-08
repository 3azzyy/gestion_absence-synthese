import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ClassFilterControls = ({
  searchInput,
  setSearchInput,
  yearFilter,
  setYearFilter,
  onAddGroup // Callback function to refresh groups in parent component
}) => {
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupYear, setGroupYear] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
    setGroupName('');
    setGroupYear('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGroupName('');
    setGroupYear('');
    setError('');
  };

  const checkGroupExists = (name) => {
    // Get existing groups from localStorage
    const existingGroups = JSON.parse(localStorage.getItem('classlist') || '[]');
    return existingGroups.some(group => 
      group.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!groupName.trim()) {
      setError('Veuillez entrer le nom du groupe');
      return;
    }

    if (!groupYear) {
      setError('Veuillez sélectionner l\'année');
      return;
    }

    // Check if group exists
    if (checkGroupExists(groupName.trim())) {
      setError('Ce groupe existe déjà');
      return;
    }

    setSubmitting(true);

    try {
      const newGroup = {
        id: Date.now(), // Generate unique ID
        name: groupName.trim(),
        year: groupYear
      };

      // Get existing groups
      const existingGroups = JSON.parse(localStorage.getItem('classlist') || '[]');
      
      // Add new group
      const updatedGroups = [...existingGroups, newGroup];
      
      // Save to localStorage
      localStorage.setItem('classlist', JSON.stringify(updatedGroups));

      // Call parent callback if provided
      if (onAddGroup) {
        await onAddGroup(newGroup);
      }

      alert('Groupe ajouté avec succès!');
      handleCloseModal();
    } catch (error) {
      console.error('Error adding group:', error);
      setError('Erreur lors de l\'ajout du groupe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="controls-section">
        <div className="controls-grid">
          <div className="form-group">
            <label className="form-label">Rechercher une classe</label>
            <div 
              style={{
                display: 'flex',
                width: '100%',
                gap: '12px',
                alignItems: 'flex-end'
              }}
            >
              <input 
                style={{ flex: 1 }}
                className="input"
                placeholder="Nom de la classe..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <select 
                className="input" 
                style={{ flex: 1 }} 
                value={yearFilter} 
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">Tous Les Groupes</option>
                <option value="1er année">1er année</option>
                <option value="2ème année">2ème année</option>
              </select>
              <button 
                className="btn" 
                onClick={handleOpenModal}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Plus size={16} /> Ajouter groupe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Group Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un Groupe</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Nom du groupe <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Entrer le nom du groupe"
                    value={groupName}
                    onChange={(e) => {
                      setGroupName(e.target.value);
                      setError(''); // Clear error when user types
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Année <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select
                    className="input"
                    value={groupYear}
                    onChange={(e) => {
                      setGroupYear(e.target.value);
                      setError(''); // Clear error when user selects
                    }}
                    required
                  >
                    <option value="">Sélectionner l'année</option>
                    <option value="1er année">1er année</option>
                    <option value="2ème année">2ème année</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassFilterControls;