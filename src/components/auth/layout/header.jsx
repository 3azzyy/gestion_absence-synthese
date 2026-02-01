import React from 'react';
import { Settings, Scale, Save, Undo, Zap, LogOut, Users } from 'lucide-react';

const Header = ({ 
  settings, 
  currentUser, 
  onSettingsClick, 
  onBackupClick, 
  onUndoClick, 
  onSanctionConfigClick, 
  onBulkOperationsClick, 
  onLogout 
}) => {
  // Safe extraction of display names to prevent "Cannot read properties of null" errors
  const displayName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Utilisateur';
  const displayRole = currentUser?.role ? ` (${currentUser.role})` : '';

  return (
    <div className="page-header">
      <div className="header-top">
        <div>
          <h1 className="header-title">Système Complet de Gestion des Absences</h1>
          <p className="header-subtitle">
            Année académique {settings?.year || '2025'} — Suivi avancé des présences
          </p>
          <span className="header-rule">
            Règle: {settings?.hoursPerDay || 10}h = 1j • {settings?.retardsPerDay || 4} retards = 1j
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
          <div className="user-badge">
            <Users size={16} />
            <span>{displayName}{displayRole}</span>
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={onSettingsClick} title="Paramètres">
              <Settings size={18} />
            </button>

            {onSanctionConfigClick && (
              <button className="icon-btn" onClick={onSanctionConfigClick} title="Configuration sanctions">
                <Scale size={18} />
              </button>
            )}

            {onBulkOperationsClick && (
              <button className="icon-btn" onClick={onBulkOperationsClick} title="Opérations groupées">
                <Zap size={18} />
              </button>
            )}

            <button className="icon-btn" onClick={onBackupClick} title="Sauvegarde">
              <Save size={18} />
            </button>

            <button className="icon-btn" onClick={onUndoClick} title="Annuler">
              <Undo size={18} />
            </button>

            <button 
              className="icon-btn" 
              onClick={onLogout} 
              title="Déconnexion" 
              style={{ background: '#dc3545', color: 'white', borderColor: '#dc3545' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;