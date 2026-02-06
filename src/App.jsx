import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
import ClassesTab from './components/auth/common/classes/ClassesTab.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserManagement from './components/auth/admin/UserManagement.jsx';
// Modals
import AddTraineeModal from './components/auth/modals/addtraineemodal.jsx';
import EditTraineeModal from './components/auth/modals/edittraineemodal.jsx';
import SettingsModal from './components/auth/modals/settingsmodal.jsx';
import BackupModal from './components/auth/modals/backupmodal.jsx';

// Utilitaires
import { DEFAULT_SANCTION_CONFIG } from './components/utils/constants';
import { calculateDays, sanctionLabel, exportToCSV } from './components/utils/calculation';
import { getSession, authenticateUser, clearSession } from './components/utils/storage';
import Absence from './components/auth/absences/absencestab.jsx';

// Configuration Axios par défaut
axios.defaults.baseURL = 'http://127.0.0.1:8000';

export default function App() {
  // Instance API pour les appels internes
  const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  // --- ÉTATS D'AUTHENTIFICATION ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- ÉTATS DE L'APPLICATION ---
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

  // --- ÉTATS DES MODALS ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // --- ÉTATS DES FILTRES ---
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [classSearchInput, setClassSearchInput] = useState('');

  // =============================================
  // INITIALISATION & CHARGEMENT DES DONNÉES
  // =============================================

  useEffect(() => {
    const session = getSession();

    const fetchTraineesFromDB = async (token) => {
      try {
        // const response = await api.get('/students', {
        //   headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        // });

        const response = {
          data : {
            data : []
          }
        }

        const apiTrainees = response.data.data.data || response.data.data || [];
        const formattedTrainees = {};

        apiTrainees.forEach(student => {
          formattedTrainees[student.id] = {
            ...student,
            name: student.full_name,
            heures: student.hours || 0,
            retards: student.tardies || 0,
            group: student.group?.name || student.class_group || 'Sans Groupe',
            absenceHistory: student.absenceHistory || []
          };
        });

        setData({ trainees: formattedTrainees });
      } catch (error) {
        console.error("Erreur de récupération DB:", error);
        setData({ trainees: {} });
      }
    };

    if (session && session.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
      setCurrentUser(session);
      setIsAuthenticated(true);
      fetchTraineesFromDB(session.token);
    }

    const savedSettings = localStorage.getItem('gestion_absences_settings');
    const savedSanctions = localStorage.getItem('gestion_absences_sanctions');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedSanctions) setSanctionConfig(JSON.parse(savedSanctions));
  }, []);

  // =============================================
  // LOGIQUE DE CALCUL ET FILTRAGE
  // =============================================

  const handleViewClass = (className) => {
    setGroupFilter(className);
    setSearchInput('');
    setStatusFilter('');
    setActiveTab('students');
  };

  const groups = [...new Set(Object.values(data.trainees).map(t => t.group))].sort();

  const filteredGroupsForClasses = groups.filter(group =>
    group.toLowerCase().includes(classSearchInput.toLowerCase())
  );

  const getFilteredTrainees = useCallback(() => {
    let traineesList = Object.entries(data.trainees).map(([id, t]) => {
      const days = calculateDays(t.heures, t.retards, settings);
      const sanction = sanctionLabel(days, sanctionConfig);
      const attendance = Math.max(0, 10 + (-1 * days) + (-1 * t.retards / 4));

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

    if (groupFilter) traineesList = traineesList.filter(t => t.group === groupFilter);
    if (statusFilter) traineesList = traineesList.filter(t => t.sanction.code === statusFilter);
    if (searchInput) traineesList = traineesList.filter(t =>
      t.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    return traineesList;
  }, [data.trainees, settings, sanctionConfig, groupFilter, statusFilter, searchInput]);

  const getformatedTrainees = useCallback(() => {
    return Object.entries(data.trainees).map(([id, t]) => {
      const days = calculateDays(t.heures, t.retards, settings);
      const sanction = sanctionLabel(days, sanctionConfig);
      const attendance = Math.max(0, 100 - (days / settings.totalDays * 100));

      return {
        id, name: t.name, group: t.group, heures: t.heures || 0,
        retards: t.retards || 0, days: days, attendance: attendance,
        sanction: sanction, data: t
      };
    });
  }, [data.trainees, settings, sanctionConfig]);

  // =============================================
  // GESTIONNAIRES D'ACTIONS (HANDLERS)
  // =============================================

  const showAlert = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setAlerts(prev => prev.filter(a => a.id !== id)), 5000);
  }, []);

  const handleLogin = async (username, password) => {
    const result = await authenticateUser(username, password);
    if (result.success) {
      setCurrentUser(result.session);
      setIsAuthenticated(true);
      showAlert('Connexion réussie', 'success');
      return { success: true };
    }
    showAlert(result.error || 'Erreur de connexion', 'error');
    return { success: false };
  };

  const handleLogout = async () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await clearSession();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setData({ trainees: {} });
      localStorage.clear()
      window.location.reload();
      showAlert('Déconnexion réussie', 'success');
    }
  };

  const addTrainee = (traineeData) => {
    const id = 'ST' + Date.now();
    setData(prev => ({
      ...prev,
      trainees: { ...prev.trainees, [id]: { ...traineeData, absenceHistory: [] } }
    }));
    setShowAddModal(false);
    showAlert(`Stagiaire ${traineeData.name} ajouté`, 'success');
  };

  const editTrainee = (id, traineeData) => {
    setData(prev => ({
      ...prev,
      trainees: { ...prev.trainees, [id]: { ...prev.trainees[id], ...traineeData } }
    }));
    setShowEditModal(false);
    setCurrentEditId(null);
    showAlert('Stagiaire modifié', 'success');
  };

  const deleteTrainee = (id) => {
    if (!window.confirm('Supprimer ce stagiaire ?')) return;
    setData(prev => {
      const newData = { ...prev.trainees };
      delete newData[id];
      return { ...prev, trainees: newData };
    });
    showAlert('Stagiaire supprimé', 'success');
  };

  

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gestion_absences_settings', JSON.stringify(newSettings));
    setShowSettingsModal(false);
    showAlert('Paramètres sauvegardés', 'success');
  };

  const restoreBackup = (backup) => {
    if (backup.data) setData(backup.data);
    if (backup.settings) setSettings(backup.settings);
    if (backup.sanctionConfig) setSanctionConfig(backup.sanctionConfig);
    showAlert('Restauration réussie', 'success');
  };

  // =============================================
  // RENDU PRINCIPAL
  // =============================================

  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="page-wrapper">
        <Header
          settings={settings}
          currentUser={currentUser}
          onSettingsClick={() => setShowSettingsModal(true)}
          onBackupClick={() => setShowBackupModal(true)}
          onLogout={handleLogout}
          trainees={getFilteredTrainees()}
          groups={groups}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onAddClick={() => setShowAddModal(true)}
          onEditClick={(id) => { setCurrentEditId(id); setShowEditModal(true); }}
          onDeleteClick={deleteTrainee}
          onExport={() => exportToCSV(getFilteredTrainees(), settings, sanctionConfig)}
          sanctionConfig={sanctionConfig}
          // onSaveAbsences={handleSaveAbsences}
        />

        <AlertContainer alerts={alerts} />

        <TabsNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
        />

        {/* CONTENU DES ONGLETS */}
        <main className="content-container">
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard: Fast loading with specific stats */}
            <Route path="/dashboard" element={
              <DashboardTab
                settings={settings}                
              />
            } />

            {/* Classes View */}
            <Route path="/classes" element={
              <ClassesTab
                onViewClass={handleViewClass}
                searchInput={classSearchInput}
                setSearchInput={setClassSearchInput}
              />
            } />

            {/* Students View: Full list loading happens here only */}
            <Route path="/view-students/:id" element={
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
                onEditClick={(id) => { setCurrentEditId(id); setShowEditModal(true); }}
                onDeleteClick={deleteTrainee}
                onExport={() => exportToCSV(getFilteredTrainees(), settings, sanctionConfig)}
                sanctionConfig={sanctionConfig}
                // onSaveAbsences={handleSaveAbsences}
              />
            } />

            {/* Analytics View */}
            <Route path="/analytics" element={
              <AnalyticsTab trainees={getformatedTrainees()} settings={settings} />
            } />

            {/* Print View */}
            <Route path="/print" element={
              <PrintTab trainees={getFilteredTrainees()} sanctionConfig={sanctionConfig} />
            } />

            {/* Admin: User Management */}
            {currentUser?.role === 'admin' && (<>
              <Route path="/users" element={
                <UserManagement
                  currentUser={currentUser}
                  showAlert={showAlert}
                />
              } />

              <Route path="/absence-history" element={
                <Absence />
              } />
            </>)}

            {/* Fallback for 404s */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

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
            onClose={() => { setShowEditModal(false); setCurrentEditId(null); }}
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