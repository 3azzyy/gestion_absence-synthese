import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Shield, User, Key } from 'lucide-react';
import AddUserModal from '../modals/AddUserModal';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';

const UserManagement = ({ currentUser, showAlert }) => {
  // State for users 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users from localStorage on component mount
  useEffect(() => {
    const loadUsers = () => {
      try {
        const savedUsers = localStorage.getItem('app_users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          // Initialize with default admin user if no users exist
          const defaultUsers = [
            {
              id: 1,
              username: 'admin',
              role: 'admin',
              created_at: new Date().toISOString()
            }
          ];
          setUsers(defaultUsers);
          localStorage.setItem('app_users', JSON.stringify(defaultUsers));
        }
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users]);

  // Handle adding a new user
  const handleAddUser = (formData) => {
    try {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const newUser = {
        id: newId,
        username: formData.username,
        password: formData.password,
        role: formData.role || 'user',
        created_at: new Date().toISOString()
      };

      if (users.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
        showAlert('Ce nom d\'utilisateur existe déjà', 'error');
        return;
      }

      setUsers(prevUsers => [...prevUsers, newUser]);
      showAlert(`Utilisateur "${formData.username}" créé avec succès`, 'success');
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
      showAlert('Erreur lors de la création de l\'utilisateur', 'error');
    }
  };

  // Handle updating password
  const handleUpdatePassword = (newPassword) => {
    if (!selectedUser) return;

    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, password: newPassword }
            : user
        )
      );
      showAlert(`Mot de passe de "${selectedUser.username}" modifié avec succès`, 'success');
      setShowPasswordModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating password:', error);
      showAlert('Erreur lors de la modification du mot de passe', 'error');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) return;

    if (userId === currentUser?.id) {
      showAlert('Vous ne pouvez pas supprimer votre propre compte', 'error');
      return;
    }

    const adminCount = users.filter(u => u.role === 'admin').length;
    if (userToDelete.role === 'admin' && adminCount <= 1) {
      showAlert('Vous ne pouvez pas supprimer le dernier administrateur', 'error');
      return;
    }

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userToDelete.username}" ?`)) {
      return;
    }

    try {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      showAlert(`Utilisateur "${userToDelete.username}" supprimé avec succès`, 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('Erreur lors de la suppression de l\'utilisateur', 'error');
    }
  };

  // Open password modal for a specific user
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontSize: '16px', color: '#64748b' }}>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 48px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
            <Users size={36} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>Gestion des utilisateurs</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Gérez les comptes et les permissions</p>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}>
          <Plus size={20} strokeWidth={2.5} />
          Créer utilisateur
        </button>
      </div>

      {/* Users Table */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '20px 24px', textAlign: 'left', color: '#334155', fontSize: '13px' }}>ID</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', color: '#334155', fontSize: '13px' }}>Nom d'utilisateur</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', color: '#334155', fontSize: '13px' }}>Rôle</th>
                <th style={{ padding: '20px 24px', textAlign: 'left', color: '#334155', fontSize: '13px' }}>Date de création</th>
                <th style={{ padding: '20px 24px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Aucun utilisateur trouvé</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '20px 24px', color: '#64748b' }}>#{user.id}</td>
                    <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#0284c7" />
                            </div>
                            <span style={{ fontWeight: '600' }}>{user.username}</span>
                        </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', background: user.role === 'admin' ? '#fee2e2' : '#dbeafe', color: user.role === 'admin' ? '#991b1b' : '#1e40af' }}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px' }}>{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => openPasswordModal(user)}
                          style={{ 
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            border: '1px solid #bfdbfe', 
                            background: '#dbeafe', 
                            color: '#1e40af', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                          title="Modifier le mot de passe"
                        >
                          <Key size={16} />
                          Changer le mot de passe
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          disabled={user.id === currentUser?.id}
                          style={{ 
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            border: '1px solid #fecaca', 
                            background: '#fee2e2', 
                            color: '#991b1b', 
                            cursor: user.id === currentUser?.id ? 'not-allowed' : 'pointer',
                            opacity: user.id === currentUser?.id ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddUserModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddUser} 
        />
      )}

      {showPasswordModal && (
        <UpdatePasswordModal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUpdatePassword}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagement;