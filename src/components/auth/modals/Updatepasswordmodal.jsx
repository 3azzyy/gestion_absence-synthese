import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

const UpdatePasswordModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Le mot de passe est requis';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.newPassword);
      setFormData({ newPassword: '', confirmPassword: '' });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ newPassword: '', confirmPassword: '' });
    setErrors({});
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              Modifier le mot de passe
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#dbeafe',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#1e40af'
            }}>
              Utilisateur: <strong>{user?.username}</strong>
            </div>

            {/* New Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#334155'
              }}>
                Nouveau mot de passe *
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Entrez le nouveau mot de passe"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.newPassword ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.newPassword && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.newPassword}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#334155'
              }}>
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirmez le nouveau mot de passe"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: errors.confirmPassword ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {errors.confirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '10px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                background: 'white',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;