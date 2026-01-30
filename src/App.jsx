import React, { useState, useEffect, useCallback } from 'react';

// Composants
// Composants
import GlobalStyles from './components/auth/common/globalstyle.jsx';
import AlertContainer from './components/auth/common/alertcontainer.jsx';
import LoginPage from './components/auth/login.jsx';
import Header from './components/auth/layout/header.jsx';
import TabsNavigation from './components/auth/layout/tabnavigation.jsx';
import Footer from './components/auth/layout/footer.jsx';
import DashboardTab from './components/auth/dashboard/dashboardtab.jsx';
import StudentsTab from './components/auth/students/studentstab.jsx';
import AnalyticsTab from './components/auth/analytics/analyticstab.jsx';
import PrintTab from './components/auth/print/printtab.jsx';
import AddTraineeModal from './components/auth/modals/addtraineemodal.jsx';
import EditTraineeModal from './components/auth/modals/edittraineemodal.jsx';
import SettingsModal from './components/auth/modals/settingsmodal.jsx';
import BackupModal from './components/auth/modals/backupmodal.jsx';

// Utilitaires
import { DEFAULT_SANCTION_CONFIG } from './components/utils/constants';
import { calculateDays, sanctionLabel, exportToCSV } from './components/utils/calculation';
import { initDefaultUsers, getSession, authenticateUser, clearSession } from './components/utils/storage';





// =============================================
// MAIN APP COMPONENT
// =============================================

export default function App() {
  // États d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // États de l'application
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ trainees: {} });
  const [settings, setSettings] = useState({
    hoursPerDay: 10,
    retardsPerDay: 4,
    year: 2025,
    totalDays: 200
  });
  const [sanctionConfig, setSanctionConfig] = useState(DEFAULT_SANCTION_CONFIG);
  const [alerts, setAlerts] = useState([]);

  // États des modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // États des filtres
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // =============================================
  // INITIALISATION
  // =============================================

  useEffect(() => {
    // Initialiser les utilisateurs par défaut
    initDefaultUsers();

    // Vérifier la session existante
    const session = getSession();
    if (session) {
      setCurrentUser(session);
      setIsAuthenticated(true);
    }

    // Charger les données sauvegardées
    const savedData = localStorage.getItem('gestion_absences_2025');
    const savedSettings = localStorage.getItem('gestion_absences_settings');
    const savedSanctions = localStorage.getItem('gestion_absences_sanctions');

    if (savedData) setData(JSON.parse(savedData));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedSanctions) setSanctionConfig(JSON.parse(savedSanctions));
  }, []);

  // =============================================
  // GESTION DES ALERTES
  // =============================================

  const showAlert = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 5000);
  }, []);

  // =============================================
  // AUTHENTIFICATION
  // =============================================

  const handleLogin = (username, password) => {
    const result = authenticateUser(username, password);
    
    if (result.success) {
      setCurrentUser(result.session);
      setIsAuthenticated(true);
      return { success: true };
    }
    
    return { success: false };
  };

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      clearSession();
      setIsAuthenticated(false);
      setCurrentUser(null);
      showAlert('Déconnexion réussie', 'success');
    }
  };

  // =============================================
  // GESTION DES DONNÉES
  // =============================================

  const saveData = useCallback((newData) => {
    setData(newData);
    localStorage.setItem('gestion_absences_2025', JSON.stringify(newData));
  }, []);

  const restoreBackup = (backup) => {
    if (backup.data) setData(backup.data);
    if (backup.settings) setSettings(backup.settings);
    if (backup.sanctionConfig) setSanctionConfig(backup.sanctionConfig);
    localStorage.setItem('gestion_absences_2025', JSON.stringify(backup.data));
    localStorage.setItem('gestion_absences_settings', JSON.stringify(backup.settings));
    if (backup.sanctionConfig) {
      localStorage.setItem('gestion_absences_sanctions', JSON.stringify(backup.sanctionConfig));
    }
  };

  // =============================================
  // GESTION DES STAGIAIRES
  // =============================================

  const addTrainee = (traineeData) => {
    const id = 'ST' + Date.now();
    const newData = {
      ...data,
      trainees: {
        ...data.trainees,
        [id]: {
          ...traineeData,
          logs: [],
          files: []
        }
      }
    };
    saveData(newData);
    showAlert(`Stagiaire ${traineeData.name} ajouté avec succès`, 'success');
  };

  const editTrainee = (id, traineeData) => {
    const newData = {
      ...data,
      trainees: {
        ...data.trainees,
        [id]: {
          ...data.trainees[id],
          ...traineeData
        }
      }
    };
    saveData(newData);
    showAlert('Stagiaire modifié avec succès', 'success');
    setShowEditModal(false);
    setCurrentEditId(null);
  };

  const deleteTrainee = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) return;
    const newData = { ...data };
    delete newData.trainees[id];
    saveData(newData);
    showAlert('Stagiaire supprimé', 'success');
  };

  // =============================================
  // FILTRAGE DES STAGIAIRES
  // =============================================

  const getFilteredTrainees = useCallback(() => {
    let trainees = Object.entries(data.trainees).map(([id, t]) => {
      const days = calculateDays(t.heures, t.retards, settings);
      const sanction = sanctionLabel(days, sanctionConfig);
      const attendance = Math.max(0, 100 - (days / settings.totalDays * 100));
      
      return {
        id,
        name: t.name,
        group: t.group,
        heures: t.heures || 0,
        retards: t.retards || 0,
        days: days,
        attendance: attendance,
        sanction: sanction,
        data: t
      };
    });

    if (groupFilter) trainees = trainees.filter(t => t.group === groupFilter);
    if (statusFilter) trainees = trainees.filter(t => t.sanction.code === statusFilter);
    if (searchInput) trainees = trainees.filter(t => 
      t.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return trainees;
  }, [data.trainees, settings, sanctionConfig, groupFilter, statusFilter, searchInput]);

  // =============================================
  // GESTION DES PARAMÈTRES
  // =============================================

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gestion_absences_settings', JSON.stringify(newSettings));
    setShowSettingsModal(false);
    showAlert('Paramètres sauvegardés', 'success');
  };

  // =============================================
  // RÉCUPÉRATION DES GROUPES
  // =============================================

  const groups = [...new Set(Object.values(data.trainees).map(t => t.group))].sort();

  // =============================================
  // GESTION DES RACCOURCIS CLAVIER
  // =============================================

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K pour rechercher
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Nom du stagiaire"]');
        if (searchInput) searchInput.focus();
      }
      
      // Ctrl/Cmd + N pour ajouter
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (activeTab === 'students') setShowAddModal(true);
      }

      // Ctrl/Cmd + , pour paramètres
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setShowSettingsModal(true);
      }

      // ESC pour fermer les modals
      if (e.key === 'Escape') {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowSettingsModal(false);
        setShowBackupModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab]);

  // =============================================
  // RENDU
  // =============================================

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  // Si authentifié, afficher l'application complète
  return (
    <>
      <GlobalStyles />
      
      <div className="page-wrapper">
        <Header 
          settings={settings}
          currentUser={currentUser}
          onSettingsClick={() => setShowSettingsModal(true)}
          onBackupClick={() => setShowBackupModal(true)}
          onUndoClick={() => showAlert('Fonction d\'annulation à venir', 'info')}
          onSanctionConfigClick={() => showAlert('Configuration sanctions à venir', 'info')}
          onBulkOperationsClick={() => showAlert('Opérations groupées à venir', 'info')}
          onLogout={handleLogout}
        />

        <AlertContainer alerts={alerts} />

        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'dashboard' && (
          <DashboardTab 
            trainees={getFilteredTrainees()} 
            settings={settings}
            sanctionConfig={sanctionConfig}
            onViewStudent={(id) => {
              showAlert('Vue détaillée à venir', 'info');
            }}
          />
        )}

        {activeTab === 'students' && (
          <StudentsTab
            trainees={getFilteredTrainees()}
            groups={groups}
            groupFilter={groupFilter}
            setGroupFilter={setGroupFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onAddClick={() => setShowAddModal(true)}
            onEditClick={(id) => {
              setCurrentEditId(id);
              setShowEditModal(true);
            }}
            onDeleteClick={deleteTrainee}
            onViewClick={(id) => showAlert('Vue détaillée à venir', 'info')}
            onExport={() => exportToCSV(getFilteredTrainees(), settings, sanctionConfig)}
            sanctionConfig={sanctionConfig}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab 
            trainees={getFilteredTrainees()}
            settings={settings}
          />
        )}

        {activeTab === 'print' && (
          <PrintTab 
            trainees={getFilteredTrainees()} 
            sanctionConfig={sanctionConfig}
          />
        )}

        {/* MODALS */}
        {showAddModal && (
          <AddTraineeModal
            onClose={() => setShowAddModal(false)}
            onAdd={addTrainee}
          />
        )}

        {showEditModal && currentEditId && (
          <EditTraineeModal
            trainee={data.trainees[currentEditId]}
            onClose={() => {
              setShowEditModal(false);
              setCurrentEditId(null);
            }}
            onEdit={(traineeData) => editTrainee(currentEditId, traineeData)}
          />
        )}

        {showSettingsModal && (
          <SettingsModal
            settings={settings}
            onClose={() => setShowSettingsModal(false)}
            onSave={handleSaveSettings}
          />
        )}

        {showBackupModal && (
          <BackupModal
            data={data}
            settings={settings}
            onClose={() => setShowBackupModal(false)}
            onRestore={restoreBackup}
            showAlert={showAlert}
          />
        )}

        <Footer />
      </div>
    </>
  );
}