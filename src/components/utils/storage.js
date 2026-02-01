import { DEFAULT_USERS } from './constants';
import axios from 'axios';

const AUTH_KEY = 'ista_auth_session';
const USERS_KEY = 'ista_users';
const BASE_URL = 'http://127.0.0.1:8000/api';

// =============================================
// USER MANAGEMENT (LOCAL STORAGE)
// =============================================

// Initialiser les utilisateurs par défaut
export const initDefaultUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    // If you have DEFAULT_USERS in constants, use them; otherwise fallback to basic admin
    const initialData = DEFAULT_USERS || [
      { id: 1, username: 'admin', password: 'admin123', role: 'admin', created_at: new Date().toISOString() }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(existingUsers);
};

// Récupérer tous les utilisateurs
export const getAllUsers = () => {
  return initDefaultUsers();
};

// Ajouter un utilisateur
export const addUser = (userData) => {
  const users = getAllUsers();
  
  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    throw new Error('Ce nom d\'utilisateur existe déjà');
  }
  
  const newUser = {
    id: Date.now(),
    username: userData.username,
    password: userData.password, 
    role: userData.role || 'user',
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

// Modifier un utilisateur
export const updateUser = (userId, userData) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      username: userData.username,
      role: userData.role,
      ...(userData.password && { password: userData.password })
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  }
  return null;
};

// Modifier le rôle d'un utilisateur
export const updateUserRole = (userId, newRole) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index] = {
      ...users[index],
      role: newRole
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  }
  return null;
};

// Supprimer un utilisateur
export const deleteUser = (userId) => {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  return true;
};

// Compter les administrateurs
export const countAdmins = () => {
  const users = getAllUsers();
  return users.filter(u => u.role === 'admin').length;
};

// =============================================
// AUTHENTICATION & SESSION (API + LOCAL)
// =============================================

// Vérifier la session
export const getSession = () => {
  const session = localStorage.getItem(AUTH_KEY);
  return session ? JSON.parse(session) : null;
};

// Créer une session
export const createSession = (user, token) => {
  const session = {
    id: user.id,
    username: user.username,
    // FIX: Fallback logic ensures fullName is never undefined for the Header
    fullName: user.fullName || user.full_name || user.username, 
    role: user.role,
    token: token,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  
  // Set the default header for all future axios calls
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return session;
};

// Supprimer la session
export const clearSession = async () => {
  try {
    const session = getSession();
    if (session?.token) {
      // Note: This matches your BASE_URL defined above
      await axios.post(`${BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
    }
  } catch (error) {
    console.error("Logout request failed, but clearing local session anyway.", error);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Authentification (API priority with Local fallback check)
export const authenticateUser = async (username, password) => {
  try {
    // Attempt API Login first
    const response = await axios.post(`${BASE_URL}/login`, {
      username,
      password
    });

    if (response.data.success) {
      const { user, token } = response.data.data;
      const session = createSession(user, token);
      return { success: true, user, session };
    }
  } catch (error) {
    console.warn("API login failed, checking local users...");
    
    // Local Fallback (Useful for offline development or local-only admins)
    const users = getAllUsers();
    // Safety check: ensure users is an array before calling .find
    const localUser = (users || []).find(u => u.username === username && u.password === password);
    
    if (localUser) {
      const session = createSession(localUser, 'local_token_' + Date.now());
      return { success: true, user: localUser, session };
    }

    const message = error.response?.data?.message || 'Identifiants incorrects';
    return { success: false, error: message };
  }
  return { success: false, error: 'Identifiants incorrects' };
};

// =============================================
// API INTEGRATION (FOR WHEN BACKEND IS READY)
// =============================================

/**
 * Fetch users from API
 * Uncomment and use when backend is ready
 */
export const fetchUsersFromAPI = async () => {
  try {
    const session = getSession();
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${session?.token}` }
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Error fetching users from API:', error);
    return { success: false, error: error.response?.data?.message || 'Erreur de chargement' };
  }
};

/**
 * Create user via API
 * Uncomment and use when backend is ready
 */
export const createUserAPI = async (userData) => {
  try {
    const session = getSession();
    const response = await axios.post(`${BASE_URL}/users`, userData, {
      headers: { Authorization: `Bearer ${session?.token}` }
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Error creating user via API:', error);
    return { success: false, error: error.response?.data?.message || 'Erreur de création' };
  }
};

/**
 * Update user role via API
 * Uncomment and use when backend is ready
 */
export const updateUserRoleAPI = async (userId, role) => {
  try {
    const session = getSession();
    const response = await axios.put(`${BASE_URL}/users/${userId}/role`, { role }, {
      headers: { Authorization: `Bearer ${session?.token}` }
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Error updating user role via API:', error);
    return { success: false, error: error.response?.data?.message || 'Erreur de modification' };
  }
};

/**
 * Delete user via API
 * Uncomment and use when backend is ready
 */
export const deleteUserAPI = async (userId) => {
  try {
    const session = getSession();
    const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${session?.token}` }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting user via API:', error);
    return { success: false, error: error.response?.data?.message || 'Erreur de suppression' };
  }
};
