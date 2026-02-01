import React, { useState } from 'react';
import { X, User, Key, Shield, AlertCircle, Save } from 'lucide-react';

const EditUserModal = ({ user, onClose, onEdit, currentUserId }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    password: '',
    confirmPassword: '',
    role: user.role
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }
    
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updateData = {
      username: formData.username,
      role: formData.role
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    onEdit(updateData);
  };

  const isOwnAccount = user.id === currentUserId;

  return (
    <div className="modal show">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Modifier l'utilisateur</h2>
          <button className="close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">
              <User size={12} style={{ display: 'inline', marginRight: 4 }} />
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              className="input"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors({ ...errors, username: '' });
              }}
            />
            {errors.username && (
              <div style={{ 
                color: '#dc2626', 
                fontSize: '12px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={12} />
                {errors.username}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">
              <Key size={12} style={{ display: 'inline', marginRight: 4 }} />
              Nouveau mot de passe (optionnel)
            </label>
            <input
              type="password"
              className="input"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              placeholder="Laisser vide pour ne pas changer"
            />
            {errors.password && (
              <div style={{ 
                color: '#dc2626', 
                fontSize: '12px', 
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle size={12} />
                {errors.password}
              </div>
            )}
          </div>

          {formData.password && (
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">
                <Key size={12} style={{ display: 'inline', marginRight: 4 }} />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                className="input"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  setErrors({ ...errors, confirmPassword: '' });
                }}
              />
              {errors.confirmPassword && (
                <div style={{ 
                  color: '#dc2626', 
                  fontSize: '12px', 
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertCircle size={12} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">
              <Shield size={12} style={{ display: 'inline', marginRight: 4 }} />
              Rôle *
            </label>
            <select
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isOwnAccount}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            {isOwnAccount && (
              <div style={{ 
                fontSize: '12px', 
                color: '#ea580c', 
                marginTop: '6px',
                padding: '8px 12px',
                background: '#fff7ed',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={12} />
                Vous ne pouvez pas modifier votre propre rôle
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn">
              <Save size={16} /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;