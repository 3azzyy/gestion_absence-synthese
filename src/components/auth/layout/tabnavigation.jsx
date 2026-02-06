import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, Printer, Shield, Pen } from 'lucide-react';

const TabsNavigation = ({ currentUser }) => {
  // Helper for consistent styling
  const iconStyle = { display: 'inline', marginRight: 4 };

  return (
    <div className="tabs">
      <NavLink to="/dashboard" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        <BarChart3 size={16} style={iconStyle} /> Tableau de bord
      </NavLink>
      
      <NavLink to="/classes" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        <Users size={16} style={iconStyle} /> Classes
      </NavLink>
      
      <NavLink to="/view-students/latest" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        <Users size={16} style={iconStyle} /> Stagiaires
      </NavLink>
      
      <NavLink to="/analytics" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        <BarChart3 size={16} style={iconStyle} /> Analyses
      </NavLink>
      
      <NavLink to="/print" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
        <Printer size={16} style={iconStyle} /> Impressions
      </NavLink>
      
      {/* Admin Only Routes */}
      {currentUser?.role === 'admin' && (
        <>
          <NavLink to="/users" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
            <Shield size={16} style={iconStyle} /> Utilisateurs
          </NavLink>
          
          <NavLink to="/absence-history" className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>
            <Pen size={16} style={iconStyle} /> Absences
          </NavLink>
        </>
      )}
    </div>
  );
};

export default TabsNavigation;