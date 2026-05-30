import React, { useEffect, useState } from 'react';
import StudentsTable from './studentstable';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../../services/http';
import { formatstudents } from '../../utils/calculation';
import { DEFAULT_SANCTION_CONFIG } from '../../utils/constants';
import { fetchWorstStudents } from '../../utils/storage';
import { Book, Download, Plus, Sheet, X } from 'lucide-react';

const StudentsTab = () => {
  const locate = useLocation();
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState([]);
  const [filTrainees, setFilTrainees] = useState(trainees);
  const [classe, setClasse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({ sanction: "", input: "" });
  const sanctions = DEFAULT_SANCTION_CONFIG;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cef: '',
    prenom: '',
    nom: '',
    cin: '',
    groupType: 'existing', // 'existing' or 'nouveau'
    existingGroup: '',
    newGroup: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const pathSegments = locate.pathname.split('/');
    const classFromUrl = pathSegments[2] || "latest";
    setClasse(classFromUrl);
    fetchWorstStudents();
    setGroups(JSON.parse(localStorage.getItem('classlist')) || []);
  }, [locate.pathname]);

  useEffect(() => {
    const loadStudents = async () => {
      if (!classe) return;

      setLoading(true);
      setError(null);

      try {
        let formattedData = [];

        if (classe === "latest") {
          const worstData = localStorage.getItem('worstData');
          formattedData = formatstudents(JSON.parse(worstData || '[]'));
        } else {
          const targetUrl = `/students/classes/${classe}`;
          const response = await api.get(targetUrl);
          const data = response.data.data || response.data;
          formattedData = formatstudents(data);
        }
        
        setTrainees(formattedData);
        setFilTrainees(formattedData);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Erreur lors du chargement des stagiaires');
        setTrainees([]);
        setFilTrainees([]);
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
      result = result.filter(t => t.sanction?.label === filters.sanction);
    }

    // 2. Filter by Name (Search)
    if (filters.input !== "") {
      const searchTerm = filters.input.toLowerCase();
      result = result.filter(t =>
        t.name?.toLowerCase().includes(searchTerm)
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

  const handleAddStudent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form
    setFormData({
      cef: '',
      prenom: '',
      nom: '',
      cin: '',
      groupType: 'existing',
      existingGroup: '',
      newGroup: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitStudent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.cef || !formData.prenom || !formData.nom || !formData.cin) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.groupType === 'existing' && !formData.existingGroup) {
      alert('Veuillez sélectionner un groupe');
      return;
    }

    if (formData.groupType === 'nouveau' && !formData.newGroup) {
      alert('Veuillez entrer le nom du nouveau groupe');
      return;
    }

    setSubmitting(true);

    try {
      const studentData = {
        cef: String(formData.cef).trim(),
        first_name: formData.prenom,
        last_name: formData.nom,
        cin: formData.cin,
        groupType : formData.groupType,
        class_group: formData.groupType === 'existing' ? formData.existingGroup : formData.newGroup
      };

      // Make API call to add student
      const response = await api.post('/students', studentData);
      
      console.log('Student added:', response.data);
      alert('Stagiaire ajouté avec succès!');
      
      // If it was a new group, we should update our local list of groups
      if (formData.groupType === 'nouveau') {
      const updatedGroups = [...groups, { name: formData.newGroup }];
      setGroups(updatedGroups);
      localStorage.setItem('classlist', JSON.stringify(updatedGroups));
    }
      
      // Refresh the student list
      const targetUrl = `/students/classes/${classe}`;
      const refreshResponse = await api.get(targetUrl);
      const data = refreshResponse.data.data || refreshResponse.data;
      const formattedData = formatstudents(data);
      setTrainees(formattedData);
      setFilTrainees(formattedData);
      
      handleCloseModal();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Erreur lors de l\'ajout du stagiaire');
    } finally {
      setSubmitting(false);
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = ['Cef' ,'Nom Complet', 'Groupe', 'Heures', 'Retards', 'Jours', 'Assiduité'];
    const rows = data.map(t => [
      String(t.cef || '').trim(),
      t.name || '',
      t.group || '',
      t.hours || 0,
      t.delays || 0,
      t.days || 0,
      t.sanction?.label || '',
      
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    if (filTrainees.length === 0) {
      alert('Aucun stagiaire à exporter');
      return;
    }
    
    const csv = convertToCSV(filTrainees);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `stagiaires_${timestamp}.csv`, 'text/csv;charset=utf-8;');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Liste des Stagiaires</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            
            h1 {
              text-align: center;
              margin-bottom: 10px;
              color: #2c3e50;
            }
            
            .print-info {
              text-align: center;
              margin-bottom: 20px;
              color: #666;
              font-size: 14px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 12px 8px;
              text-align: left;
            }
            
            th {
              background-color: #2c3e50;
              color: white;
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            tr:hover {
              background-color: #f5f5f5;
            }
            
            td {
              font-size: 13px;
            }
            
            .badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
              color: white;
            }
            
            @media print {
              body {
                padding: 10px;
              }
              
              table {
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <h1>Liste des Stagiaires</h1>
          <div class="print-info">
            ${classe !== 'latest' ? `Groupe: ${classe} | ` : ''}
            Total: ${filTrainees.length} stagiaire${filTrainees.length > 1 ? 's' : ''} | 
            Date: ${new Date().toLocaleDateString('fr-FR')}
          </div>
          <table>
            <thead>
              <tr>
                <th>Cef</th>
                <th>Nom Complet</th>
                <th>Groupe</th>
                <th>Heures</th>
                <th>Retards</th>
                <th>Jours</th>
                <th>Assiduité</th>
              </tr>
            </thead>
            <tbody>
              ${filTrainees.map(trainee => `
                <tr>
                  <td>${trainee.cef || '-'}</td>
                  <td>${trainee.name || '-'}</td>
                  <td>${trainee.group || '-'}</td>
                  <td>${trainee.hours || 0}</td>
                  <td>${trainee.delays || 0}</td>
                  <td>${trainee.days || 0}</td>
                  <td>
                    ${trainee.sanction ? `
                      <span class="badge" style="background-color: ${trainee.sanction.color || '#6c757d'} ; color :${trainee.sanction.color === "#2e7d32"? "white": "rgb(175, 70, 70)"} ">
                        ${trainee.sanction.label}
                      </span>
                    ` : '-'}
                  </td>
                  
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  return (
    <>
      <div className="controls-section">
        <div className="controls-grid">
          <div className="form-group">
            <label className="form-label">Filtrer par groupe</label>
            <select className="input" value={classe} onChange={handleGroupChange}>
              <option value="">Stagiaires À Surveiller Cette Semaine</option>
              {groups && groups.length > 0 ? (
                groups.map(g => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))
              ) : (
                <option disabled>Aucun groupe disponible</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Filtrer par statut</label>
            <select 
              className="input" 
              value={filters.sanction} 
              onChange={(e) => setFilters({ ...filters, sanction: e.target.value })}
            >
              <option value="">Tous les statuts</option>
              {sanctions && sanctions.map(c => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
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

          <button className="btn" onClick={handleAddStudent}>
            <Plus size={16} /> Ajouter
          </button>

          <button className="btn btn-success" onClick={handleExport}>
            <Download size={16} /> Exporter
          </button>

          <button className="btn btn-success" onClick={handlePrint}>
            <Sheet size={16} /> imprimer
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">
          Liste des Stagiaires
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>
            ({filTrainees.length} résultat{filTrainees.length > 1 ? 's' : ''})
          </span>
        </h2>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Chargement des stagiaires...
          </div>
        )}

        {error && (
          <div style={{ color: '#dc3545', padding: '1rem', textAlign: 'center', backgroundColor: '#f8d7da', borderRadius: '4px', margin: '1rem' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <StudentsTable trainees={filTrainees} />
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un Stagiaire</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitStudent}>
              <div className="modal-body">
                {/* CEF and CIN in same row */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CEF <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="number"
                      name="cef"
                      className="input"
                      placeholder="Entrer le CEF"
                      value={formData.cef}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">CIN <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="cin"
                      className="input"
                      placeholder="Entrer le CIN"
                      value={formData.cin}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                {/* Prénom and Nom in same row */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prénom <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="prenom"
                      className="input"
                      placeholder="Entrer le prénom"
                      value={formData.prenom}
                      onChange={handleFormChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nom <span style={{ color: 'red' }}>*</span></label>
                    <input
                      type="text"
                      name="nom"
                      className="input"
                      placeholder="Entrer le nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                {/* Group selection */}
                <div className="form-group">
                  <label className="form-label">Groupe <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="groupType"
                        value="existing"
                        checked={formData.groupType === 'existing'}
                        onChange={handleFormChange}
                      />
                      Groupe existant
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="groupType"
                        value="nouveau"
                        checked={formData.groupType === 'nouveau'}
                        onChange={handleFormChange}
                      />
                      Nouveau groupe
                    </label>
                  </div>

                  {formData.groupType === 'existing' ? (
                    <select
                      name="existingGroup"
                      className="input"
                      value={formData.existingGroup}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Sélectionner un groupe</option>
                      {groups && groups.map(g => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="newGroup"
                      className="input"
                      placeholder="Entrer le nom du nouveau groupe"
                      value={formData.newGroup}
                      onChange={handleFormChange}
                      required
                    />
                  )}
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

export default StudentsTab;