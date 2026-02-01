import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Shield, User, Key } from 'lucide-react';
import AddUserModal from '../modals/AddUserModal';
import axios from 'axios';
import UpdatePasswordModal from '../modals/UpdatePasswordModal';

const UserManagement = ({ currentUser, showAlert }) => {
  // State for users 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getAuthToken = () => {
    const session = JSON.parse(localStorage.getItem('ista_auth_session'));
    return session?.token;
  };

  // --- API CALL: Fetch Users ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      // Assuming your API returns { success: true, data: [...] }
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- API CALL: Create User ---
  const handleAddUser = async (formData) => {
    try {
      await axios.post('/api/register', {
        username: formData.username,
        password: formData.password,
        full_name: formData.username, // Adjust based on your form fields
        role: formData.role || 'staff'
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      showAlert(`Utilisateur "${formData.username}" créé avec succès`, 'success');
      setShowAddModal(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur de création';
      showAlert(msg, 'error');
    }
  };

  // --- API CALL: Update Password ---
  const handleUpdatePassword = async (newPassword) => {
    if (!selectedUser) return;
    try {
      await axios.put(`/api/users/${selectedUser.id}/password`, {
        password: newPassword
      }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });

      showAlert(`Mot de passe modifié pour ${selectedUser.username}`, 'success');
      setShowPasswordModal(false);
      fetchUsers();
    } catch (error) {
      showAlert('Erreur lors de la modification', 'error');
    }
  };

  // --- API CALL: Delete User ---
  const handleDeleteUser = async (userId) => {
    if (userId === currentUser?.id) {
      showAlert('Vous ne pouvez pas supprimer votre propre compte', 'error');
      return;
    }

    if (!window.confirm(`Supprimer cet utilisateur ?`)) return;

    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      });
      showAlert('Utilisateur supprimé', 'success');
      fetchUsers();
    } catch (error) {
      showAlert('Erreur de suppression', 'error');
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
          onAdd={handleAddUser}
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