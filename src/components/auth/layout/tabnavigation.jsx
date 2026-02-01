import React from 'react';
import { BarChart3, Users, Printer, Shield } from 'lucide-react';

const TabsNavigation = ({ activeTab, setActiveTab, currentUser }) => (
  <div className="tabs">
    <button 
      className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} 
      onClick={() => setActiveTab('dashboard')}
    >
      <BarChart3 size={16} style={{display: 'inline', marginRight: 4}} /> Tableau de bord
    </button>
    <button 
      className={`tab ${activeTab === 'classes' ? 'active' : ''}`} 
      onClick={() => setActiveTab('classes')}
    >
      <Users size={16} style={{display: 'inline', marginRight: 4}} /> Classes
    </button>
    <button 
      className={`tab ${activeTab === 'students' ? 'active' : ''}`} 
      onClick={() => setActiveTab('students')}
    >
      <Users size={16} style={{display: 'inline', marginRight: 4}} /> Stagiaires
    </button>
    <button 
      className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} 
      onClick={() => setActiveTab('analytics')}
    >
      <BarChart3 size={16} style={{display: 'inline', marginRight: 4}} /> Analyses
    </button>
    <button 
      className={`tab ${activeTab === 'print' ? 'active' : ''}`} 
      onClick={() => setActiveTab('print')}
    >
      <Printer size={16} style={{display: 'inline', marginRight: 4}} /> Impressions
    </button>
    
    {/* Onglet Utilisateurs - Seulement pour les admins */}
    {currentUser?.role === 'admin' && (
      <button 
        className={`tab ${activeTab === 'users' ? 'active' : ''}`} 
        onClick={() => setActiveTab('users')}
      >
        <Shield size={16} style={{display: 'inline', marginRight: 4}} /> Utilisateurs
      </button>
    )}
  </div>
);

export default TabsNavigation;