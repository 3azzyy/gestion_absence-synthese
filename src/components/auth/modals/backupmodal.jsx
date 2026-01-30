import React from 'react';
import { Download } from 'lucide-react';

const BackupModal = ({ data, settings, onClose, onRestore, showAlert }) => {
  const downloadBackup = () => {
    const backup = {
      data: data,
      settings: settings,
      version: '2.0',
      date: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_absences_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showAlert('Sauvegarde téléchargée', 'success');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        onRestore(backup);
        showAlert('Données restaurées avec succès', 'success');
        onClose();
      } catch (err) {
        showAlert('Erreur: fichier invalide', 'danger');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal show">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Sauvegarde et restauration</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>

        <div className="card" style={{marginBottom: 16}}>
          <h3 style={{marginTop: 0}}>💾 Sauvegarder les données</h3>
          <p style={{color: 'var(--text-secondary)'}}>
            Télécharger une copie complète de toutes vos données
          </p>
          <button className="btn btn-success" onClick={downloadBackup}>
            <Download size={16} /> Télécharger la sauvegarde
          </button>
        </div>

        <div className="card">
          <h3 style={{marginTop: 0}}>📂 Restaurer depuis une sauvegarde</h3>
          <p style={{color: 'var(--text-secondary)'}}>
            Importer une sauvegarde précédente (écrasera les données actuelles)
          </p>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload}
            className="input"
            style={{marginBottom: 12}}
          />
        </div>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={onClose}>✕ Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;