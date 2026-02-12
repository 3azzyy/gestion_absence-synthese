import React from 'react';
import { Settings, Scale, Save, Undo, Zap, LogOut, Users } from 'lucide-react';
import FilterControls from '../students/filtercontrols';

const Header = ({
  settings,
  currentUser,
  onSettingsClick,
  onBackupClick,
  onUndoClick,
  onSanctionConfigClick,
  onBulkOperationsClick,
  onLogout,
  sanctionConfig,
}) => {
  // Safe extraction of display names to prevent "Cannot read properties of null" errors
  const displayName = currentUser?.fullName || currentUser?.name || currentUser?.username || 'Utilisateur';
  const displayRole = currentUser?.role ? ` (${currentUser.role})` : '';

  const uniqueCodes = [...new Set(sanctionConfig.map(s => s.code))];

  return (
    <div className="page-header">
      <div className="header-top">
        <div>
          <h1 className="header-title">Système de Gestion des Absences</h1>
          <p className="header-subtitle">
            Année de formation 25/26 — Suivi des stagiaires
          </p>
          <span className="header-rule">
            Règle: 5h = 1j • 4 retards = 1j
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'flex-end' }}>
          <div className="user-badge">
            <Users size={16} />
            <span>{displayName}{displayRole}</span>
          </div>
          <button
            className="icon-btn"
            onClick={onLogout}
            title="Déconnexion"
            style={{ background: '#dc3545', color: 'white', borderColor: '#dc3545' }}
          >
            <LogOut size={16} />
          </button>

          {/* <div className="header-actions">
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

            
          </div> */}
        </div>
      </div>


    </div>
  );
};

export default Header;