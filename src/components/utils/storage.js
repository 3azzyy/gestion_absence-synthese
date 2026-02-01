import { DEFAULT_USERS } from './constants';
import axios from 'axios';

const AUTH_KEY = 'ista_auth_session';
const USERS_KEY = 'ista_users';
const BASE_URL = 'http://127.0.0.1:8000/api';


// Initialiser les utilisateurs par défaut
export const initDefaultUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

// Vérifier la session
export const getSession = () => {
  const session = localStorage.getItem(AUTH_KEY);
  return session ? JSON.parse(session) : null;
};

// Créer une session

export const createSession = (user, token) => {
  const session = {
    username: user.username,
    fullName: user.full_name, // Mapping from Laravel DB 'full_name'
    role: user.role,
    token: token,             // Crucial: This identifies you to the API
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  
  // Set the default header for all future axios calls
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  return session;
};


// export const createSession = (user) => {
//   const session = {
//     username: user.username,
//     fullName: user.fullName,
//     role: user.role,
//     loginTime: new Date().toISOString()
//   };
//   localStorage.setItem(AUTH_KEY, JSON.stringify(session));
//   return session;
// };

// Supprimer la session
// storage.js

export const clearSession = async () => {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (session?.token) {
      // Use axios directly instead of 'api'
      await axios.post(`${BASE_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
    }
  } catch (error) {
    console.error("Logout request failed, but clearing local session anyway.", error);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    // Remove the header from the global axios if you're using it
    delete axios.defaults.headers.common['Authorization'];
  }
};


// Authentification

export const authenticateUser = async (username, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      username,
      password
    });

    console.log('Réponse de l\'API de connexion :', response.data);

    // Check if Laravel returned success
    if (response.data.success) {
      const { user, token } = response.data.data;
      const session = createSession(user, token);
      return { success: true, user, session };
    }
    
    return { success: false, error: 'Réponse invalide du serveur' };
  } catch (error) {
    // Handle 401 Unauthorized or Connection errors
    const message = error.response?.data?.message || 'Identifiants incorrects ou serveur injoignable';
    return { success: false, error: message };
  }
};


// export const authenticateUser = (username, password) => {
//   const users = JSON.parse(localStorage.getItem(USERS_KEY));
//   const user = users[username];
  
//   if (!user || user.password !== password) {
//     return { success: false, error: 'Identifiants incorrects' };
//   }
  
//   // Mettre à jour la dernière connexion
//   users[username].lastLogin = new Date().toISOString();
//   localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
//   const session = createSession(user);
//   return { success: true, user, session };
// };