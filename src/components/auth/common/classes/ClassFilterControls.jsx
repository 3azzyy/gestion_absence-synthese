import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../../../../services/http'

const ClassFilterControls = ({
  searchInput,
  setSearchInput,
  yearFilter,
  setYearFilter,
  onAddGroup 
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

    if (!groupName.trim()) {
      setError('Veuillez entrer le nom du groupe');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Send to Backend
      // This ensures the database creates the ID and the record
      const response = await api.post('/groups', {
        name: groupName.trim(),
        year: groupYear
      });

      const newGroup = response.data.data; // The real group from Laravel with real ID

      // 2. Update LocalStorage for the dropdowns
      const existingGroups = JSON.parse(localStorage.getItem('classlist') || '[]');
      const updatedGroups = [...existingGroups, { id: newGroup.id, name: newGroup.name }];
      localStorage.setItem('classlist', JSON.stringify(updatedGroups));

      alert('Groupe ajouté avec succès!');
      window.location.reload()
      handleCloseModal();
    } catch (error) {
      console.log(error)
      const msg = error.response?.data?.message || 'Erreur lors de l\'ajout du groupe';
      setError(msg);
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
                <option value="3ème année">3ème année</option>
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
                    <option value="3ème année">3ème année</option>
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