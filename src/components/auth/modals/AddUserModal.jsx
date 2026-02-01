import React, { useState } from 'react';
import { X, User, Key, Shield, Plus, Eye, EyeOff } from 'lucide-react';

const AddUserModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username) newErrors.username = "Nom d'utilisateur requis";
    if (formData.password.length < 6) newErrors.password = "Mot de passe trop court (min 6)";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call the parent function to save data
    onAdd(formData);
  };

  return (
    <div className="modal show" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '450px', width: '100%', background: 'white', padding: '24px', borderRadius: '12px' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Ajouter un utilisateur</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Nom d'utilisateur
            </label>
            <input 
              type="text"
              className="input"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Entrez le nom d'utilisateur"
            />
            {errors.username && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.username}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              <Key size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                style={{ width: '100%', padding: '10px', paddingRight: '40px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 6 caractères"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
              >
                {showPassword ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
              </button>
            </div>
            {errors.password && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              <Key size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="input"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Confirmez le mot de passe"
            />
            {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              <Shield size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Rôle
            </label>
            <select
              className="input"
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose} 
              style={{ 
                padding: '10px 20px', 
                background: '#f1f5f9', 
                color: '#475569', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn" 
              style={{ 
                padding: '10px 20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#0284c7', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              <Plus size={16} /> Créer compte
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
